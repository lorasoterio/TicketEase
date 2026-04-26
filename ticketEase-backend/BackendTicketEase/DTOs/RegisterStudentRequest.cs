namespace BackendTicketEase.DTOs
{
    public class RegisterStudentRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string SchoolStudentId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string CourseProgram { get; set; } = string.Empty;
        public string YearLevel { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
