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
        private readonly INotificationService _notificationService;

        public StudentController(AppDbContext context, IStudentService studentService, IAuditLogService auditLogService, INotificationService notificationService)
        {
            _context = context;
            _studentService = studentService;
            _auditLogService = auditLogService;
            _notificationService = notificationService;
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
                FirstName = student.FirstName,
                LastName = student.LastName,
                MiddleName = student.MiddleName,
                Suffix = student.Suffix,
                StrandId = student.StrandId,
                GradeLevelId = student.GradeLevelId,
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

        [HttpGet("strand/{strandId}")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsByStrand(int strandId)
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Include(s => s.Strand)
                .Include(s => s.GradeLevel)
                .Where(s => s.StrandId == strandId)
                .Select(s => new StudentDto
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    SchoolStudentId = s.SchoolStudentId,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    MiddleName = s.MiddleName,
                    Suffix = s.Suffix,
                    StrandId = s.StrandId,
                    StrandName = s.Strand != null ? s.Strand.StrandName : string.Empty,
                    GradeLevelId = s.GradeLevelId,
                    GradeLevelName = s.GradeLevel != null ? s.GradeLevel.GradeLevelName : string.Empty,
                    IsGraduate = s.IsGraduate,
                    IsVerified = s.IsVerified,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    UserEmail = s.User.Email
                })
                .ToListAsync();
            return Ok(students);
        }

        [HttpGet("gradelevel/{gradeLevelId}")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsByGradeLevel(int gradeLevelId)
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Include(s => s.Strand)
                .Include(s => s.GradeLevel)
                .Where(s => s.GradeLevelId == gradeLevelId)
                .Select(s => new StudentDto
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    SchoolStudentId = s.SchoolStudentId,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    MiddleName = s.MiddleName,
                    Suffix = s.Suffix,
                    StrandId = s.StrandId,
                    StrandName = s.Strand != null ? s.Strand.StrandName : string.Empty,
                    GradeLevelId = s.GradeLevelId,
                    GradeLevelName = s.GradeLevel != null ? s.GradeLevel.GradeLevelName : string.Empty,
                    IsGraduate = s.IsGraduate,
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
                FirstName = request.FirstName ?? "",
                LastName = request.LastName ?? "",
                MiddleName = request.MiddleName ?? "",
                Suffix = request.Suffix ?? "",
                StrandId = request.StrandId,
                GradeLevelId = request.GradeLevelId,
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
                FirstName = createdStudent.FirstName,
                LastName = createdStudent.LastName,
                MiddleName = createdStudent.MiddleName,
                Suffix = createdStudent.Suffix,
                StrandId = createdStudent.StrandId,
                StrandName = createdStudent.Strand != null ? createdStudent.Strand.StrandName : string.Empty,
                GradeLevelId = createdStudent.GradeLevelId,
                GradeLevelName = createdStudent.GradeLevel != null ? createdStudent.GradeLevel.GradeLevelName : string.Empty,
                IsGraduate = createdStudent.IsGraduate,
                IsVerified = createdStudent.IsVerified,
                CreatedAt = createdStudent.CreatedAt,
                UpdatedAt = createdStudent.UpdatedAt,
                UserEmail = createdStudent.User.Email
            };

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var cpid) ? cpid : student.UserId;
            await _auditLogService.LogAsync(actorId, "Create", "Student", student.StudentId, null, new { studentDto.FirstName, studentDto.LastName, studentDto.MiddleName, studentDto.Suffix, studentDto.SchoolStudentId, studentDto.StrandId });
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

            var updatedStudent = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (updatedStudent != null)
            {
                try
                {
                    await _notificationService.SendAsync(
                        updatedStudent.UserId,
                        updatedStudent.User.Email,
                        "record_updated",
                        "Your student profile was updated.");
                }
                catch
                {
                }
            }

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var upid) ? upid : (int?)null;
            await _auditLogService.LogAsync(actorId, "Update", "Student", id, null, new { request.FirstName, request.LastName, request.MiddleName, request.Suffix, request.StrandId, request.GradeLevelId});
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

            var verifiedStudent = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (verifiedStudent != null)
            {
                try
                {
                    await _notificationService.SendAsync(
                        verifiedStudent.UserId,
                        verifiedStudent.User.Email,
                        "record_updated",
                        "Your student profile verification status was updated.");
                }
                catch
                {
                }
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

            var studentUserEmail = await _context.Users
                .Where(u => u.UserId == student.UserId)
                .Select(u => u.Email)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrWhiteSpace(studentUserEmail))
            {
                try
                {
                    await _notificationService.SendAsync(
                        student.UserId,
                        studentUserEmail,
                        "record_updated",
                        "Your student profile verification status was updated.");
                }
                catch
                {
                }
            }

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
