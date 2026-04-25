using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendTicketEase.Models
{
    [Table("TicketAssignment")]
    public class TicketAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [Required]
        public int TicketId { get; set; }

        [Required]
        public int AssignedBy { get; set; }

        [Required]
        public int AssignedTo { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("TicketId")]
        [JsonIgnore]
        public virtual Ticket Ticket { get; set; } = null!;

        [ForeignKey("AssignedBy")]
        [JsonIgnore]
        public virtual User AssignedByUser { get; set; } = null!;

        [ForeignKey("AssignedTo")]
        [JsonIgnore]
        public virtual User AssignedToUser { get; set; } = null!;
    }
}
