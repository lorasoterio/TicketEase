using System.Text.Json;
using BackendTicketEase.Data;
using BackendTicketEase.Models;

namespace BackendTicketEase.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly AppDbContext _context;

        public AuditLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(
            int? userId,
            string actionType,
            string? entityType = null,
            int? entityId = null,
            object? oldValues = null,
            object? newValues = null)
        {
            if (userId == null || string.IsNullOrWhiteSpace(actionType))
            {
                return;
            }

            var log = new AuditLog
            {
                UserId = userId.Value,
                ActionType = actionType,
                EntityType = entityType ?? string.Empty,
                EntityId = entityId,
                OldValues = SerializeValues(oldValues),
                NewValues = SerializeValues(newValues),
                CreatedAt = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        private static string SerializeValues(object? values)
        {
            if (values == null)
            {
                return string.Empty;
            }

            return JsonSerializer.Serialize(values);
        }
    }
}
