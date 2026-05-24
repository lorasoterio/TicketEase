using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackendTicketEase.Models
{
    [Table ("Strands")]
    public class Strand
    {
        [Key]
        public int StrandId { get; set; }

        [Required]
        public string StrandCode { get; set; } = string.Empty;
        public string StrandName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}
