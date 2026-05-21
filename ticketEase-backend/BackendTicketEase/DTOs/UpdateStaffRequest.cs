namespace BackendTicketEase.DTOs
{
    public class UpdateStaffRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? MiddleName { get; set; }
        public string? Suffix { get; set; }
        public string? Position { get; set; }
        public bool? IsActive { get; set; }
    }
}
