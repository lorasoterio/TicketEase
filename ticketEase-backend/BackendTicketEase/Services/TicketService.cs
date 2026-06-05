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

        // Gets tickets for the given userId
        public async Task<List<Ticket>> GetTicketsForLoggedInStudentAsync(int userId)
        {
            // Ticket.StudentId stores the student user's UserId
            var tickets = await _context.Tickets
                .AsNoTracking()
                .Where(t => t.StudentId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return tickets;
        }
    }
}
