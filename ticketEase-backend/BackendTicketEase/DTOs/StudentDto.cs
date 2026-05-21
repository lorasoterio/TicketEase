namespace BackendTicketEase.DTOs
{
    public class StudentDto
    {
        public int StudentId { get; set; }
        public int UserId { get; set; }
        public string SchoolStudentId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string MiddleName { get; set; } = string.Empty;
        public string Suffix { get; set; } = string.Empty;
        public string Strand { get; set; } = string.Empty;
        public string GradeLevel { get; set; } = string.Empty;
        public bool IsGraduate { get; set; }

        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserEmail { get; set; } = string.Empty;
    }
}
