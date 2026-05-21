using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendTicketEase.Models
{
    public class Staff
    {
        [Key]
        public int StaffId { get; set; }

        [Required]
        public int UserId { get; set; }

        [StringLength(100)]
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string MiddleName { get; set; } = "";
        public string Suffix { get; set; } = "";

        [StringLength(50)]
        public string Position { get; set; } = "";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [Required]
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
