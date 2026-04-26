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

        public StudentController(AppDbContext context, IStudentService studentService)
        {
            _context = context;
            _studentService = studentService;
        }

        // GET: api/student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents()
        {
            var result = await _studentService.GetAllStudentsAsync();
            return Ok(result.Students);
        }

        // GET: api/student/5
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

        // GET: api/student/user/{userId}
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

        // GET: api/student/school-id/{schoolStudentId}
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

        // GET: api/student/verified
        [HttpGet("verified")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetVerifiedStudents()
        {
            var result = await _studentService.GetVerifiedStudentsAsync();
            return Ok(result.Students);
        }

        // GET: api/student/unverified
        [HttpGet("unverified")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetUnverifiedStudents()
        {
            var result = await _studentService.GetUnverifiedStudentsAsync();
            return Ok(result.Students);
        }

        // GET: api/student/course/{courseProgram}
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

        // GET: api/student/year/{yearLevel}
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

        // POST: api/student
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

            return CreatedAtAction(nameof(GetStudent), new { id = student.StudentId }, studentDto);
        }

        // PUT: api/student/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentRequest request)
        {
            var result = await _studentService.UpdateStudentAsync(id, request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return NoContent();
        }

        // PATCH: api/student/5/verify
        [HttpPatch("{id}/verify")]
        public async Task<IActionResult> VerifyStudent(int id)
        {
            var result = await _studentService.VerifyStudentAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return NoContent();
        }

        // PATCH: api/student/5/unverify
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

            return NoContent();
        }

        // DELETE: api/student/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var result = await _studentService.DeleteStudentAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return NoContent();
        }

        private async Task<bool> StudentExists(int id)
        {
            return await _context.Students.AnyAsync(e => e.StudentId == id);
        }
    }
}
