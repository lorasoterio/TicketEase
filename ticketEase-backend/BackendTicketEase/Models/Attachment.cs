using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendTicketEase.Models
{
    [Table("Attachments")]
    public class Attachment
    {
        [Key]
        public int AttachmentId { get; set; }

        [Required]
        public string FileUrl { get; set; } = "";

        [Required]
        [StringLength(255)]
        public string FileName { get; set; } = "";

        [Required]
        [StringLength(100)]
        public string FileType { get; set; } = "";

        [Required]
        public int UploadedBy { get; set; }

        [Required]
        public int TicketId { get; set; }

        public int? MessageId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UploadedBy")]
        [JsonIgnore]
        public virtual User UploadedByUser { get; set; } = null!;

        [ForeignKey("TicketId")]
        [JsonIgnore]
        public virtual Ticket Ticket { get; set; } = null!;

        [ForeignKey("MessageId")]
        [JsonIgnore]
        public virtual TicketMessage? Message { get; set; }
    }
}
