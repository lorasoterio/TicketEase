using System.Security.Claims;
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
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditLogService _auditLogService;

        public UserController(AppDbContext context, IAuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Set<User>()
                .Include(u => u.Student)
                .Include(u => u.Staff)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    StudentId = u.Student != null ? (int?)u.Student.StudentId : null,
                    StaffId = u.Staff != null ? (int?)u.Staff.StaffId : null
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Set<User>()
                .Include(u => u.Student)
                .Include(u => u.Staff)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                StudentId = user.Student != null ? (int?)user.Student.StudentId : null,
                StaffId = user.Staff != null ? (int?)user.Staff.StaffId : null
            };

            return Ok(userDto);
        }

        // GET: api/user/email/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
        {
            var user = await _context.Set<User>()
                .Include(u => u.Student)
                .Include(u => u.Staff)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(new { message = $"User with email {email} not found." });
            }

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                StudentId = user.Student != null ? (int?)user.Student.StudentId : null,
                StaffId = user.Staff != null ? (int?)user.Staff.StaffId : null
            };

            return Ok(userDto);
        }

        // GET: api/user/role/{role}
        [HttpGet("role/{role}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersByRole(string role)
        {
            if (!Enum.TryParse<UserRole>(role, true, out var userRole))
            {
                return BadRequest(new { message = $"Invalid role: {role}. Valid roles are: Student, Staff, Admin." });
            }

            var users = await _context.Set<User>()
                .Where(u => u.Role == userRole)
                .Include(u => u.Student)
                .Include(u => u.Staff)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    StudentId = u.Student != null ? (int?)u.Student.StudentId : null,
                    StaffId = u.Staff != null ? (int?)u.Staff.StaffId : null
                })
                .ToListAsync();

            return Ok(users);
        }

        // PUT: api/user/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _context.Set<User>().FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            var oldSnapshot = new { user.Email, Role = user.Role.ToString(), user.IsActive };
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExists = await _context.Set<User>()
                    .AnyAsync(u => u.Email == request.Email && u.UserId != id);

                if (emailExists)
                {
                    return BadRequest(new { message = "Email already in use by another user." });
                }

                user.Email = request.Email;
            }

            if (!string.IsNullOrWhiteSpace(request.Role))
            {
                if (Enum.TryParse<UserRole>(request.Role, true, out var parsedRole))
                {
                    user.Role = parsedRole;
                }
                else
                {
                    return BadRequest(new { message = $"Invalid role: {request.Role}. Valid roles are: Student, Staff, Admin." });
                }
            }

            if (request.IsActive.HasValue)
            {
                user.IsActive = request.IsActive.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await UserExists(id))
                {
                    return NotFound(new { message = $"User with ID {id} not found." });
                }
                throw;
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var upid) ? upid : id;
            await _auditLogService.LogAsync(actorId, "Update", "User", id, oldSnapshot, new { user.Email, Role = user.Role.ToString(), user.IsActive });
            return NoContent();
        }

        // PATCH: api/user/5/deactivate
        [HttpPatch("{id}/deactivate")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            var user = await _context.Set<User>().FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            int? deactorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var depid) ? depid : id;
            await _auditLogService.LogAsync(deactorId, "Update", "User", id, new { IsActive = true }, new { IsActive = false });
            return NoContent();
        }

        // PATCH: api/user/5/activate
        [HttpPatch("{id}/activate")]
        public async Task<IActionResult> ActivateUser(int id)
        {
            var user = await _context.Set<User>().FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var apid) ? apid : id;
            await _auditLogService.LogAsync(actorId, "Update", "User", id, new { IsActive = false }, new { IsActive = true });
            return NoContent();
        }

        // DELETE: api/user/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Set<User>().FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }

            var snapshot = new { user.Email, Role = user.Role.ToString() };
            _context.Set<User>().Remove(user);
            await _context.SaveChangesAsync();

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var delPid) ? delPid : id;
            await _auditLogService.LogAsync(actorId, "Delete", "User", id, snapshot, null);
            return NoContent();
        }

        private async Task<bool> UserExists(int id)
        {
            return await _context.Set<User>().AnyAsync(e => e.UserId == id);
        }
       
    }
}
