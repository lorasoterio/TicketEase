namespace BackendTicketEase.DTOs
{
    public class RegisterStudentRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string SchoolStudentId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string MiddleName { get; set; } = string.Empty;
        public string Suffix { get; set; } = string.Empty;
        public string Strand { get; set; } = string.Empty;
        public string GradeLevel { get; set; } = string.Empty;
        public bool IsGraduate { get; set; } = false;
    }
}
