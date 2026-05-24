using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendTicketEase.Models
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [Required]
        public int UserId { get; set; }

        [StringLength(50)]
        public string SchoolStudentId { get; set; } = "";

        [StringLength(100)]
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string MiddleName { get; set; } = "";
        public string Suffix { get; set; } = "";

        // Foreign key for Strand
        public int? StrandId { get; set; }

        // Foreign key for GradeLevel
        public int? GradeLevelId { get; set; }

        public bool IsGraduate { get; set; } = false;

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("StrandId")]
        public virtual Strand? Strand { get; set; }

        [ForeignKey("GradeLevelId")]
        public virtual GradeLevels? GradeLevel { get; set; }
    }
}
