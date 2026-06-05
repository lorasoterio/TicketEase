using BackendTicketEase.Data;
using BackendTicketEase.Hubs;
using BackendTicketEase.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace BackendTicketEase.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<NotificationService> _logger;
        private readonly IHubContext<NotificationsHub> _hubContext;

        public NotificationService(AppDbContext context, IConfiguration config, ILogger<NotificationService> logger, IHubContext<NotificationsHub> hubContext)
        {
            _context = context;
            _config = config;
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task SendAsync(int userId, string recipientEmail, string eventType, string message, bool sendEmail = true)
        {
            // 1. Always create an in-app notification row
            var inAppNotification = new Notification
            {
                UserId = userId,
                Message = message,
                EventType = eventType,
                Channel = "InApp",
                DeliveryStatus = "Delivered",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(inAppNotification);

            // 2. Optionally send email and record it
            if (sendEmail && !string.IsNullOrWhiteSpace(recipientEmail))
            {
                var emailDeliveryStatus = await SendEmailAsync(recipientEmail, eventType, message);

                var emailNotification = new Notification
                {
                    UserId = userId,
                    Message = message,
                    EventType = eventType,
                    Channel = "Email",
                    DeliveryStatus = emailDeliveryStatus,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Notifications.Add(emailNotification);
            }

            await _context.SaveChangesAsync();

            var (priority, actionRequired) = ClassifyEvent(eventType);

            await _hubContext.Clients.Group($"user-{userId}").SendAsync("NotificationCreated", new
            {
                inAppNotification.NotificationId,
                inAppNotification.UserId,
                inAppNotification.Message,
                inAppNotification.IsRead,
                inAppNotification.CreatedAt,
                inAppNotification.DeliveryStatus,
                inAppNotification.EventType,
                inAppNotification.Channel,
                priority,
                actionRequired
            });

            await _hubContext.Clients.Group($"user-{userId}").SendAsync("UnreadCountChanged", new
            {
                userId,
                unreadCount = await _context.Notifications
                    .AsNoTracking()
                    .CountAsync(n => n.UserId == userId && !n.IsRead)
            });
        }

        private async Task<string> SendEmailAsync(string toAddress, string eventType, string message)
        {
            var host = _config["Email:SmtpHost"];
            var portStr = _config["Email:SmtpPort"];
            var useSsl = bool.TryParse(_config["Email:UseSsl"], out var ssl) && ssl;
            var username = _config["Email:Username"];
            var password = _config["Email:Password"];
            var fromAddress = _config["Email:FromAddress"];
            var fromName = _config["Email:FromName"] ?? "TicketEase";

            if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(fromAddress))
            {
                _logger.LogWarning("[Email] SMTP is not configured. Skipping email for event '{EventType}'.", eventType);
                return "Skipped";
            }

            if (!int.TryParse(portStr, out var port))
                port = 587;

            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(fromName, fromAddress));
                email.To.Add(MailboxAddress.Parse(toAddress));
                email.Subject = FormatSubject(eventType);
                email.Body = new TextPart("html") { Text = $"<p>{message}</p>" };

                using var smtp = new SmtpClient();
                var secureOption = useSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
                await smtp.ConnectAsync(host, port, secureOption);
                await smtp.AuthenticateAsync(username, password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return "Sent";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Email] Failed to send email for event '{EventType}' to '{To}'.", eventType, toAddress);
                return "Failed";
            }
        }

        private static string FormatSubject(string eventType) => eventType switch
        {
            "ticket_created" => "TicketEase — Your ticket has been submitted",
            "ticket_assigned" => "TicketEase — Your ticket has been assigned",
            "status_updated" => "TicketEase — Your ticket status has changed",
            "new_message" => "TicketEase — New message on your ticket",
            _ => "TicketEase — Notification"
        };

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
