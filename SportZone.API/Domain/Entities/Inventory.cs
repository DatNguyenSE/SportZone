using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Inventory
    {
        [Key]
        public int ProductId { get; set; }

        public int Quantity { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Product Product { get; set; } = null!;
    }

}
