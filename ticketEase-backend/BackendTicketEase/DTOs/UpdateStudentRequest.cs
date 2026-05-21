namespace BackendTicketEase.DTOs
{
    public class UpdateStudentRequest
    {
        public string? SchoolStudentId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName { get; set; }
        public string? Suffix { get; set; }
        public string? Strand { get; set; }
        public string? GradeLevel { get; set; }
        public bool? IsVerified { get; set; }
    }
}
