using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendTicketEase.Models
{
    [Table("TicketStatusHistory")]
    public class StatusHistory
    {
        [Key]
        public int StatusHistoryId { get; set; }

        [Required]
        public int TicketId { get; set; }

        [Required]
        [StringLength(50)]
        public string OldStatus { get; set; } = "";

        [Required]
        [StringLength(50)]
        public string NewStatus { get; set; } = "";

        public int? ChangedBy { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("TicketId")]
        [JsonIgnore]
        public virtual Ticket Ticket { get; set; } = null!;

        [ForeignKey("ChangedBy")]
        [JsonIgnore]
        public virtual User? ChangedByUser { get; set; }
    }
}
