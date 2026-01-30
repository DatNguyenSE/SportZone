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
        public string? ImageUrl { get; set; } 
        [DefaultValue(1)]
        public int CategoryId { get; set; }
        [JsonIgnore]
        public string? CategoryName { get; set; }
        public int Quantity { get; set; }
    }

    public class ProductDto : CreateProductDto
    {
        public int Id { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
    }
}