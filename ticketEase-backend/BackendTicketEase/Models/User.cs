using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendTicketEase.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = "";

        [Required]
        public UserRole Role { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Student Student { get; set; } 
        public virtual Staff Staff { get; set; }
        
        public string? Subject { get; set; }
        public string? Description { get; set; }

        [ForeignKey("StudentId")]
        public virtual User? StudentUser { get; set; }

    }

    public enum UserRole
    {
        Student,
        Staff,
        Admin
    }
}
