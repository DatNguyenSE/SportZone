using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Adidas.Infrastructure.Data
{
    public class DbInitializer
    {
        public static async Task InitAsync(AppDbContext context)
        {
            // 1. Apply any pending migrations
            await context.Database.MigrateAsync();

            //2. Check exist data for Categories
            if (await context.Categories.AnyAsync())
            {
                return; // DB has been seeded
            }

            // 3. Create sample categories
            var categories = new List<Category>
{
    // --- SHOES ---
    new Category
    {
        Name = "Artificial Turf (TF)",
        Description = "Turf shoes with rubber studs, optimized for 5-a-side and 7-a-side artificial grass surfaces."
    },
    new Category
    {
        Name = "Firm Ground (FG)",
        Description = "Classic cleats designed for natural grass fields, providing traction for professional 11-a-side matches."
    },
    new Category
    {
        Name = "Futsal / Indoor (IC)",
        Description = "Flat-soled shoes with non-marking rubber, designed for indoor courts, wooden surfaces, and street style."
    },

    // --- KITS / JERSEYS ---
    new Category
    {
        Name = "Club Kits",
        Description = "Official replica jerseys and kits from top clubs like Real Madrid, Man Utd, Arsenal, and more."
    },
    new Category
    {
        Name = "National Team Kits",
        Description = "Authentic jerseys representing national teams including Argentina, Germany, and others."
    },

    // --- BALLS ---
    new Category
    {
        Name = "Footballs",
        Description = "FIFA Quality Pro match balls (UCL, World Cup), training balls, and low-bounce Futsal balls."
    },

    // --- ACCESSORIES ---
    new Category
    {
        Name = "Goalkeeper Gear",
        Description = "Professional goalkeeper gloves and protective apparel for keepers."
    },
    new Category
    {
        Name = "Accessories",
        Description = "Essential gear including socks, shin guards, boot bags, and captain armbands."
    }
};

            // 4. Save categories to the database
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }
    }
}