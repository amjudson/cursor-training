using ApiKeyBuilder.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyBuilder.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApiKey> ApiKeys { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApiKey>(entity =>
        {
            entity.ToTable("ApiKey");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("api_key_id").UseIdentityColumn();
            entity.Property(e => e.Name).HasColumnName("name").IsRequired();
            entity.Property(e => e.Key).HasColumnName("key").IsRequired();
            entity.Property(e => e.Usages).HasColumnName("usages").HasDefaultValue(0);
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.LastUsed).HasColumnName("lastUsed");
            entity.Property(e => e.IsActive).HasColumnName("isActive").HasDefaultValue(true);

            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasIndex(e => e.CreatedAt);
        });
    }
} 