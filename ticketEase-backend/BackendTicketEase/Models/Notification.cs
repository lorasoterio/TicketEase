using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendTicketEase.Models
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string Message { get; set; } = "";

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? DeliveryStatus { get; set; }

        [Required]
        [MaxLength(50)]
        public string EventType { get; set; } = "";

        [Required]
        [MaxLength(20)]
        public string Channel { get; set; } = "";

        // Navigation Property
        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual User User { get; set; } = null!;
    }
}
