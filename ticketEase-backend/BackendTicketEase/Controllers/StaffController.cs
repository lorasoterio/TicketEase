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

        public StaffController(AppDbContext context, IStaffService staffService)
        {
            _context = context;
            _staffService = staffService;
        }

        // GET: api/staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaff()
        {
            var result = await _staffService.GetAllStaffAsync();
            return Ok(result.Staff);
        }

        // GET: api/staff/5
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

        // GET: api/staff/user/{userId}
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

        // GET: api/staff/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetActiveStaff()
        {
            var result = await _staffService.GetActiveStaffAsync();
            return Ok(result.Staff);
        }

        // GET: api/staff/inactive
        [HttpGet("inactive")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetInactiveStaff()
        {
            var result = await _staffService.GetInactiveStaffAsync();
            return Ok(result.Staff);
        }

        // GET: api/staff/department/{department}
        [HttpGet("department/{department}")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaffByDepartment(string department)
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
                .Where(s => s.Department.Contains(department))
                .Select(s => new StaffDto
                {
                    StaffId = s.StaffId,
                    UserId = s.UserId,
                    FullName = s.FullName,
                    Position = s.Position,
                    Department = s.Department,
                    ContactNumber = s.ContactNumber,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    UserEmail = s.User.Email
                })
                .ToListAsync();

            return Ok(staff);
        }

        // GET: api/staff/position/{position}
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
                    FullName = s.FullName,
                    Position = s.Position,
                    Department = s.Department,
                    ContactNumber = s.ContactNumber,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    UserEmail = s.User.Email
                })
                .ToListAsync();

            return Ok(staff);
        }

        // POST: api/staff
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
                FullName = request.FullName ?? "",
                Position = request.Position ?? "",
                Department = request.Department ?? "",
                ContactNumber = request.ContactNumber ?? "",
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
                FullName = createdStaff.FullName,
                Position = createdStaff.Position,
                Department = createdStaff.Department,
                ContactNumber = createdStaff.ContactNumber,
                IsActive = createdStaff.IsActive,
                CreatedAt = createdStaff.CreatedAt,
                UpdatedAt = createdStaff.UpdatedAt,
                UserEmail = createdStaff.User.Email
            };

            return CreatedAtAction(nameof(GetStaff), new { id = staff.StaffId }, staffDto);
        }

        // PUT: api/staff/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffRequest request)
        {
            var result = await _staffService.UpdateStaffAsync(id, request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return NoContent();
        }

        // PATCH: api/staff/5/activate
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

            return NoContent();
        }

        // PATCH: api/staff/5/deactivate
        [HttpPatch("{id}/deactivate")]
        public async Task<IActionResult> DeactivateStaff(int id)
        {
            var result = await _staffService.DeactivateStaffAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return NoContent();
        }

        // DELETE: api/staff/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var result = await _staffService.DeleteStaffAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return NoContent();
        }

        private async Task<bool> StaffExists(int id)
        {
            return await _context.Staffs.AnyAsync(e => e.StaffId == id);
        }
    }
}
