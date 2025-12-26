namespace API.Entities
{
    public class Payment
    {
        public int Id { get; set; }

        public string PaymentMethod { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public DateTime? PaidAt { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
    }

}
