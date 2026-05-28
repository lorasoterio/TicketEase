namespace BackendTicketEase.DTOs
{
    public class DocumentTypeDto
    {
        public int DocumentTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int EstimatedWorkingDays { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateDocumentTypeRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public int EstimatedWorkingDays { get; set; }
    }

    public class UpdateDocumentTypeRequest
    {
        public int DocumentTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int EstimatedWorkingDays { get; set; }
        public bool IsActive { get; set; }
    }


}
