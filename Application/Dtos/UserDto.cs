namespace Adidas.Application.Dtos
{
    public class UserDto
    {
        public required string Id { get; set; }
        public required string  Email { get; set; }
        public string? ImageUrl { get; set; }
        public required string UserName { get; set; } //displayname
        public required string FullName { get; set; }
        public required string  Token { get; set; }
    }
}