namespace BackendTicketEase.Models;

public class InquiryRequest
{
    public int InquiryRequestId { get; set; }
    public int TicketId { get; set; }
    public string InquiryDescription { get; set; } = string.Empty;
}
