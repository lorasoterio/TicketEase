namespace BackendTicketEase.DTOs
{
    public class StaffDto
    {
        public int StaffId { get; set; }
        public int UserId { get; set; }
        public string Role { get; set; } = string.Empty;
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string MiddleName { get; set; } = "";
        public string Suffix { get; set; } = "";

        public string Position { get; set; } = string.Empty;

        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserEmail { get; set; } = string.Empty;
    }
}
