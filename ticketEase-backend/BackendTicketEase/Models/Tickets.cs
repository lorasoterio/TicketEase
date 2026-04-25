using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendTicketEase.Models
{
    [Table("Tickets")]
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }

        // FK to Users.user_id (student who created the ticket)
        [Required]
        public int StudentId { get; set; }

        [Required]
        public TicketType TicketType { get; set; }

        [StringLength(255)]
        public string Subject { get; set; }

        public string Description { get; set; }

        public TicketPriority Priority { get; set; } = TicketPriority.Normal;

        public TicketStatus Status { get; set; } = TicketStatus.Pending;

        public DateTime? EstimatedCompletion { get; set; }

        // FK to Users.user_id (staff assigned)
        public int? AssignedStaffId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties (ignored for JSON/Swagger to avoid circular refs)
        [ForeignKey("StudentId")]
        [JsonIgnore]
        public virtual User? StudentUser { get; set; }

        [ForeignKey("AssignedStaffId")]
        [JsonIgnore]
        public virtual User? AssignedStaff { get; set; }
    }

    public enum TicketType
    {
        DocumentRequest,
        Inquiry
    }

    public enum TicketPriority
    {
        Normal,
        Low,
        High
    }

    public enum TicketStatus
    {
        Pending,
        Assigned,
        InProgress,
        ReadyForPickup,
        Completed,
        Rejected,
        Open,
        Responded,
        Closed
    }
}