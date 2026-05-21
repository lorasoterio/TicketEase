using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.DTOs;
using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public class TicketMessageService : ITicketMessageService
    {
        private readonly AppDbContext _context;

        public TicketMessageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, IEnumerable<TicketMessageDto> Messages)> GetMessagesAsync(int ticketId, int userId, string? role)
        {
            var ticket = await _context.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.TicketId == ticketId);
            if (ticket == null)
                return (false, "Ticket not found.", Enumerable.Empty<TicketMessageDto>());

            if (ticket.Status == TicketStatus.Closed)
                return (false, "Message thread is no longer accessible for this ticket.", Enumerable.Empty<TicketMessageDto>());

            var isStudent = IsStudent(role);
            var isStaff = IsStaff(role);

            if (isStudent)
            {
                if (ticket.StudentId != userId)
                    return (false, "You are not allowed to access this message thread.", Enumerable.Empty<TicketMessageDto>());
            }
            else if (isStaff)
            {
                if (!ticket.AssignedStaffId.HasValue || ticket.AssignedStaffId.Value != userId)
                    return (false, "Only the assigned staff can access this message thread.", Enumerable.Empty<TicketMessageDto>());
            }
            else
            {
                return (false, "Unauthorized role.", Enumerable.Empty<TicketMessageDto>());
            }

            var messages = await (
                from m in _context.TicketMessages.AsNoTracking()
                join u in _context.Users.AsNoTracking() on m.SenderId equals u.UserId
                where m.TicketId == ticketId
                orderby m.CreatedAt
                select new TicketMessageDto
                {
                    MessageId = m.MessageId,
                    TicketId = m.TicketId,
                    SenderId = m.SenderId,
                    SenderRole = u.Role.ToString(),
                    SenderName = u.Role == UserRole.Student
                        ? (_context.Students.Where(s => s.UserId == m.SenderId)
                            .Select(s => (s.FirstName + (string.IsNullOrEmpty(s.MiddleName) ? "" : " " + s.MiddleName) + " " + s.LastName + (string.IsNullOrEmpty(s.Suffix) ? "" : ", " + s.Suffix)).Trim())
                            .FirstOrDefault() ?? "Unknown")
                        : (_context.Staffs.Where(s => s.UserId == m.SenderId)
                            .Select(s => (s.FirstName + (string.IsNullOrEmpty(s.MiddleName) ? "" : " " + s.MiddleName) + " " + s.LastName + (string.IsNullOrEmpty(s.Suffix) ? "" : ", " + s.Suffix)).Trim())
                            .FirstOrDefault() ?? "Unknown"),
                    Message = m.Message,
                    CreatedAt = m.CreatedAt,
                }
            ).ToListAsync();

            return (true, "Messages retrieved successfully.", messages);
        }

        public async Task<(bool Success, string Message, TicketMessageDto? TicketMessage)> SendMessageAsync(int ticketId, int userId, string? role, string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return (false, "Message cannot be empty.", null);

            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.TicketId == ticketId);
            if (ticket == null)
                return (false, "Ticket not found.", null);

            if (ticket.Status == TicketStatus.Closed)
                return (false, "Message thread is no longer accessible for this ticket.", null);

            var isStudent = IsStudent(role);
            var isStaff = IsStaff(role);

            if (isStudent)
            {
                if (ticket.StudentId != userId)
                    return (false, "You are not allowed to respond to this thread.", null);

                var assignedStaffHasMessaged = await _context.TicketMessages
                    .AnyAsync(m => m.TicketId == ticketId && m.SenderId == ticket.AssignedStaffId);

                if (!assignedStaffHasMessaged)
                    return (false, "You can respond only after assigned staff sends a message.", null);
            }
            else if (isStaff)
            {
                if (!ticket.AssignedStaffId.HasValue || ticket.AssignedStaffId.Value != userId)
                    return (false, "Only the assigned staff can send message to this ticket.", null);
            }
            else
            {
                return (false, "Unauthorized role.", null);
            }

            var newMessage = new TicketMessage
            {
                TicketId = ticketId,
                SenderId = userId,
                Message = message.Trim(),
                CreatedAt = DateTime.UtcNow,
            };

            _context.TicketMessages.Add(newMessage);

            if (isStudent && ticket.TicketType == TicketType.Inquiry)
            {
                ticket.Status = TicketStatus.Closed;
                ticket.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
            var senderRole = user?.Role.ToString() ?? string.Empty;
            var senderName = senderRole == nameof(UserRole.Student)
                ? await _context.Students.AsNoTracking().Where(s => s.UserId == userId)
                    .Select(s => (s.FirstName + (string.IsNullOrEmpty(s.MiddleName) ? "" : " " + s.MiddleName) + " " + s.LastName + (string.IsNullOrEmpty(s.Suffix) ? "" : ", " + s.Suffix)).Trim())
                    .FirstOrDefaultAsync() ?? "Unknown"
                : await _context.Staffs.AsNoTracking().Where(s => s.UserId == userId)
                    .Select(s => (s.FirstName + (string.IsNullOrEmpty(s.MiddleName) ? "" : " " + s.MiddleName) + " " + s.LastName + (string.IsNullOrEmpty(s.Suffix) ? "" : ", " + s.Suffix)).Trim())
                    .FirstOrDefaultAsync() ?? "Unknown";

            var dto = new TicketMessageDto
            {
                MessageId = newMessage.MessageId,
                TicketId = newMessage.TicketId,
                SenderId = newMessage.SenderId,
                SenderName = senderName,
                SenderRole = senderRole,
                Message = newMessage.Message,
                CreatedAt = newMessage.CreatedAt,
            };

            return (true, "Message sent successfully.", dto);
        }

        private static bool IsStudent(string? role)
        {
            return string.IsNullOrWhiteSpace(role) ||
                   string.Equals(role, nameof(UserRole.Student), StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsStaff(string? role)
        {
            return string.Equals(role, nameof(UserRole.Staff), StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(role, nameof(UserRole.Admin), StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(role, nameof(UserRole.SuperAdmin), StringComparison.OrdinalIgnoreCase);
        }
    }
}
