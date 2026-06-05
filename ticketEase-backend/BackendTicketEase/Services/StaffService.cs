using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.DTOs;
using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public class StaffService : IStaffService
    {
        private readonly AppDbContext _context;

        public StaffService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, Staff? Staff, User? User)> RegisterStaffAsync(
            string email,
            string password,
            string firstName,
            string lastName,
            string middleName,
            string suffix,
            string position,
            string role)
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

                var normalizedRole = string.IsNullOrWhiteSpace(role) ? nameof(UserRole.Staff) : role.Trim();
                if (!Enum.TryParse<UserRole>(normalizedRole, true, out var parsedRole) ||
                    (parsedRole != UserRole.Staff && parsedRole != UserRole.Admin))
                {
                    return (false, "Role must be either Staff or Admin.", null, null);
                }

                // Create User
                var user = new User
                {
                    Email = email,
                    PasswordHash = HashPassword(password),
                    Role = parsedRole,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create Staff Profile
                var staff = new Staff
                {
                    UserId = user.UserId,
                    FirstName = firstName ?? "",
                    LastName = lastName ?? "",
                    MiddleName = middleName ?? "",
                    Suffix = suffix,
                    Position = position ?? "",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Staffs.Add(staff);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return (true, "Staff registered successfully.", staff, user);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Registration failed: {ex.Message}", null, null);
            }
        }

        public async Task<(bool Success, string Message, StaffDto? StaffDto)> GetStaffByIdAsync(int staffId)
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StaffId == staffId);

            if (staff == null)
            {
                return (false, $"Staff with ID {staffId} not found.", null);
            }

            var staffDto = MapToDto(staff);
            return (true, "Staff found.", staffDto);
        }

        public async Task<(bool Success, string Message, StaffDto? StaffDto)> GetStaffByUserIdAsync(int userId)
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (staff == null)
            {
                return (false, $"Staff with User ID {userId} not found.", null);
            }

            var staffDto = MapToDto(staff);
            return (true, "Staff found.", staffDto);
        }

        public async Task<(bool Success, string Message, IEnumerable<StaffDto> Staff)> GetAllStaffAsync()
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
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

            return (true, "Staff retrieved successfully.", staff);
        }

        public async Task<(bool Success, string Message, IEnumerable<StaffDto> Staff)> GetActiveStaffAsync()
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
                .Where(s => s.IsActive)
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

            return (true, "Active staff retrieved successfully.", staff);
        }

        public async Task<(bool Success, string Message, IEnumerable<StaffDto> Staff)> GetInactiveStaffAsync()
        {
            var staff = await _context.Staffs
                .Include(s => s.User)
                .Where(s => !s.IsActive)
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

            return (true, "Inactive staff retrieved successfully.", staff);
        }

        public async Task<(bool Success, string Message)> UpdateStaffAsync(int staffId, UpdateStaffRequest request)
        {
            var staff = await _context.Staffs.FindAsync(staffId);

            if (staff == null)
            {
                return (false, $"Staff with ID {staffId} not found.");
            }

            if (!string.IsNullOrWhiteSpace(request.FirstName))
                staff.FirstName = request.FirstName;

            if (!string.IsNullOrWhiteSpace(request.LastName))
                staff.LastName = request.LastName;

            if (!string.IsNullOrWhiteSpace(request.MiddleName))
                staff.MiddleName = request.MiddleName;

            if (!string.IsNullOrWhiteSpace(request.Suffix))
                staff.Suffix = request.Suffix;

            if (!string.IsNullOrWhiteSpace(request.Position))
                staff.Position = request.Position;

            if (request.IsActive.HasValue)
                staff.IsActive = request.IsActive.Value;

            staff.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (true, "Staff updated successfully.");
        }

        public async Task<(bool Success, string Message)> DeactivateStaffAsync(int staffId)
        {
            var staff = await _context.Staffs.FindAsync(staffId);

            if (staff == null)
            {
                return (false, $"Staff with ID {staffId} not found.");
            }

            staff.IsActive = false;
            staff.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (true, "Staff deactivated successfully.");
        }

        public async Task<(bool Success, string Message)> DeleteStaffAsync(int staffId)
        {
            var staff = await _context.Staffs.FindAsync(staffId);

            if (staff == null)
            {
                return (false, $"Staff with ID {staffId} not found.");
            }

            _context.Staffs.Remove(staff);
            await _context.SaveChangesAsync();

            return (true, "Staff deleted successfully.");
        }

        private static StaffDto MapToDto(Staff staff)
        {
            return new StaffDto
            {
                StaffId = staff.StaffId,
                UserId = staff.UserId,
                Role = staff.User.Role.ToString(),
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                MiddleName = staff.MiddleName,
                Suffix = staff.Suffix,
                Position = staff.Position,
                IsActive = staff.IsActive,
                CreatedAt = staff.CreatedAt,
                UpdatedAt = staff.UpdatedAt,
                UserEmail = staff.User.Email
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
