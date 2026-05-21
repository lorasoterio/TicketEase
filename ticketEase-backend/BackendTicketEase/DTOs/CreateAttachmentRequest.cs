using System.ComponentModel.DataAnnotations;

namespace BackendTicketEase.DTOs
{
    public class CreateAttachmentRequest
    {
        [Required]
        public string FileUrl { get; set; } = "";

        [Required]
        [StringLength(255)]
        public string FileName { get; set; } = "";

        [Required]
        [StringLength(100)]
        public string FileType { get; set; } = "";

        [Required]
        public int TicketId { get; set; }

        public int? MessageId { get; set; }
    }
}
