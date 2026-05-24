namespace BackendTicketEase.DTOs
{
    public class GradeLevelDto
    {
        public int GradeLevelId { get; set; }
        public string GradeLevelName { get; set; } = string.Empty;
        public int LevelOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}