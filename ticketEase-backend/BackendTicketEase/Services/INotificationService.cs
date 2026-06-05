namespace BackendTicketEase.Services
{
    public interface INotificationService
    {
        /// <summary>
        /// Saves an in-app notification row and optionally sends an email.
        /// </summary>
        /// <param name="userId">Recipient's UserId (FK to Users table).</param>
        /// <param name="recipientEmail">Recipient's email address (for email channel).</param>
        /// <param name="eventType">Short event key, e.g. "ticket_created", "status_updated", "new_message".</param>
        /// <param name="message">Human-readable notification message.</param>
        /// <param name="sendEmail">Whether to also send an email.</param>
        Task SendAsync(int userId, string recipientEmail, string eventType, string message, bool sendEmail = true);
    }
}
