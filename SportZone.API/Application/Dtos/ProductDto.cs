using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SportZone.Application.Dtos
{

    public class CreateProductDto
    {
  
        public required string Name { get; set; } 
        public string? Description { get; set; }
        public string? Brand { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string? PublicId { get; set; }
        public string? ImageUrl { get; set; } 
        [DefaultValue(1)]
        public int CategoryId { get; set; }
 
        public double? Discount { get; set; } = 0.0;
        public bool IsNew { get; set; } = true;
        public string? Featured { get; set; } = null; // e.g., "New Arrival", "Best Seller", to set banners on UI

    }

    public class ProductDto : CreateProductDto
    {
        
        public int Id { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        public string? CategoryName { get; set; }
    }

    public class UpdateProductDto
    {
  
        public string? Name { get; set; } 
        public string? Description { get; set; }
        public string? Brand { get; set; }
      
        public decimal Price { get; set; }
        [JsonIgnore]
        public string? PublicId { get; set; }
        public string? ImageUrl { get; set; } 
        [DefaultValue(1)]
        public int? CategoryId { get; set; }
    }
}