using System;
using System.ComponentModel;

namespace Adidas.Application.Dtos;

public class ProductDto
{
    public int Id { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; } 
    public int? CategoryId { get; set; }
    [DefaultValue(false)]
    public bool IsDeleted { get; set; } = false;
    public int Quantity { get; set; }
}  


