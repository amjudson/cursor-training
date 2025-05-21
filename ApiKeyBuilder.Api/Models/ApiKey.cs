using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiKeyBuilder.Api.Models;

[Table("ApiKey")]
public class ApiKey
{
    [Key]
    [Column("api_key_id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column("key")]
    public string Key { get; set; } = string.Empty;

    [Column("usages")]
    public int Usages { get; set; }

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("lastUsed")]
    public DateTime? LastUsed { get; set; }

    [Column("isActive")]
    public bool IsActive { get; set; }
} 