namespace SportZone.Application.Dtos;

public class ProductSizeDto
{
    public int Id { get; set; }
    public string SizeName { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class CreateProductSizeDto
{
    public string SizeName { get; set; } = string.Empty;
    public int Quantity { get; set; }
}