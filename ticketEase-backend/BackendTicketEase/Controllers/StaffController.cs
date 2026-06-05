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
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IStaffService _staffService;
        private readonly IAuditLogService _auditLogService;
        private readonly INotificationService _notificationService;

        public StaffController(AppDbContext context, IStaffService staffService, IAuditLogService auditLogService, INotificationService notificationService)
        {
            _context = context;
            _staffService = staffService;
            _auditLogService = auditLogService;
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaff()
        {
            var result = await _staffService.GetAllStaffAsync();
            return Ok(result.Staff);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetStaff(int id)
        {
            var result = await _staffService.GetStaffByIdAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(result.StaffDto);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<StaffDto>> GetStaffByUserId(int userId)
        {
            var result = await _staffService.GetStaffByUserIdAsync(userId);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(result.StaffDto);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetActiveStaff()
        {
            var result = await _staffService.GetActiveStaffAsync();
            return Ok(result.Staff);
        }

        [HttpGet("inactive")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetInactiveStaff()
        {
            var result = await _staffService.GetInactiveStaffAsync();
            return Ok(result.Staff);
        }


        [HttpGet("position/{position}")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaffByPosition(string position)
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
                .Where(s => s.Position.Contains(position))
                .Select(s => new StaffDto
                {
                    StaffId = s.StaffId,
                    UserId = s.UserId,
                    Role = s.User.Role.ToString(),
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    MiddleName = s.MiddleName,
                    Suffix = s.Suffix,
                    Position = s.Position,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    UserEmail = s.User.Email
                })
                .ToListAsync();

            return Ok(staff);
        }

        [HttpPost]
        public async Task<ActionResult<StaffDto>> CreateStaff([FromBody] CreateStaffRequest request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = $"User with ID {request.UserId} not found." });
            }

            var staffExists = await _context.Staffs.AnyAsync(s => s.UserId == request.UserId);
            if (staffExists)
            {
                return BadRequest(new { message = "Staff profile already exists for this user." });
            }

            var staff = new Staff
            {
                UserId = request.UserId,
                FirstName = request.FirstName ?? "",
                LastName = request.LastName ?? "",
                MiddleName = request.MiddleName ?? "",
                Suffix = request.Suffix ?? "",
                Position = request.Position ?? "",
                IsActive = request.IsActive ?? true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Staffs.Add(staff);
            await _context.SaveChangesAsync();

            var createdStaff = await _context.Staffs
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StaffId == staff.StaffId);

            var staffDto = new StaffDto
            {
                StaffId = createdStaff!.StaffId,
                UserId = createdStaff.UserId,
                Role = createdStaff.User.Role.ToString(),
                FirstName = createdStaff.FirstName,
                LastName = createdStaff.LastName,
                MiddleName = createdStaff.MiddleName,
                Suffix = createdStaff.Suffix,
                Position = createdStaff.Position,
                IsActive = createdStaff.IsActive,
                CreatedAt = createdStaff.CreatedAt,
                UpdatedAt = createdStaff.UpdatedAt,
                UserEmail = createdStaff.User.Email
            };

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var cpid) ? cpid : staff.UserId;
            await _auditLogService.LogAsync(actorId, "Create", "Staff", staff.StaffId, null, new { staffDto.FirstName, staffDto.LastName, staffDto.MiddleName, staffDto.Suffix, staffDto.Position });
            return CreatedAtAction(nameof(GetStaff), new { id = staff.StaffId }, staffDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffRequest request)
        {
            var result = await _staffService.UpdateStaffAsync(id, request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            var updatedStaff = await _context.Staffs
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StaffId == id);

            if (updatedStaff != null)
            {
                try
                {
                    await _notificationService.SendAsync(
                        updatedStaff.UserId,
                        updatedStaff.User.Email,
                        "record_updated",
                        "Your staff profile was updated.");
                }
                catch
                {
                }
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var upid) ? upid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Update", "Staff", id, null, new { request.FirstName, request.LastName, request.MiddleName, request.Suffix, request.Position, request.IsActive });
            return NoContent();
        }

        [HttpPatch("{id}/activate")]
        public async Task<IActionResult> ActivateStaff(int id)
        {
            var staff = await _context.Staffs.FindAsync(id);

            if (staff == null)
            {
                return NotFound(new { message = $"Staff with ID {id} not found." });
            }

            staff.IsActive = true;
            staff.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var staffUserEmail = await _context.Users
                .Where(u => u.UserId == staff.UserId)
                .Select(u => u.Email)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrWhiteSpace(staffUserEmail))
            {
                try
                {
                    await _notificationService.SendAsync(
                        staff.UserId,
                        staffUserEmail,
                        "record_updated",
                        "Your staff profile status was updated.");
                }
                catch
                {
                }
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var apid) ? apid : staff.UserId;
            await _auditLogService.LogAsync(actorId, "Update", "Staff", id, new { IsActive = false }, new { IsActive = true });
            return NoContent();
        }

        [HttpPatch("{id}/deactivate")]
        public async Task<IActionResult> DeactivateStaff(int id)
        {
            var result = await _staffService.DeactivateStaffAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            var deactivatedStaff = await _context.Staffs
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StaffId == id);

            if (deactivatedStaff != null)
            {
                try
                {
                    await _notificationService.SendAsync(
                        deactivatedStaff.UserId,
                        deactivatedStaff.User.Email,
                        "record_updated",
                        "Your staff profile status was updated.");
                }
                catch
                {
                }
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var dpid) ? dpid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Update", "Staff", id, new { IsActive = true }, new { IsActive = false });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var result = await _staffService.DeleteStaffAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var delPid) ? delPid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Delete", "Staff", id, null, null);
            return NoContent();
        }

        private async Task<bool> StaffExists(int id)
        {
            return await _context.Staffs.AnyAsync(e => e.StaffId == id);
        }
    }
}
