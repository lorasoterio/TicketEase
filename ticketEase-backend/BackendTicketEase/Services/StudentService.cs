using BackendTicketEase.Data;
using BackendTicketEase.DTOs;
using BackendTicketEase.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Security.Cryptography;

namespace BackendTicketEase.Services
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;

        public StudentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, Student? Student, User? User)> RegisterStudentAsync(
            string email,
            string password,
            string schoolStudentId,
            string firstName,
            string lastName,
            string middleName,
            string suffix,
            int? strandId,
            int? gradeLevelId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate email
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    return (false, "Email and password are required.", null, null);
                }

                // Check if user already exists
                var userExists = await _context.Users.AnyAsync(u => u.Email == email);
                if (userExists)
                {
                    return (false, "User with that email already exists.", null, null);
                }

                // Check if school ID already exists
                if (!string.IsNullOrWhiteSpace(schoolStudentId))
                {
                    var schoolIdExists = await _context.Students
                        .AnyAsync(s => s.SchoolStudentId == schoolStudentId);
                    if (schoolIdExists)
                    {
                        return (false, "School Student ID already exists.", null, null);
                    }
                }

                // Create User
                var user = new User
                {
                    Email = email,
                    PasswordHash = HashPassword(password),
                    Role = UserRole.Student,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create Student Profile
                var student = new Student
                {
                    UserId = user.UserId,
                    SchoolStudentId = schoolStudentId ?? "",
                    FirstName = firstName ?? "",
                    LastName = lastName ?? "",
                    MiddleName = middleName ?? "",
                    Suffix = suffix ?? "",
                    StrandId = strandId,
                    GradeLevelId = gradeLevelId,
                    IsVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return (true, "Student registered successfully.", student, user);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Registration failed: {ex.Message}", null, null);
            }
        }

        public async Task<(bool Success, string Message, StudentDto? StudentDto)> GetStudentByIdAsync(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
            {
                return (false, $"Student with ID {studentId} not found.", null);
            }

            var studentDto = MapToDto(student);
            return (true, "Student found.", studentDto);
        }

        public async Task<(bool Success, string Message, StudentDto? StudentDto)> GetStudentByUserIdAsync(int userId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
            {
                return (false, $"Student with User ID {userId} not found.", null);
            }

            var studentDto = MapToDto(student);
            return (true, "Student found.", studentDto);
        }

        public async Task<(bool Success, string Message, IEnumerable<StudentDto> Students)> GetAllStudentsAsync()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Include(s => s.StrandId)
                .Include(s => s.GradeLevelId)
                .Select(s => MapToDto(s))
                .ToListAsync();
            return (true, "Students retrieved successfully.", students);
        }

        public async Task<(bool Success, string Message, IEnumerable<StudentDto> Students)> GetVerifiedStudentsAsync()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Include(s => s.StrandId)
                .Include(s => s.GradeLevelId)
                .Where(s => s.IsVerified)
                .Select(s => MapToDto(s))
                .ToListAsync();
            return (true, "Verified students retrieved successfully.", students);
        }

        public async Task<(bool Success, string Message, IEnumerable<StudentDto> Students)> GetUnverifiedStudentsAsync()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Include(s => s.StrandId)
                .Include(s => s.GradeLevelId)
                .Where(s => !s.IsVerified)
                .Select(s => MapToDto(s))
                .ToListAsync();
            return (true, "Unverified students retrieved successfully.", students);
        }

        public async Task<(bool Success, string Message)> VerifyStudentAsync(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);

            if (student == null)
            {
                return (false, $"Student with ID {studentId} not found.");
            }

            student.IsVerified = true;
            student.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (true, "Student verified successfully.");
        }

        public async Task<(bool Success, string Message)> UpdateStudentAsync(int studentId, UpdateStudentRequest request)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
            {
                return (false, $"Student with ID {studentId} not found.");
            }
            if (!string.IsNullOrWhiteSpace(request.SchoolStudentId))
            {
                var schoolIdExists = await _context.Students
                    .AnyAsync(s => s.SchoolStudentId == request.SchoolStudentId && s.StudentId != studentId);
                if (schoolIdExists)
                {
                    return (false, "School Student ID already exists.");
                }
                student.SchoolStudentId = request.SchoolStudentId;
            }
            if (!string.IsNullOrWhiteSpace(request.FirstName))
                student.FirstName = request.FirstName;
            if (!string.IsNullOrWhiteSpace(request.LastName))
                student.LastName = request.LastName;
            if (!string.IsNullOrWhiteSpace(request.MiddleName))
                student.MiddleName = request.MiddleName;
            if (!string.IsNullOrWhiteSpace(request.Suffix))
                student.Suffix = request.Suffix;
            if (request.StrandId.HasValue)
                student.StrandId = request.StrandId;
            if (request.GradeLevelId.HasValue)
                student.GradeLevelId = request.GradeLevelId;
            if (request.IsVerified.HasValue)
                student.IsVerified = request.IsVerified.Value;
            student.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return (true, "Student updated successfully.");
        }

        public async Task<(bool Success, string Message)> DeleteStudentAsync(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);

            if (student == null)
            {
                return (false, $"Student with ID {studentId} not found.");
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return (true, "Student deleted successfully.");
        }

        private static StudentDto MapToDto(Student student)
        {
            return new StudentDto
            {
                StudentId = student.StudentId,
                UserId = student.UserId,
                SchoolStudentId = student.SchoolStudentId,
                FirstName = student.FirstName,
                LastName = student.LastName,
                MiddleName = student.MiddleName,
                Suffix = student.Suffix,
                StrandId = student.StrandId,
                StrandName = student.Strand != null ? student.Strand.StrandName : string.Empty,
                GradeLevelId = student.GradeLevelId,
                GradeLevelName = student.GradeLevel != null ? student.GradeLevel.GradeLevelName : string.Empty,
                IsGraduate = student.IsGraduate,
                IsVerified = student.IsVerified,
                CreatedAt = student.CreatedAt,
                UpdatedAt = student.UpdatedAt,
                UserEmail = student.User.Email
            };
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
