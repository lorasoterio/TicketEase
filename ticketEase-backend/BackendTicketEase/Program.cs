using BackendTicketEase.Data;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<GenerateRefNumber>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IStaffService, StaffService>();

builder.Services.AddScoped<IDbContext>(provider => provider.GetRequiredService<AppDbContext>());

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", // React app
            "http://localhost:5096",
            "https://localhost:7156"// Swagger UI
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TicketEase API V1");
    });
}

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
