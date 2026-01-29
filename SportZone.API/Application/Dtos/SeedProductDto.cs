namespace SportZone.Application.Dtos;
public class SeedProductDto
{
    public required int Id { get; set; }
    public bool IsDeleted { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Brand { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public required int CategoryId { get; set; }
    public int Quantity { get; set; }
}