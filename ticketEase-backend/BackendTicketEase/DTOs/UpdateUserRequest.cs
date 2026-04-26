namespace BackendTicketEase.DTOs
{
    public class UpdateUserRequest
    {
        public string? Email { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}
