using System.Threading.Tasks;

namespace BackendTicketEase.Services
{
    public interface IAuditLogService
    {
        Task LogAsync(
            int? userId,
            string actionType,
            string? entityType = null,
            int? entityId = null,
            object? oldValues = null,
            object? newValues = null);
    }
}
