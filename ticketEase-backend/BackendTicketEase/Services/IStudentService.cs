using BackendTicketEase.DTOs;
using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public interface IStudentService
    {
        Task<(bool Success, string Message, Student? Student, User? User)> RegisterStudentAsync(
            string email, 
            string password,
            string schoolStudentId,
            string firstName,
            string lastName,
            string middleName,
            string suffix,
            int? strandId,
            int? gradeLevelId);
   
        Task<(bool Success, string Message, StudentDto? StudentDto)> GetStudentByIdAsync(int studentId);
        Task<(bool Success, string Message, StudentDto? StudentDto)> GetStudentByUserIdAsync(int userId);
        Task<(bool Success, string Message, IEnumerable<StudentDto> Students)> GetAllStudentsAsync();
        Task<(bool Success, string Message, IEnumerable<StudentDto> Students)> GetVerifiedStudentsAsync();
        Task<(bool Success, string Message, IEnumerable<StudentDto> Students)> GetUnverifiedStudentsAsync();
        Task<(bool Success, string Message)> VerifyStudentAsync(int studentId);
        Task<(bool Success, string Message)> UpdateStudentAsync(int studentId, UpdateStudentRequest request);
        Task<(bool Success, string Message)> DeleteStudentAsync(int studentId);
    }
}
