namespace BackendTicketEase.DTOs
{
    public class CreateStudentRequest
    {
        public int UserId { get; set; }
        public string? SchoolStudentId { get; set; }
        public string? FullName { get; set; }
        public string? CourseProgram { get; set; }
        public string? YearLevel { get; set; }
        public string? ContactNumber { get; set; }
        public string? Address { get; set; }
        public bool? IsVerified { get; set; }
    }
}
