using System.ComponentModel.DataAnnotations;

namespace BackendTicketEase.DTOs
{
    public class RegisterStaffRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string MiddleName { get; set; } = "";
        public string Suffix { get; set; } = "";
        public string Position { get; set; } = string.Empty;

        [RegularExpression("(?i)^(staff|admin)$", ErrorMessage = "Role must be either Staff or Admin.")]
        public string Role { get; set; } = "Staff";
    }
}
