using BackendTicketEase.Data;
using BackendTicketEase.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Services
{
    public class AttachmentService : IAttachmentService
    {
        private readonly AppDbContext _context;

        public AttachmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, IEnumerable<Attachment> Attachments)> GetByTicketAsync(int ticketId, int userId, string? role)
        {
            var ticket = await _context.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.TicketId == ticketId);
            if (ticket == null)
                return (false, "Ticket not found.", Enumerable.Empty<Attachment>());

            if (!CanAccessTicket(ticket, userId, role))
                return (false, "You are not allowed to access attachments for this ticket.", Enumerable.Empty<Attachment>());

            var attachments = await _context.Attachments
                .AsNoTracking()
                .Where(a => a.TicketId == ticketId)
                .OrderBy(a => a.CreatedAt)
                .ToListAsync();

            return (true, "Attachments retrieved successfully.", attachments);
        }

        public async Task<(bool Success, string Message, Attachment? Attachment)> GetByIdAsync(int attachmentId, int userId, string? role)
        {
            var attachment = await _context.Attachments
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.AttachmentId == attachmentId);

            if (attachment == null)
                return (false, "Attachment not found.", null);

            var ticket = await _context.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.TicketId == attachment.TicketId);
            if (ticket == null)
                return (false, "Ticket not found.", null);

            if (!CanAccessTicket(ticket, userId, role))
                return (false, "You are not allowed to access this attachment.", null);

            return (true, "Attachment retrieved successfully.", attachment);
        }

        public async Task<(bool Success, string Message, Attachment? Attachment)> CreateAsync(int userId, string? role, string fileUrl, string fileName, string fileType, int ticketId, int? messageId)
        {
            if (string.IsNullOrWhiteSpace(fileUrl) || string.IsNullOrWhiteSpace(fileName) || string.IsNullOrWhiteSpace(fileType))
                return (false, "FileUrl, FileName, and FileType are required.", null);

            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.TicketId == ticketId);
            if (ticket == null)
                return (false, "Ticket not found.", null);

            if (!CanAccessTicket(ticket, userId, role))
                return (false, "You are not allowed to upload attachments for this ticket.", null);

            if (messageId.HasValue)
            {
                var message = await _context.TicketMessages
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.MessageId == messageId.Value && m.TicketId == ticketId);

                if (message == null)
                    return (false, "Message not found for this ticket.", null);
            }

            var attachment = new Attachment
            {
                FileUrl = fileUrl.Trim(),
                FileName = fileName.Trim(),
                FileType = fileType.Trim(),
                UploadedBy = userId,
                TicketId = ticketId,
                MessageId = messageId,
                CreatedAt = DateTime.UtcNow,
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            return (true, "Attachment created successfully.", attachment);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int attachmentId, int userId, string? role)
        {
            var attachment = await _context.Attachments.FirstOrDefaultAsync(a => a.AttachmentId == attachmentId);
            if (attachment == null)
                return (false, "Attachment not found.");

            var ticket = await _context.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.TicketId == attachment.TicketId);
            if (ticket == null)
                return (false, "Ticket not found.");

            var isStaff = IsStaff(role);
            if (attachment.UploadedBy != userId && !isStaff)
                return (false, "You are not allowed to delete this attachment.");

            if (!CanAccessTicket(ticket, userId, role))
                return (false, "You are not allowed to delete this attachment.");

            _context.Attachments.Remove(attachment);
            await _context.SaveChangesAsync();

            return (true, "Attachment deleted successfully.");
        }

        private static bool CanAccessTicket(Ticket ticket, int userId, string? role)
        {
            if (IsStudent(role))
                return ticket.StudentId == userId;

            if (IsStaff(role))
                return !ticket.AssignedStaffId.HasValue || ticket.AssignedStaffId.Value == userId;

            return false;
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
