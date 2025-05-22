namespace ApiKeyBuilder.Api.Models;

public class ApiKeyValidationResponse
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public ApiKey? ApiKey { get; set; }
} 