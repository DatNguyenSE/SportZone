namespace API.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string UserId { get; set; } = null!;
        public AppUser User { get; set; } = null!;

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public Payment? Payment { get; set; }
    }

}
