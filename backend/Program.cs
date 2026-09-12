using DevForge.Backend.Data;
using DevForge.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

    // Database: SQLite with WAL mode & auto-migration
    var dbPath = Path.Combine(builder.Environment.ContentRootPath, "devforge_enterprise.db");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite($"Data Source={dbPath}"));

    // Services
    builder.Services.AddSingleton<IPasswordHasher, Argon2idPasswordHasher>();
    builder.Services.AddSingleton<IJwtService, JwtService>();

    // JWT Authentication & Strict Auth Gate
    var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "DevForgeEnterpriseSecretKeyForRecruiterValidationMustBeAtLeast32BytesLong!";
    var key = Encoding.UTF8.GetBytes(jwtSecret);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

    builder.Services.AddAuthorization();
    builder.Services.AddOpenApi();
    builder.Services.AddHealthChecks();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });

    var app = builder.Build();

    // Auto-create database schema on startup
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureCreated();
    }

    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

    app.UseCors("AllowFrontend");
    app.UseAuthentication();
    app.UseAuthorization();

    // Health Check Probes
    app.MapHealthChecks("/health/live").AllowAnonymous();
    app.MapHealthChecks("/health/ready").AllowAnonymous();
    app.MapHealthChecks("/health").AllowAnonymous();

    // ==========================================
    // IDENTITY & AUTHENTICATION ENDPOINTS
    // ==========================================

    // POST /api/v1/auth/register
    app.MapPost("/api/v1/auth/register", async (RegisterRequest req, AppDbContext db, IPasswordHasher hasher, IJwtService jwt) =>
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return Results.BadRequest(new { error = "Email and password are required" });

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();
        var existingUser = await db.Users.AnyAsync(u => u.Email == normalizedEmail);
        if (existingUser)
            return Results.Conflict(new { error = "User with this email already exists" });

        var passwordHash = hasher.HashPassword(req.Password);
        var user = new User
        {
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            PreferredLanguage = string.IsNullOrWhiteSpace(req.PreferredLanguage) ? "en" : req.PreferredLanguage
        };

        db.Users.Add(user);
        db.UserStreaks.Add(new UserStreak { UserId = user.Id });
        await db.SaveChangesAsync();

        var token = jwt.GenerateToken(user);
        return Results.Ok(new
        {
            token,
            user = new
            {
                id = user.Id,
                email = user.Email,
                preferredLanguage = user.PreferredLanguage,
                createdAt = user.CreatedAtUtc
            }
        });
    }).WithName("RegisterUser");

    // POST /api/v1/auth/login
    app.MapPost("/api/v1/auth/login", async (LoginRequest req, AppDbContext db, IPasswordHasher hasher, IJwtService jwt) =>
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return Results.BadRequest(new { error = "Email and password are required" });

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
        if (user == null || !hasher.VerifyPassword(req.Password, user.PasswordHash))
            return Results.Unauthorized();

        var token = jwt.GenerateToken(user);
        return Results.Ok(new
        {
            token,
            user = new
            {
                id = user.Id,
                email = user.Email,
                preferredLanguage = user.PreferredLanguage,
                createdAt = user.CreatedAtUtc
            }
        });
    }).WithName("LoginUser");

    // GET /api/v1/auth/me (Strict Auth Gate)
    app.MapGet("/api/v1/auth/me", [Authorize] async (ClaimsPrincipal principal, AppDbContext db) =>
    {
        var userIdStr = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

        var user = await db.Users.Include(u => u.Streak).FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return Results.Unauthorized();

        var progressCount = await db.UserProgresses.CountAsync(p => p.UserId == userId);

        return Results.Ok(new
        {
            id = user.Id,
            email = user.Email,
            preferredLanguage = user.PreferredLanguage,
            streak = user.Streak?.CurrentStreak ?? 0,
            longestStreak = user.Streak?.LongestStreak ?? 0,
            completedLessonsCount = progressCount,
            createdAt = user.CreatedAtUtc
        });
    }).WithName("GetCurrentUser");

    // ==========================================
    // USER PROGRESS & STREAK (STRICT AUTH GATE)
    // ==========================================

    // GET /api/v1/progress (Requires JWT)
    app.MapGet("/api/v1/progress", [Authorize] async (ClaimsPrincipal principal, AppDbContext db) =>
    {
        var userIdStr = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

        var records = await db.UserProgresses
            .Where(p => p.UserId == userId)
            .Select(p => new
            {
                p.TrackId,
                p.LessonId,
                p.CompletedAtUtc,
                p.AttemptsCount,
                p.CodeSnapshot,
                p.ExecutionMetricsJson
            })
            .ToListAsync();

        return Results.Ok(records);
    }).WithName("GetUserProgress");

    // POST /api/v1/progress/complete (Requires JWT)
    app.MapPost("/api/v1/progress/complete", [Authorize] async (SaveProgressRequest req, ClaimsPrincipal principal, AppDbContext db) =>
    {
        var userIdStr = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        if (!Guid.TryParse(userIdStr, out var userId)) return Results.Unauthorized();

        var existing = await db.UserProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == req.LessonId);

        if (existing == null)
        {
            existing = new UserProgress
            {
                UserId = userId,
                TrackId = req.TrackId,
                LessonId = req.LessonId,
                CompletedAtUtc = DateTimeOffset.UtcNow,
                AttemptsCount = 1,
                CodeSnapshot = req.CodeSnapshot ?? string.Empty,
                ExecutionMetricsJson = req.ExecutionMetricsJson ?? "{}"
            };
            db.UserProgresses.Add(existing);
        }
        else
        {
            existing.AttemptsCount++;
            existing.CodeSnapshot = req.CodeSnapshot ?? existing.CodeSnapshot;
            existing.ExecutionMetricsJson = req.ExecutionMetricsJson ?? existing.ExecutionMetricsJson;
            existing.CompletedAtUtc = DateTimeOffset.UtcNow;
        }

        // Streak logic
        var streak = await db.UserStreaks.FirstOrDefaultAsync(s => s.UserId == userId);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (streak == null)
        {
            streak = new UserStreak { UserId = userId, CurrentStreak = 1, LongestStreak = 1, LastActivityDate = today };
            db.UserStreaks.Add(streak);
        }
        else if (streak.LastActivityDate == today.AddDays(-1))
        {
            streak.CurrentStreak++;
            if (streak.CurrentStreak > streak.LongestStreak) streak.LongestStreak = streak.CurrentStreak;
            streak.LastActivityDate = today;
        }
        else if (streak.LastActivityDate != today)
        {
            streak.CurrentStreak = 1;
            streak.LastActivityDate = today;
        }

        await db.SaveChangesAsync();
        return Results.Ok(new { success = true, streak = streak.CurrentStreak, longestStreak = streak.LongestStreak });
    }).WithName("RecordProgress");

    // ==========================================
    // SANDBOX CODE EXECUTION SERVICES
    // ==========================================

    // POST /api/v1/execute/csharp (Roslyn Engine)
    app.MapPost("/api/v1/execute/csharp", async (CodeExecutionRequest request) =>
    {
        if (string.IsNullOrWhiteSpace(request.Code)) return Results.BadRequest(new { error = "Code cannot be empty" });

        try
        {
            var options = ScriptOptions.Default.WithImports("System", "System.Collections.Generic", "System.Linq");
            using var sw = new StringWriter();
            Console.SetOut(sw);
            var state = await CSharpScript.RunAsync(request.Code, options);
            var standardOutput = new StreamWriter(Console.OpenStandardOutput()) { AutoFlush = true };
            Console.SetOut(standardOutput);

            return Results.Ok(new 
            { 
                success = true, 
                result = state.ReturnValue?.ToString(),
                logs = sw.ToString().Split(Environment.NewLine, StringSplitOptions.RemoveEmptyEntries)
            });
        }
        catch (CompilationErrorException e)
        {
            return Results.BadRequest(new { success = false, error = string.Join(Environment.NewLine, e.Diagnostics) });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "CSharp execution failed");
            return Results.StatusCode(500);
        }
    }).WithName("ExecuteCSharp");

    // POST /api/v1/execute/sql (Ephemeral In-Memory SQLite)
    app.MapPost("/api/v1/execute/sql", async (CodeExecutionRequest request) =>
    {
        if (string.IsNullOrWhiteSpace(request.Code)) return Results.BadRequest(new { error = "Code cannot be empty" });

        try
        {
            using var connection = new SqliteConnection("Data Source=:memory:");
            connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = request.Code;
            
            using var reader = await command.ExecuteReaderAsync();
            var results = new List<Dictionary<string, object>>();
            
            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] = reader.GetValue(i);
                }
                results.Add(row);
            }

            return Results.Ok(new { success = true, result = results });
        }
        catch (SqliteException ex)
        {
            return Results.BadRequest(new { success = false, error = ex.Message });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "SQL execution failed");
            return Results.StatusCode(500);
        }
    }).WithName("ExecuteSql");

    // POST /api/v1/execute/python (Python Subprocess)
    app.MapPost("/api/v1/execute/python", async (CodeExecutionRequest request) =>
    {
        if (string.IsNullOrWhiteSpace(request.Code)) return Results.BadRequest(new { error = "Code cannot be empty" });

        try
        {
            // Write code to a temporary file
            var tempFile = Path.GetTempFileName() + ".py";
            await File.WriteAllTextAsync(tempFile, request.Code);

            var startInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "python3",
                Arguments = $"\"{tempFile}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = System.Diagnostics.Process.Start(startInfo);
            if (process == null) return Results.StatusCode(500);

            var stdoutTask = process.StandardOutput.ReadToEndAsync();
            var stderrTask = process.StandardError.ReadToEndAsync();

            await process.WaitForExitAsync();

            var stdout = await stdoutTask;
            var stderr = await stderrTask;

            // Clean up
            try { File.Delete(tempFile); } catch { /* Ignore cleanup errors */ }

            if (process.ExitCode == 0)
            {
                var logs = stdout.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
                return Results.Ok(new { success = true, logs = logs.Where(l => !string.IsNullOrEmpty(l)).ToArray() });
            }
            else
            {
                return Results.BadRequest(new { success = false, error = stderr });
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Python execution failed");
            return Results.StatusCode(500);
        }
    }).WithName("ExecutePython");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public class CodeExecutionRequest
{
    public string Code { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "en";
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class SaveProgressRequest
{
    public string TrackId { get; set; } = string.Empty;
    public string LessonId { get; set; } = string.Empty;
    public string? CodeSnapshot { get; set; }
    public string? ExecutionMetricsJson { get; set; }
}
