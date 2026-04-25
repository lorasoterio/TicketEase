namespace BackendTicketEase.DTOs
{
    public class CreateStaffRequest
    {
        public int UserId { get; set; }
        public string? FullName { get; set; }
        public string? Position { get; set; }
        public string? Department { get; set; }
        public string? ContactNumber { get; set; }
        public bool? IsActive { get; set; }
    }
}
