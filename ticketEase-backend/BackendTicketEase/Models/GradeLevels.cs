using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackendTicketEase.Models
{
    [Table ("GradeLevels")]
     [Index(nameof(GradeLevelName), IsUnique = true)]
    public class GradeLevels
    {
        [Key]
        public int GradeLevelId { get; set; }

        [Required]
        public string GradeLevelName { get; set; } = string.Empty;
        public int LevelOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
