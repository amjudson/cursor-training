using ApiKeyBuilder.Api.Data;
using ApiKeyBuilder.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace ApiKeyBuilder.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApiKeysController : ControllerBase
{
    private readonly ApiKeyBuilderContext context;

    public ApiKeysController(ApiKeyBuilderContext context)
    {
        this.context = context;
    }

    // GET: api/ApiKeys/GetApiKeys
    [HttpGet("[action]")]
    public async Task<ActionResult<IEnumerable<ApiKey>>> GetApiKeys()
    {
        return await context.ApiKeys.ToListAsync();
    }

    // GET: api/ApiKeys/GetApiKey/5
    [HttpGet("[action]/{id}")]
    public async Task<ActionResult<ApiKey>> GetApiKey(int id)
    {
        var apiKey = await context.ApiKeys.FindAsync(id);

        if (apiKey == null)
        {
            return NotFound();
        }

        return apiKey;
    }

    // POST: api/ApiKeys/CreateApiKey
    [HttpPost("[action]")]
    public async Task<ActionResult<ApiKey>> CreateApiKey(ApiKey apiKey)
    {
        apiKey.CreatedAt = DateTime.UtcNow;
        apiKey.IsActive = true;
        apiKey.Usages = 0;
        apiKey.Key = GenerateRandomApiKey();

        context.ApiKeys.Add(apiKey);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApiKey), new { id = apiKey.Id }, apiKey);
    }

    // PUT: api/ApiKeys/UpdateApiKey/5
    [HttpPut("[action]/{id}")]
    public async Task<IActionResult> UpdateApiKey(int id, ApiKey apiKey)
    {
        if (id != apiKey.Id)
        {
            return BadRequest();
        }

        context.Entry(apiKey).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ApiKeyExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/ApiKeys/DeleteApiKey/5
    [HttpDelete("[action]/{id}")]
    public async Task<IActionResult> DeleteApiKey(int id)
    {
        var apiKey = await context.ApiKeys.FindAsync(id);
        if (apiKey == null)
        {
            return NotFound();
        }

        context.ApiKeys.Remove(apiKey);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private string GenerateRandomApiKey()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        var result = new char[32];
        for (int i = 0; i < 32; i++)
        {
            result[i] = chars[randomBytes[i] % chars.Length];
        }

        return $"user-{new string(result)}";
    }

    private bool ApiKeyExists(int id)
    {
        return context.ApiKeys.Any(e => e.Id == id);
    }
} 