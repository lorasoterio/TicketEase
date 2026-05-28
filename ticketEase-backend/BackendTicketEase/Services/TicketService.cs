using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public class TicketService
    {
        private readonly AppDbContext _context;

        public TicketService(AppDbContext context)
        {
            _context = context;
        }

        // Gets tickets for the student associated with the given userId
        public async Task<List<Ticket>> GetTicketsForLoggedInStudentAsync(int userId)
        {
            // Find the studentId associated with this userId
            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null)
                return new List<Ticket>();

            int studentId = student.StudentId;

            // Get tickets for this studentId
            var tickets = await _context.Tickets
                .AsNoTracking()
                .Where(t => t.StudentId == studentId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return tickets;
        }
    }
}
