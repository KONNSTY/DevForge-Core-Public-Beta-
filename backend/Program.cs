using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.Data.Sqlite;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

    builder.Services.AddOpenApi();
    builder.Services.AddHealthChecks();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

    app.UseCors("AllowFrontend");

    // Console.SetOut is process-global. Serialize local C# runs so concurrent requests
    // cannot leak output into one another. This runner is intended for local development.
    var csharpExecutionLock = new SemaphoreSlim(1, 1);

    // Health Check Probes
    app.MapHealthChecks("/health/live").AllowAnonymous();
    app.MapHealthChecks("/health/ready").AllowAnonymous();
    app.MapHealthChecks("/health").AllowAnonymous();

    // ==========================================
    // SANDBOX CODE EXECUTION SERVICES
    // ==========================================

    // POST /api/v1/execute/csharp (Roslyn Engine)
    app.MapPost("/api/v1/execute/csharp", async (CodeExecutionRequest request) =>
    {
        if (string.IsNullOrWhiteSpace(request.Code)) return Results.BadRequest(new { error = "Code cannot be empty" });
        if (request.Code.Length > 20_000) return Results.BadRequest(new { error = "Code is limited to 20,000 characters" });
        if (!await csharpExecutionLock.WaitAsync(TimeSpan.FromSeconds(1)))
            return Results.StatusCode(StatusCodes.Status429TooManyRequests);

        var originalOutput = Console.Out;
        try
        {
            var options = ScriptOptions.Default
                .AddReferences(typeof(Enumerable).Assembly)
                .WithImports("System", "System.Collections.Generic", "System.Linq");
            using var sw = new StringWriter();
            Console.SetOut(sw);
            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            var state = await CSharpScript.RunAsync(request.Code, options, cancellationToken: timeout.Token);

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
        catch (OperationCanceledException)
        {
            return Results.StatusCode(StatusCodes.Status408RequestTimeout);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "CSharp execution failed");
            return Results.StatusCode(500);
        }
        finally
        {
            Console.SetOut(originalOutput);
            csharpExecutionLock.Release();
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
        if (request.Code.Length > 20_000) return Results.BadRequest(new { error = "Code is limited to 20,000 characters" });

        string? tempFile = null;
        try
        {
            // Write code to a temporary file
            tempFile = Path.GetTempFileName() + ".py";
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

            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));
            try
            {
                await process.WaitForExitAsync(timeout.Token);
            }
            catch (OperationCanceledException)
            {
                try { process.Kill(entireProcessTree: true); } catch { /* Process may have exited. */ }
                return Results.StatusCode(StatusCodes.Status408RequestTimeout);
            }

            var stdout = await stdoutTask;
            var stderr = await stderrTask;

            // Clean up
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
        finally
        {
            if (tempFile is not null)
            {
                try { File.Delete(tempFile); } catch { /* Ignore cleanup errors */ }
            }
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
