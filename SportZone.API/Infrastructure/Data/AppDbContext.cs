using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics; // BẮT BUỘC CÓ DÒNG NÀY
using SportZone.Domain.Entities;

namespace SportZone.Infrastructure.Data
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
        public DbSet<Promotion> Promotions { get; set; } = null!;

        // --- CẤU HÌNH TẮT CẢNH BÁO ---
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            
            optionsBuilder.ConfigureWarnings(warnings => {
                // Tắt cảnh báo về việc Soft Delete Product ảnh hưởng đến bảng con
                warnings.Ignore(CoreEventId.PossibleIncorrectRequiredNavigationWithQueryFilterInteractionWarning);
                
                // Tắt cảnh báo thay đổi Model (nếu vẫn còn sót)
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning); 
            });
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); 

            // --- Filter (Soft Delete) ---
            builder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);

            // --- SEED ROLES (Dữ liệu tĩnh) ---
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "member-id", Name = "Member", NormalizedName = "MEMBER" },
                new IdentityRole { Id = "staff-id", Name = "Staff", NormalizedName = "STAFF" },
                new IdentityRole { Id = "admin-id", Name = "Admin", NormalizedName = "ADMIN" }
            );

            // --- SEED ADMIN USER (Dữ liệu tĩnh) ---
            var adminId = "admin-id"; 
            var adminUser = new AppUser
            {
                Id = adminId,
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                Email = "admin@gmail.com",
                EmailConfirmed = true,
                // QUAN TRỌNG: Dùng chuỗi cứng, KHÔNG dùng Guid.NewGuid()
                SecurityStamp = "STATIC-GUID-SEC-12345", 
                ConcurrencyStamp = "STATIC-GUID-CON-67890",
                // Nếu bạn có thuộc tính CreatedAt trong AppUser, hãy gán ngày cố định:
                // CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            };

            // Password Hash cứng (Pass: Dat6112005nt!)
            adminUser.PasswordHash = "AQAAAAIAAYagAAAAELuWf8X8+7J8J8+J8+J8+J8+J8+J8+J8+J8+J8+J8+J8+J8+J8+J8+A==";

            builder.Entity<AppUser>().HasData(adminUser);

            // --- ASSIGN ROLE ---
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    RoleId = "admin-id", 
                    UserId = adminId   
                }
            );

            // --- Cấu hình Entity ---
            builder.Entity<Order>(entity =>
            {
                entity.Property(o => o.Status).HasConversion<string>();
            });

            // === CartItem ===
            builder.Entity<CartItem>(entity =>
            {
                entity.HasKey(ci => new { ci.CartId, ci.ProductId });
                entity.HasOne(ci => ci.Cart).WithMany(c => c.Items).HasForeignKey(ci => ci.CartId);
                entity.HasOne(ci => ci.Product).WithMany(p => p.CartItems).HasForeignKey(ci => ci.ProductId);
            });

            // === OrderItem ===
            builder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => new { oi.OrderId, oi.ProductId });
                entity.HasOne(oi => oi.Order).WithMany(o => o.Items).HasForeignKey(oi => oi.OrderId);
                entity.HasOne(oi => oi.Product).WithMany(p => p.OrderItems).HasForeignKey(oi => oi.ProductId);
            });

            // === Inventory ===
            builder.Entity<Inventory>()
                .HasOne(i => i.Product).WithOne(p => p.Inventory).HasForeignKey<Inventory>(i => i.ProductId);

            // === Payment ===
            builder.Entity<Payment>(entity =>
            {
                entity.HasOne(p => p.Order).WithOne(o => o.Payment).HasForeignKey<Payment>(p => p.OrderId);
                entity.Property(p => p.PaymentMethod).HasConversion<string>();
                entity.Property(p => p.PaymentStatus).HasConversion<string>();
            });
        }
    }
}