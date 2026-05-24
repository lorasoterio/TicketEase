using BackendTicketEase.Data;
using BackendTicketEase.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendTicketEase.Services
{
    public class TicketAssignmentService : ITicketAssignmentService
    {
        private readonly AppDbContext _context;
        public TicketAssignmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StaffGradeAssignment?> AssignTicketToStaffAsync(int ticketId)
        {
            // TODO: Implement logic to assign ticket to staff based on grade/strand/priority
            // Placeholder: return null
            return null;
        }

        public async Task<List<StaffGradeAssignment>> GetAssignmentsForTicketAsync(int ticketId)
        {
            // TODO: Implement logic to get assignments for a ticket
            return new List<StaffGradeAssignment>();
        }

        public async Task<StaffGradeAssignment?> GetAssignmentByIdAsync(int assignmentId)
        {
            return await _context.StaffGradeAssignments
                .Include(sga => sga.Staff)
                .Include(sga => sga.GradeLevels)
                .Include(sga => sga.Strand)
                .FirstOrDefaultAsync(sga => sga.Id == assignmentId);
        }

        public async Task<List<StaffGradeAssignment>> GetAllAssignmentsAsync()
        {
            return await _context.StaffGradeAssignments
                .Include(sga => sga.Staff)
                .Include(sga => sga.GradeLevels)
                .Include(sga => sga.Strand)
                .ToListAsync();
        }

        public async Task<StaffGradeAssignment> CreateAssignmentAsync(StaffGradeAssignment assignment)
        {
            _context.StaffGradeAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<StaffGradeAssignment> UpdateAssignmentAsync(StaffGradeAssignment assignment)
        {
            _context.StaffGradeAssignments.Update(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<bool> DeleteAssignmentAsync(int assignmentId)
        {
            var assignment = await _context.StaffGradeAssignments.FindAsync(assignmentId);
            if (assignment == null) return false;
            _context.StaffGradeAssignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
