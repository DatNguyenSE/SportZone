
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{

    public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
    {
        // ===== DbSet =====
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Inventory> Inventories { get; set; } = null!;
        public DbSet<Cart> Carts { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); 

            // --- Filter ---
            // next product with p.IsDeleted = false 
            builder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);

            // --- identity seeding ---
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "member-id", Name = "Member", NormalizedName = "MEMBER" },
                new IdentityRole { Id = "staff-id", Name = "Staff", NormalizedName = "STAFF" },
                new IdentityRole { Id = "admin-id", Name = "Admin", NormalizedName = "ADMIN" }
            );

            // --- entity configurations ---

            
            builder.Entity<Order>(entity =>
            {
                // Convert Enum to String
                entity.Property(o => o.Status).HasConversion<string>();
            });

            // === CartItem (Composite Key) ===
            builder.Entity<CartItem>(entity =>
            {
                entity.HasKey(ci => new { ci.CartId, ci.ProductId });

                entity.HasOne(ci => ci.Cart)
                      .WithMany(c => c.Items)
                      .HasForeignKey(ci => ci.CartId);

                entity.HasOne(ci => ci.Product)
                      .WithMany(p => p.CartItems)
                      .HasForeignKey(ci => ci.ProductId);
            });

            // === OrderItem (Composite Key) ===
            builder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => new { oi.OrderId, oi.ProductId });

                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.Items)
                      .HasForeignKey(oi => oi.OrderId);

                entity.HasOne(oi => oi.Product)
                      .WithMany(p => p.OrderItems)
                      .HasForeignKey(oi => oi.ProductId);
            });

            // === inventory (1-1 with Product) ===
            builder.Entity<Inventory>()
                .HasOne(i => i.Product)
                .WithOne(p => p.Inventory)
                .HasForeignKey<Inventory>(i => i.ProductId);

            // === payment (1-1 with Order) ===
            builder.Entity<Payment>(entity =>
            {
                // Relationship
                entity.HasOne(p => p.Order)
                      .WithOne(o => o.Payment)
                      .HasForeignKey<Payment>(p => p.OrderId);

                // Enum Conversions (Gộp vào đây cho gọn)
                entity.Property(p => p.PaymentMethod).HasConversion<string>();
                entity.Property(p => p.PaymentStatus).HasConversion<string>();
            });
        }
    }

}
