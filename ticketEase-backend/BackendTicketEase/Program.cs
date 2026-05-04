using BackendTicketEase.Data;
using BackendTicketEase.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BackendTicketEase.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Supabase options from appsettings
builder.Services.Configure<SupabaseOptions>(
    builder.Configuration.GetSection(SupabaseOptions.SectionName));

builder.Services.AddScoped<ISupabaseService, SupabaseService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<GenerateRefNumber>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<ITicketMessageService, TicketMessageService>();

builder.Services.AddScoped<IDbContext>(provider => provider.GetRequiredService<AppDbContext>());

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured");
        var issuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is not configured");
        var audience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience is not configured");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILogger<Program>>();
                logger.LogWarning(
                    "[JWT] Authentication failed for {Method} {Path} — {Error}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Exception.Message);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILogger<Program>>();
                logger.LogWarning(
                    "[JWT] 401 Challenge issued for {Method} {Path} — ErrorDescription: {Desc}",
                    context.Request.Method,
                    context.Request.Path,
                    context.ErrorDescription ?? "none");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5096",
            "https://localhost:7156",
            "https://ticketeaseapp.azurewebsites.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Validate Supabase configuration on startup
using (var scope = app.Services.CreateScope())
{
    var supabaseService = scope.ServiceProvider.GetRequiredService<ISupabaseService>();
    try
    {
        supabaseService.ValidateConfiguration();
    }
    catch (InvalidOperationException ex)
    {
        app.Logger.LogWarning("Supabase configuration validation warning: {Message}", ex.Message);
    }
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TicketEase API V1");
});

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    var request = context.Request;
    var port = request.Host.Port ?? (request.IsHttps ? 443 : 80);
    var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    app.Logger.LogInformation(
        "[{Timestamp}] {Method} {Path} | Port: {Port}",
        timestamp,
        request.Method,
        request.Path,
        port);
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
