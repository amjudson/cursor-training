using ApiKeyBuilder.Api.Data;
using ApiKeyBuilder.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiKeyBuilder.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApiKeysController : ControllerBase
{
    private readonly ApiKeyBuilderContext _context;

    public ApiKeysController(ApiKeyBuilderContext context)
    {
        _context = context;
    }

    // GET: api/ApiKeys
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApiKey>>> GetApiKeys()
    {
        return await _context.ApiKeys.ToListAsync();
    }

    // GET: api/ApiKeys/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiKey>> GetApiKey(int id)
    {
        var apiKey = await _context.ApiKeys.FindAsync(id);

        if (apiKey == null)
        {
            return NotFound();
        }

        return apiKey;
    }

    // POST: api/ApiKeys
    [HttpPost]
    public async Task<ActionResult<ApiKey>> CreateApiKey(ApiKey apiKey)
    {
        apiKey.CreatedAt = DateTime.UtcNow;
        apiKey.IsActive = true;
        apiKey.Usages = 0;

        _context.ApiKeys.Add(apiKey);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApiKey), new { id = apiKey.Id }, apiKey);
    }

    // PUT: api/ApiKeys/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateApiKey(int id, ApiKey apiKey)
    {
        if (id != apiKey.Id)
        {
            return BadRequest();
        }

        _context.Entry(apiKey).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
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

    // DELETE: api/ApiKeys/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApiKey(int id)
    {
        var apiKey = await _context.ApiKeys.FindAsync(id);
        if (apiKey == null)
        {
            return NotFound();
        }

        _context.ApiKeys.Remove(apiKey);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ApiKeyExists(int id)
    {
        return _context.ApiKeys.Any(e => e.Id == id);
    }
} 