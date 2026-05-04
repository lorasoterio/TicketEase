## Quick Setup Steps for Supabase

### Step 1: Get Your Supabase Credentials
1. Create a project at https://supabase.com
2. Go to **Settings → API**
3. Note down:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: Copy the full key
   - **service_role key**: Copy the full key

### Step 2: Update Development Configuration
Edit `appsettings.Development.json`:
```json
"Supabase": {
  "Url": "https://xxxxx.supabase.co",
  "AnonKey": "eyJhbGciOiJIUzI1NiIs...",
  "ServiceKey": "eyJhbGciOiJIUzI1NiIs...",
  "PostgresConnectionString": "postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres"
}
```

### Step 3: Get PostgreSQL Connection String
From Supabase **Settings → Database → Connection string**:
- Select **Connection pooler** (for serverless/APIs)
- Mode: **Transaction** (recommended)
- Copy the connection string and paste it in `PostgresConnectionString`

### Step 4: Test Connection
```bash
dotnet run
```
You should see: "Supabase configuration validated successfully" in logs

### Step 5: Run Migrations (if needed)
```bash
dotnet ef database update
```

### That's it! 🎉

## Key Files Created

| File | Purpose |
|------|---------|
| `Configuration/SupabaseOptions.cs` | Configuration model with documentation |
| `Services/SupabaseService.cs` | Service to access Supabase settings |
| `appsettings*.json` | Updated with Supabase config sections |
| `Program.cs` | Registers services and validates config |
| `SUPABASE_CONFIG.md` | Detailed documentation |

## Using Supabase Service

Inject `ISupabaseService` in any controller or service:

```csharp
public class MyController : ControllerBase
{
    private readonly ISupabaseService _supabase;

    public MyController(ISupabaseService supabase)
    {
        _supabase = supabase;
    }

    public IActionResult Example()
    {
        var url = _supabase.GetSupabaseUrl();
        var key = _supabase.GetAnonKey();
        // Use for REST API calls or other operations
        return Ok();
    }
}
```

## Need Help?

Refer to `SUPABASE_CONFIG.md` for detailed documentation.
