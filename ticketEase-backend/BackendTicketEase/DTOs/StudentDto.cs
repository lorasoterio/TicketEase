namespace BackendTicketEase.DTOs
{
    public class StudentDto
    {
        public int StudentId { get; set; }
        public int UserId { get; set; }
        public string SchoolStudentId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string CourseProgram { get; set; } = string.Empty;
        public string YearLevel { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserEmail { get; set; } = string.Empty;
    }
}
