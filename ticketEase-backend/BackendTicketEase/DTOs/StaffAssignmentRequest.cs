namespace BackendTicketEase.DTOs
{
    public class StaffAssignmentRequest
    {
        public int StaffId { get; set; }    
        public int GradeLevelId { get; set; }
        public bool IsGraduate { get; set; }
    }
}