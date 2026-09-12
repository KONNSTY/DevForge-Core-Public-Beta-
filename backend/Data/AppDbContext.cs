using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DevForge.Backend.Data;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string PreferredLanguage { get; set; } = "en";

    public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<UserProgress> ProgressRecords { get; set; } = new List<UserProgress>();
    public UserStreak? Streak { get; set; }
}

public class UserProgress
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string TrackId { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LessonId { get; set; } = string.Empty;

    public DateTimeOffset CompletedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public int AttemptsCount { get; set; } = 1;

    public string CodeSnapshot { get; set; } = string.Empty;

    public string ExecutionMetricsJson { get; set; } = "{}";
}

public class UserStreak
{
    [Key]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public int CurrentStreak { get; set; } = 1;
    public int LongestStreak { get; set; } = 1;
    public DateOnly LastActivityDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserProgress> UserProgresses => Set<UserProgress>();
    public DbSet<UserStreak> UserStreaks => Set<UserStreak>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<UserProgress>(entity =>
        {
            entity.HasIndex(p => new { p.UserId, p.LessonId }).IsUnique();
            entity.HasIndex(p => p.TrackId);
        });

        modelBuilder.Entity<UserStreak>(entity =>
        {
            entity.HasKey(s => s.UserId);
        });
    }
}
