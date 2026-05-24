namespace BackendTicketEase.DTOs
{
    public class CreateStudentRequest
    {
        public int UserId { get; set; }
        public string? SchoolStudentId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? MiddleName { get; set; }
        public string? Suffix { get; set; }
        public int? StrandId { get; set; }
        public int? GradeLevelId { get; set; }
        public bool? IsVerified { get; set; }
    }
}
