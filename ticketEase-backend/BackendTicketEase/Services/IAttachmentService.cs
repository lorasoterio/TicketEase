using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public interface IAttachmentService
    {
        Task<(bool Success, string Message, IEnumerable<Attachment> Attachments)> GetByTicketAsync(int ticketId, int userId, string? role);
        Task<(bool Success, string Message, Attachment? Attachment)> GetByIdAsync(int attachmentId, int userId, string? role);
        Task<(bool Success, string Message, Attachment? Attachment)> CreateAsync(int userId, string? role, string fileUrl, string fileName, string fileType, int ticketId, int? messageId);
        Task<(bool Success, string Message)> DeleteAsync(int attachmentId, int userId, string? role);
    }
}
