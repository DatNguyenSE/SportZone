namespace SportZone.Application.Dtos;
public class FeatureDto
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public string? Value { get; set; }
    public int ProductId { get; set; }
    public List<ProductDto>? Product { get; set; } 
}

public class CreateFeatureDto
{
    public required string Name { get; set; }
    public string? Value { get; set; }
}