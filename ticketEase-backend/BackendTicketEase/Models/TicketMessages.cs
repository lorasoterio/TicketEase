using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendTicketEase.Models
{
    [Table("TicketMessages")]
    public class TicketMessage
    {
        [Key]
        public int MessageId { get; set; }

        [Required]
        public int TicketId { get; set; }

        [Required]
        public int SenderId { get; set; }

        [Required]
        public string Message { get; set; } = "";

        public bool IsInternal { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("TicketId")]
        [JsonIgnore]
        public virtual Ticket Ticket { get; set; } = null!;

        [ForeignKey("SenderId")]
        [JsonIgnore]
        public virtual User Sender { get; set; } = null!;
    }
}
