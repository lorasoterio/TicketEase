namespace BackendTicketEase.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? StudentId { get; set; }
        public int? StaffId { get; set; }
    }
}
