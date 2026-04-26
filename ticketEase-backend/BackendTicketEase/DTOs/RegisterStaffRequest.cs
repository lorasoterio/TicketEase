namespace BackendTicketEase.DTOs
{
    public class RegisterStaffRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
    }
}
