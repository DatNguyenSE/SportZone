namespace SportZone.Application.Dtos
{
    public class UserDto
    {
        public required string Id { get; set; }
        public required string  Email { get; set; }
        public string? ImageUrl { get; set; }
        public string? UserName { get; set; } //displayname
        public string? FullName { get; set; }
        public required string  Token { get; set; }
    }

    public class UserProfileDto
    {
        public required string Id { get; set; }
        public required string  Email { get; set; }
        public string? ImageUrl { get; set; }
        public string? UserName { get; set; } //displayname
        public string? FullName { get; set; }
        public string? Address { get; set; } 
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Phone { get; set; }

    }
}