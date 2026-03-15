namespace BackendTicketEase.Models;

public class DocumentRequest
{
	public int DocumentRequestId { get; set; }
	public int TicketId { get; set; }
	public string DocumentType { get; set; } = string.Empty;
	public string? Semester { get; set; }
	public string? SchoolYear { get; set; }
	public string? Purpose { get; set; }
}