using System;
using System.Security.Cryptography;
using BackendTicketEase.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Data
{
    public static class DbSeeder
    {
        public static async Task SeedSuperAdminAsync(AppDbContext context, IConfiguration configuration, ILogger logger)
        {
            var email = configuration["SuperAdmin:Email"];
            var password = configuration["SuperAdmin:Password"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                logger.LogWarning("SuperAdmin seed skipped: SuperAdmin:Email or SuperAdmin:Password is missing.");
                return;
            }

            var exists = await context.Users.AnyAsync(u => u.Email == email);
            if (exists)
            {
                return;
            }

            var superAdmin = new User
            {
                Email = email,
                PasswordHash = HashPassword(password),
                Role = UserRole.SuperAdmin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(superAdmin);
            await context.SaveChangesAsync();

            logger.LogInformation("Seeded SuperAdmin account: {Email}", email);
        }

        private static string HashPassword(string password)
        {
            const int iterations = 100_000;
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, 32);

            return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }
    }
}
