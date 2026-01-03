namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public string? Brand { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsDeleted { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public Inventory? Inventory { get; set; }
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

}
