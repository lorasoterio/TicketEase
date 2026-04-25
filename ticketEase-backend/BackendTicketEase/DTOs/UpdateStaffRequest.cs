namespace BackendTicketEase.DTOs
{
    public class UpdateStaffRequest
    {
        public string? FullName { get; set; }
        public string? Position { get; set; }
        public string? Department { get; set; }
        public string? ContactNumber { get; set; }
        public bool? IsActive { get; set; }
    }
}
