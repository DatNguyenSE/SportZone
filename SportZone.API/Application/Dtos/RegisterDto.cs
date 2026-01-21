using System.ComponentModel.DataAnnotations;

namespace SportZone.Application.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; } = "";
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(4)]
        public string Password { get; set; } = "";  
        public DateOnly DateOfBirth { get; set; }
        [Required]
        public string FullName { get; set; } ="";
    }
}