namespace BackendTicketEase.DTOs
{
    public class StrandDto
    {
        public int StrandId { get; set; }
        public string StrandCode { get; set; } = string.Empty;
        public string StrandName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}