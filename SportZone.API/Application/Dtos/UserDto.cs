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
}