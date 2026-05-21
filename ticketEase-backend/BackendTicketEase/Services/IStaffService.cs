using BackendTicketEase.DTOs;
using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public interface IStaffService
    {
        Task<(bool Success, string Message, Staff? Staff, User? User)> RegisterStaffAsync(
            string email,
            string password,
            string firstName,
            string lastName,
            string middleName,
            string suffix,
            string position);

        Task<(bool Success, string Message, StaffDto? StaffDto)> GetStaffByIdAsync(int staffId);
        Task<(bool Success, string Message, StaffDto? StaffDto)> GetStaffByUserIdAsync(int userId);
        Task<(bool Success, string Message, IEnumerable<StaffDto> Staff)> GetAllStaffAsync();
        Task<(bool Success, string Message, IEnumerable<StaffDto> Staff)> GetActiveStaffAsync();
        Task<(bool Success, string Message, IEnumerable<StaffDto> Staff)> GetInactiveStaffAsync();
        Task<(bool Success, string Message)> UpdateStaffAsync(int staffId, UpdateStaffRequest request);
        Task<(bool Success, string Message)> DeactivateStaffAsync(int staffId);
        Task<(bool Success, string Message)> DeleteStaffAsync(int staffId);
    }
}
