using BackendTicketEase.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackendTicketEase.DTOs;

namespace BackendTicketEase.Services
{
    public interface ITicketAssignmentService
    {


        Task<List<StaffGradeAssignment>> GetAssignmentsForTicketAsync(int ticketId);
        Task<StaffGradeAssignment?> GetAssignmentByIdAsync(int assignmentId);
        Task<List<StaffGradeAssignment>> GetAllAssignmentsAsync();
        Task<StaffGradeAssignment> CreateAssignmentAsync(StaffGradeAssignment assignment);

        Task<StaffGradeAssignment> AssignStaffAsync(StaffAssignmentRequest request);
        Task<StaffGradeAssignment> UpdateAssignmentAsync(StaffGradeAssignment assignment);
        Task<bool> DeleteAssignmentAsync(int assignmentId);
    }
}
