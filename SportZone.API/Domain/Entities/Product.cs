namespace SportZone.Domain.Entities
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
        public bool IsNew { get; set; } = true;
        public string? Featured { get; set; } = null; // e.g., "New Arrival", "Best Seller", to set banners on UI
        public string? PublicId { get; set; } // Cloudinary public ID
        public double? Discount { get; set; } = 0.0;

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        // alter Inventory to ProductSize for multiple sizes and each size has its own quantity
        public ICollection<ProductSize> ProductSizes { get; set; } = new List<ProductSize>();
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}