using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/notifications
        // Returns notifications for the authenticated user only.
        // Role-wide feeds should be exposed via explicit, role-protected endpoints.
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var raw = await _context.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.NotificationId,
                    n.UserId,
                    n.Message,
                    n.IsRead,
                    n.CreatedAt,
                    n.DeliveryStatus,
                    n.EventType,
                    n.Channel
                })
                .ToListAsync();

            var notifications = raw.Select(n =>
            {
                var (priority, actionRequired) = ClassifyEvent(n.EventType);
                return new
                {
                    n.NotificationId,
                    n.UserId,
                    n.Message,
                    n.IsRead,
                    n.CreatedAt,
                    n.DeliveryStatus,
                    n.EventType,
                    n.Channel,
                    priority,
                    actionRequired
                };
            });

            return Ok(notifications);
        }

        // GET: api/notifications/unread-count
        // Returns the count of unread notifications for the authenticated user
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var count = await _context.Notifications
                .AsNoTracking()
                .CountAsync(n => n.UserId == userId && !n.IsRead);

            return Ok(new { unreadCount = count });
        }

        // PATCH: api/notifications/{id}/read
        // Marks a single notification as read for the authenticated user
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == id);

            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            if (notification.UserId != userId)
                return Forbid();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/notifications/read-all
        // Marks all notifications as read for the authenticated user
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var unread = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in unread)
                n.IsRead = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/notifications/{id}
        // Deletes a notification (owner or admin only)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == id);

            if (notification == null)
                return NotFound(new { message = "Notification not found." });

            if (notification.UserId != userId)
                return Forbid();

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static (string Priority, bool ActionRequired) ClassifyEvent(string? eventType)
        {
            var key = (eventType ?? string.Empty).Trim().ToLowerInvariant();

            return key switch
            {
                "ticket_assigned" => ("high", true),
                "ticket_reassigned" => ("high", true),
                "new_message" => ("medium", true),
                "status_updated" => ("medium", false),
                "ticket_created" => ("low", false),
                "verification_approved" => ("medium", false),
                "verification_rejected" => ("high", true),
                "ticket_closed" => ("medium", false),
                "sla_warning" => ("high", true),
                "ticket_overdue" => ("critical", true),
                "security_anomaly" => ("critical", true),
                _ => ("medium", false)
            };
        }
    }
}
