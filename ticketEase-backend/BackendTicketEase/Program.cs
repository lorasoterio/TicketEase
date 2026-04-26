using BackendTicketEase.Data;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

// Services
builder.Services.AddScoped<JwtService>();
<<<<<<< Updated upstream
builder.Services.AddScoped<GenerateRefNumber>();

// Register IDbContext to use AppDbContext implementation
builder.Services.AddScoped<IDbContext>(provider => provider.GetRequiredService<AppDbContext>());
=======
>>>>>>> Stashed changes

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();

// Use Npgsql provider for PostgreSQL
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

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();
