using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;


namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class AuthRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class RegisterRequest : AuthRequest
        {
            public string? Role { get; set; }
        }

        public class AuthResponse
        {
            public int UserId { get; set; }
            public string Email { get; set; } = string.Empty;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Email and password are required." });

            var exists = await _context.Set<User>().AnyAsync(u => u.Email == req.Email);
            if (exists)
                return BadRequest(new { message = "User with that email already exists." });

            var role = UserRole.Student;
            if (!string.IsNullOrWhiteSpace(req.Role) && Enum.TryParse<UserRole>(req.Role, true, out var parsed))
            {
                role = parsed;
            }

            var user = new User
            {
                Email = req.Email,
                PasswordHash = HashPassword(req.Password),
                Role = role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Set<User>().Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(null, new AuthResponse { UserId = user.UserId, Email = user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Email and password are required." });

            var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            if (!VerifyPassword(req.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials." });

            return Ok(new AuthResponse { UserId = user.UserId, Email = user.Email });
        }

        // Simple PBKDF2 hashing (store as iterations.salt.hash in base64)
        private static string HashPassword(string password)
        {
            const int iterations = 100_000;
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, 32);

            return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }

        private static bool VerifyPassword(string password, string stored)
        {
            try
            {
                var parts = stored.Split('.', 3);
                if (parts.Length != 3) return false;
                var iterations = int.Parse(parts[0]);
                var salt = Convert.FromBase64String(parts[1]);
                var hash = Convert.FromBase64String(parts[2]);

                var computed = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, hash.Length);
                return CryptographicOperations.FixedTimeEquals(computed, hash);
            }
            catch
            {
                return false;
            }
        }
    }
}
