using System;
using System.ComponentModel.DataAnnotations;

namespace BackendTicketEase.DTOs
{
    public class TicketMessageDto
    {
        public int MessageId { get; set; }
        public int TicketId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = "";
        public string SenderRole { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTicketMessageRequest
    {
        [Required]
        public string Message { get; set; } = "";
    }
}
