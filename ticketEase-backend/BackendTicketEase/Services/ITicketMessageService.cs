using BackendTicketEase.DTOs;

namespace BackendTicketEase.Services
{
    public interface ITicketMessageService
    {
        Task<(bool Success, string Message, IEnumerable<TicketMessageDto> Messages)> GetMessagesAsync(int ticketId, int userId, string? role);
        Task<(bool Success, string Message, TicketMessageDto? TicketMessage)> SendMessageAsync(int ticketId, int userId, string? role, string message);
    }
}
