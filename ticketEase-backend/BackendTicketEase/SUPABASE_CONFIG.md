# Supabase Configuration Guide

## Overview
This document explains how to configure and use Supabase with your TicketEase backend application.

## What is Supabase?
Supabase is an open-source Firebase alternative that provides:
- **PostgreSQL Database**: Managed PostgreSQL for your application data
- **Authentication**: Built-in auth with JWT support
- **Realtime**: Real-time subscriptions to database changes
- **Storage**: File storage for documents and images

## Configuration Files

### 1. appsettings.json (Base Configuration)
Base settings with empty placeholders. Update environment-specific files instead.

```json
"Supabase": {
  "Url": "",
  "AnonKey": "",
  "ServiceKey": "",
  "PostgresConnectionString": ""
}
```

### 2. appsettings.Development.json (Development Environment)
Update with your Supabase development project credentials:

```json
"Supabase": {
  "Url": "https://your-project-id.supabase.co",
  "AnonKey": "your-anon-key-here",
  "ServiceKey": "your-service-key-here",
  "PostgresConnectionString": "postgresql://postgres.project-id:password@aws-0-region.pooler.supabase.com:6543/postgres"
}
```

### 3. appsettings.Production.json (Production Environment)
Update with your Supabase production project credentials:

```json
"Supabase": {
  "Url": "https://your-project-id.supabase.co",
  "AnonKey": "your-anon-key-here",
  "ServiceKey": "your-service-key-here",
  "PostgresConnectionString": "postgresql://postgres.project-id:password@aws-0-region.pooler.supabase.com:6543/postgres"
}
```

## How to Get Your Supabase Credentials

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in
   - Click "New Project"

2. **Get Your Credentials**
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL** (Url)
     - **anon public** (AnonKey)
     - **service_role secret** (ServiceKey)

3. **Get PostgreSQL Connection String**
   - Go to **Settings** → **Database**
   - Copy the **connection string** or construct it:
     ```
     postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?sslmode=require
     ```

## API Keys Explained

### Anon Key
- **Use Case**: Client-side requests, public data access
- **Permissions**: Limited to authenticated users and public tables
- **Example Usage**: Mobile apps, web frontends

### Service Key
- **Use Case**: Server-side requests with full permissions
- **Permissions**: Admin-level access to all database operations
- **Example Usage**: Backend APIs, scheduled jobs, admin operations
- **⚠️ Important**: Keep this secret - never expose in client code

## Using Supabase in Your Application

### 1. Injecting ISupabaseService

```csharp
public class MyController : ControllerBase
{
    private readonly ISupabaseService _supabaseService;

    public MyController(ISupabaseService supabaseService)
    {
        _supabaseService = supabaseService;
    }

    public IActionResult GetConfig()
    {
        var url = _supabaseService.GetSupabaseUrl();
        var anonKey = _supabaseService.GetAnonKey();

        return Ok(new { url, anonKey });
    }
}
```

### 2. Accessing PostgreSQL Directly

The PostgreSQL connection string is already configured in your `appsettings.json` as `DefaultConnection`, and Entity Framework Core is using it:

```csharp
// This is already configured in Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 3. Validating Configuration on Startup

The application automatically validates Supabase configuration on startup:

```csharp
// This happens automatically in Program.cs
supabaseService.ValidateConfiguration();
```

If configuration is invalid, a warning is logged but the application continues (useful for development).

## Connection Methods

### Method 1: Direct PostgreSQL (Current Setup)
Your current setup uses PostgreSQL directly via Npgsql and Entity Framework Core.

**Connection String Format**:
```
postgresql://[user]:[password]@[host]:6543/[database]?sslmode=require
```

**Example (Supabase)**:
```
postgresql://postgres.abcdef12:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Method 2: REST API (Optional)
If you want to use Supabase's REST API instead of direct database connection:

```csharp
using var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = 
    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", anonKey);

var response = await httpClient.GetAsync(
    $"{supabaseUrl}/rest/v1/your_table"
);
```

## Environment Variables (Recommended for Production)

Instead of hardcoding credentials in appsettings.Production.json, use environment variables:

```csharp
// In Program.cs
var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL")
    ?? builder.Configuration["Supabase:Url"];
```

Or configure via Azure App Service / Docker environment variables.

## SSL/TLS Configuration

Supabase requires SSL connections. Your PostgreSQL connection string must include:
```
sslmode=require
Trust Server Certificate=true
```

This is already configured in appsettings.Production.json.

## Common Issues & Solutions

### Issue: "Supabase:Url is not configured"
**Solution**: Update appsettings.Development.json or appsettings.Production.json with your Supabase URL

### Issue: "SSL connection error"
**Solution**: Ensure connection string includes `sslmode=require` and `Trust Server Certificate=true`

### Issue: "Authentication failed"
**Solution**: Verify your PostgreSQL credentials match the Supabase project settings

## Next Steps

1. ✅ Create a Supabase project at [supabase.com](https://supabase.com)
2. ✅ Copy your credentials to appsettings.Development.json
3. ✅ Test the connection by running your application
4. ✅ Set up production credentials in appsettings.Production.json or environment variables
5. ✅ Run Entity Framework migrations: `dotnet ef database update`

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase PostgreSQL Settings](https://supabase.com/docs/guides/database)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Entity Framework Core with PostgreSQL](https://www.npgsql.org/efcore/)
