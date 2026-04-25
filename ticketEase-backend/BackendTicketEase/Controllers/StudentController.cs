using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;
using BackendTicketEase.DTOs;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.User)
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

        // GET: api/student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} not found." });
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

        // GET: api/student/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<StudentDto>> GetStudentByUserId(int userId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
            {
                return NotFound(new { message = $"Student with User ID {userId} not found." });
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
            var students = await _context.Students
                .Include(s => s.User)
                .Where(s => s.IsVerified)
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

        // GET: api/student/unverified
        [HttpGet("unverified")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetUnverifiedStudents()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Where(s => !s.IsVerified)
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
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} not found." });
            }

            if (!string.IsNullOrWhiteSpace(request.SchoolStudentId))
            {
                var schoolIdExists = await _context.Students
                    .AnyAsync(s => s.SchoolStudentId == request.SchoolStudentId && s.StudentId != id);
                if (schoolIdExists)
                {
                    return BadRequest(new { message = "School Student ID already exists." });
                }
                student.SchoolStudentId = request.SchoolStudentId;
            }

            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                student.FullName = request.FullName;
            }

            if (!string.IsNullOrWhiteSpace(request.CourseProgram))
            {
                student.CourseProgram = request.CourseProgram;
            }

            if (!string.IsNullOrWhiteSpace(request.YearLevel))
            {
                student.YearLevel = request.YearLevel;
            }

            if (!string.IsNullOrWhiteSpace(request.ContactNumber))
            {
                student.ContactNumber = request.ContactNumber;
            }

            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                student.Address = request.Address;
            }

            if (request.IsVerified.HasValue)
            {
                student.IsVerified = request.IsVerified.Value;
            }

            student.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await StudentExists(id))
                {
                    return NotFound(new { message = $"Student with ID {id} not found." });
                }
                throw;
            }

            return NoContent();
        }

        // PATCH: api/student/5/verify
        [HttpPatch("{id}/verify")]
        public async Task<IActionResult> VerifyStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} not found." });
            }

            student.IsVerified = true;
            student.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

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
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} not found." });
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> StudentExists(int id)
        {
            return await _context.Students.AnyAsync(e => e.StudentId == id);
        }
    }
}
