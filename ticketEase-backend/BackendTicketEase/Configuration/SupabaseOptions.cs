namespace BackendTicketEase.Configuration;

public class SupabaseOptions
{
    public const string SectionName = "Supabase";

    /// <summary>
    /// The Supabase project URL (e.g., https://project-id.supabase.co)
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// The Supabase anonymous key (for public access)
    /// </summary>
    public string AnonKey { get; set; } = string.Empty;

    /// <summary>
    /// The Supabase service role key (for server-side access with full permissions)
    /// </summary>
    public string ServiceKey { get; set; } = string.Empty;

    /// <summary>
    /// PostgreSQL connection string for direct database access
    /// Format: postgresql://user:password@host:port/database
    /// </summary>
    public string PostgresConnectionString { get; set; } = string.Empty;
}
