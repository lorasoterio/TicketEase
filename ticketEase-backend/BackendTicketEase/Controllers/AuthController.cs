using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;
using BackendTicketEase.DTOs;
using BackendTicketEase.Services;


namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IStudentService _studentService;
        private readonly IStaffService _staffService;
        private readonly JwtService _jwtService;
        private readonly IAuditLogService _auditLogService;

        public AuthController(AppDbContext context, IStudentService studentService, IStaffService staffService, JwtService jwtService, IAuditLogService auditLogService)
        {
            _context = context;
            _studentService = studentService;
            _staffService = staffService;
            _jwtService = jwtService;
            _auditLogService = auditLogService;
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
            public string Role { get; set; } = string.Empty;
            public string Token { get; set; } = string.Empty;
            public string? FullName { get; set; }
            public string? SchoolStudentId { get; set; }
            public string? Department { get; set; }
        }

        [HttpPost("register/student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentRequest request)
        {
            var result = await _studentService.RegisterStudentAsync(
                request.Email,
                request.Password,
                request.SchoolStudentId,
                request.FullName,
                request.CourseProgram,
                request.YearLevel,
                request.ContactNumber,
                request.Address
            );

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            var response = new RegisterResponse
            {
                UserId = result.User!.UserId,
                Email = result.User.Email,
                Role = "Student",
                ProfileId = result.Student!.StudentId,
                Message = result.Message
            };

            await _auditLogService.LogAsync(result.User.UserId, "Register", "User", result.User.UserId, null, new { result.User.Email, Role = "Student" });
            return CreatedAtAction(null, response);
        }

        [HttpPost("register/staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffRequest request)
        {
            var result = await _staffService.RegisterStaffAsync(
                request.Email,
                request.Password,
                request.FullName,
                request.Position,
                request.Department,
                request.ContactNumber
            );

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            var response = new RegisterResponse
            {
                UserId = result.User!.UserId,
                Email = result.User.Email,
                Role = "Staff",
                ProfileId = result.Staff!.StaffId,
                Message = result.Message
            };

            await _auditLogService.LogAsync(result.User.UserId, "Register", "User", result.User.UserId, null, new { result.User.Email, Role = "Staff" });
            return CreatedAtAction(null, response);
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

            await _auditLogService.LogAsync(user.UserId, "Register", "User", user.UserId, null, new { user.Email, Role = user.Role.ToString() });
            return CreatedAtAction(null, new AuthResponse { UserId = user.UserId, Email = user.Email, Role = user.Role.ToString() });
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

            var token = _jwtService.GenerateJwt(user);

            var response = new AuthResponse
            {
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role.ToString(),
                Token = token,
            };

            if (user.Role == UserRole.Student)
            {
                var student = await _context.Set<Student>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.UserId == user.UserId);
                response.FullName = student?.FullName;
                response.SchoolStudentId = student?.SchoolStudentId;
            }
            else if (user.Role == UserRole.Staff || user.Role == UserRole.Admin || user.Role == UserRole.SuperAdmin)
            {
                var staff = await _context.Set<Staff>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.UserId == user.UserId);
                response.FullName = staff?.FullName;
                response.Department = staff?.Department;
            }

            await _auditLogService.LogAsync(user.UserId, "Login", "User", user.UserId);
            return Ok(response);
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
