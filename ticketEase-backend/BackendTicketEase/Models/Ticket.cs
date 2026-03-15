namespace BackendTicketEase.Models;

public class Ticket
{
    public int TicketId { get; set; }
    public string TicketType { get; set; } = string.Empty;  // "document" or "inquiry"
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; }
}
