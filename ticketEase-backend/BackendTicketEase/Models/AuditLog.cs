using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendTicketEase.Models
{
    [Table("AuditLogs")]
    public class AuditLog
    {
        [Key]
        public int LogId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string ActionType { get; set; } = "";

        [StringLength(100)]
        public string EntityType { get; set; } = "";

        public int? EntityId { get; set; }

        public string OldValues { get; set; } = "";

        public string NewValues { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
