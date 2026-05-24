using BackendTicketEase.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendTicketEase.Services
{
    public interface ITicketAssignmentService
    {
        Task<StaffGradeAssignment?> AssignTicketToStaffAsync(int ticketId);
        Task<List<StaffGradeAssignment>> GetAssignmentsForTicketAsync(int ticketId);
        Task<StaffGradeAssignment?> GetAssignmentByIdAsync(int assignmentId);
        Task<List<StaffGradeAssignment>> GetAllAssignmentsAsync();
        Task<StaffGradeAssignment> CreateAssignmentAsync(StaffGradeAssignment assignment);
        Task<StaffGradeAssignment> UpdateAssignmentAsync(StaffGradeAssignment assignment);
        Task<bool> DeleteAssignmentAsync(int assignmentId);
    }
}
