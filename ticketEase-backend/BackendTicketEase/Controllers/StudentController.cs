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
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IStudentService _studentService;
        private readonly IAuditLogService _auditLogService;

        public StudentController(AppDbContext context, IStudentService studentService, IAuditLogService auditLogService)
        {
            _context = context;
            _studentService = studentService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents()
        {
            var result = await _studentService.GetAllStudentsAsync();
            return Ok(result.Students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetStudent(int id)
        {
            var result = await _studentService.GetStudentByIdAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(result.StudentDto);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<StudentDto>> GetStudentByUserId(int userId)
        {
            var result = await _studentService.GetStudentByUserIdAsync(userId);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(result.StudentDto);
        }

        [HttpGet("school-id/{schoolStudentId}")]
        public async Task<ActionResult<StudentDto>> GetStudentBySchoolId(string schoolStudentId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.SchoolStudentId == schoolStudentId);

            if (student == null)
            {
                return NotFound(new { message = $"Student with School ID {schoolStudentId} not found." });
            }

            var studentDto = new StudentDto
            {
                StudentId = student.StudentId,
                UserId = student.UserId,
                SchoolStudentId = student.SchoolStudentId,
                FullName = student.FullName,
                CourseProgram = student.CourseProgram,
                YearLevel = student.YearLevel,
                ContactNumber = student.ContactNumber,
                Address = student.Address,
                IsVerified = student.IsVerified,
                CreatedAt = student.CreatedAt,
                UpdatedAt = student.UpdatedAt,
                UserEmail = student.User.Email
            };

            return Ok(studentDto);
        }

        [HttpGet("verified")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetVerifiedStudents()
        {
            var result = await _studentService.GetVerifiedStudentsAsync();
            return Ok(result.Students);
        }

        [HttpGet("unverified")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetUnverifiedStudents()
        {
            var result = await _studentService.GetUnverifiedStudentsAsync();
            return Ok(result.Students);
        }

        [HttpGet("course/{courseProgram}")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsByCourse(string courseProgram)
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Where(s => s.CourseProgram.Contains(courseProgram))
                .Select(s => new StudentDto
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    SchoolStudentId = s.SchoolStudentId,
                    FullName = s.FullName,
                    CourseProgram = s.CourseProgram,
                    YearLevel = s.YearLevel,
                    ContactNumber = s.ContactNumber,
                    Address = s.Address,
                    IsVerified = s.IsVerified,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    UserEmail = s.User.Email
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("year/{yearLevel}")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsByYearLevel(string yearLevel)
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Where(s => s.YearLevel == yearLevel)
                .Select(s => new StudentDto
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    SchoolStudentId = s.SchoolStudentId,
                    FullName = s.FullName,
                    CourseProgram = s.CourseProgram,
                    YearLevel = s.YearLevel,
                    ContactNumber = s.ContactNumber,
                    Address = s.Address,
                    IsVerified = s.IsVerified,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    UserEmail = s.User.Email
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpPost]
        public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = $"User with ID {request.UserId} not found." });
            }

            var studentExists = await _context.Students.AnyAsync(s => s.UserId == request.UserId);
            if (studentExists)
            {
                return BadRequest(new { message = "Student profile already exists for this user." });
            }

            if (!string.IsNullOrWhiteSpace(request.SchoolStudentId))
            {
                var schoolIdExists = await _context.Students
                    .AnyAsync(s => s.SchoolStudentId == request.SchoolStudentId);
                if (schoolIdExists)
                {
                    return BadRequest(new { message = "School Student ID already exists." });
                }
            }

            var student = new Student
            {
                UserId = request.UserId,
                SchoolStudentId = request.SchoolStudentId ?? "",
                FullName = request.FullName ?? "",
                CourseProgram = request.CourseProgram ?? "",
                YearLevel = request.YearLevel ?? "",
                ContactNumber = request.ContactNumber ?? "",
                Address = request.Address ?? "",
                IsVerified = request.IsVerified ?? false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var createdStudent = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == student.StudentId);

            var studentDto = new StudentDto
            {
                StudentId = createdStudent!.StudentId,
                UserId = createdStudent.UserId,
                SchoolStudentId = createdStudent.SchoolStudentId,
                FullName = createdStudent.FullName,
                CourseProgram = createdStudent.CourseProgram,
                YearLevel = createdStudent.YearLevel,
                ContactNumber = createdStudent.ContactNumber,
                Address = createdStudent.Address,
                IsVerified = createdStudent.IsVerified,
                CreatedAt = createdStudent.CreatedAt,
                UpdatedAt = createdStudent.UpdatedAt,
                UserEmail = createdStudent.User.Email
            };

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var cpid) ? cpid : student.UserId;
            await _auditLogService.LogAsync(actorId, "Create", "Student", student.StudentId, null, new { studentDto.FullName, studentDto.SchoolStudentId, studentDto.CourseProgram });
            return CreatedAtAction(nameof(GetStudent), new { id = student.StudentId }, studentDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentRequest request)
        {
            var result = await _studentService.UpdateStudentAsync(id, request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var upid) ? upid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Update", "Student", id, null, new { request.FullName, request.CourseProgram, request.YearLevel, request.ContactNumber });
            return NoContent();
        }

        [HttpPatch("{id}/verify")]
        public async Task<IActionResult> VerifyStudent(int id)
        {
            var result = await _studentService.VerifyStudentAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var vpid) ? vpid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Update", "Student", id, new { IsVerified = false }, new { IsVerified = true });
            return NoContent();
        }

        [HttpPatch("{id}/unverify")]
        public async Task<IActionResult> UnverifyStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} not found." });
            }

            student.IsVerified = false;
            student.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uvpid) ? uvpid : student.UserId;
            await _auditLogService.LogAsync(actorId, "Update", "Student", id, new { IsVerified = true }, new { IsVerified = false });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var result = await _studentService.DeleteStudentAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var delPid) ? delPid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Delete", "Student", id, null, null);
            return NoContent();
        }

        private async Task<bool> StudentExists(int id)
        {
            return await _context.Students.AnyAsync(e => e.StudentId == id);
        }
    }
}
