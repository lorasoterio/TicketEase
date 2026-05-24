using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackendTicketEase.Models
{
    [Table("StaffGradeAssignments")]
    public class StaffGradeAssignment
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Staff")]
        [Required]
        public int StaffId { get; set; }
        
        public Staff? Staff { get; set; }

        [ForeignKey("GradeLevel")]
        public int? GradeLevelId { get; set; }
        public GradeLevels? GradeLevels { get; set; }

        [ForeignKey("Strand")]
        public int? StrandId { get; set; }
        public Strand? Strand { get; set; }

        public bool IsGraduate { get; set; } = false;

        public int Priority { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
