using BackendTicketEase.Configuration;
using Microsoft.Extensions.Options;

namespace BackendTicketEase.Services;

public interface ISupabaseService
{
    /// <summary>
    /// Gets the configured Supabase URL
    /// </summary>
    string GetSupabaseUrl();

    /// <summary>
    /// Gets the anonymous key for public operations
    /// </summary>
    string GetAnonKey();

    /// <summary>
    /// Gets the service key for server-side operations
    /// </summary>
    string GetServiceKey();

    /// <summary>
    /// Gets the PostgreSQL connection string for direct database access
    /// </summary>
    string GetPostgresConnectionString();

    /// <summary>
    /// Validates that all required Supabase settings are configured
    /// </summary>
    void ValidateConfiguration();
}

public class SupabaseService : ISupabaseService
{
    private readonly SupabaseOptions _options;
    private readonly ILogger<SupabaseService> _logger;

    public SupabaseService(IOptions<SupabaseOptions> options, ILogger<SupabaseService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public string GetSupabaseUrl()
    {
        return _options.Url;
    }

    public string GetAnonKey()
    {
        return _options.AnonKey;
    }

    public string GetServiceKey()
    {
        return _options.ServiceKey;
    }

    public string GetPostgresConnectionString()
    {
        return _options.PostgresConnectionString;
    }

    public void ValidateConfiguration()
    {
        if (string.IsNullOrWhiteSpace(_options.Url))
        {
            throw new InvalidOperationException("Supabase:Url is not configured");
        }

        if (string.IsNullOrWhiteSpace(_options.AnonKey))
        {
            throw new InvalidOperationException("Supabase:AnonKey is not configured");
        }

        if (string.IsNullOrWhiteSpace(_options.ServiceKey))
        {
            throw new InvalidOperationException("Supabase:ServiceKey is not configured");
        }

        _logger.LogInformation("Supabase configuration validated successfully");
    }
}
