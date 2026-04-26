namespace BackendTicketEase.DTOs
{
    public class RegisterResponse
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int ProfileId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
