using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.ComponentModel.DataAnnotations;
namespace BackendTicketEase.Models
{
    [Table ("DocumentTypes")]
    public class DocumentType
    {
        [Key]
        public int DocumentTypeId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        [Required]
        public int EstimatedWorkingDays { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
