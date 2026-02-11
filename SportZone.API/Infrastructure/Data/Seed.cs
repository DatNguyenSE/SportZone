using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SportZone.Application.Dtos;
using SportZone.Domain.Entities;

namespace SportZone.Infrastructure.Data;

public class Seed
{
    // HÀM 1: SEED CATEGORY
    public static async Task SeedCategories(AppDbContext context)
    {
        if (await context.Categories.AnyAsync()) return;

        var categoryData = await File.ReadAllTextAsync("D:/Documents/SportZone/SportZone.API/Infrastructure/Data/CategorySeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var categories = JsonSerializer.Deserialize<List<Category>>(categoryData, options);

        if (categories == null) return;

        foreach (var category in categories)
        {
            context.Categories.Add(category);
        }
        await context.SaveChangesAsync();
    }

    // HÀM 2: SEED PRODUCTS
    public static async Task SeedProducts(AppDbContext context)
    {
        if (await context.Products.AnyAsync()) return;

        var productData = await File.ReadAllTextAsync("D:/Documents/SportZone/SportZone.API/Infrastructure/Data/ProductSeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var products = JsonSerializer.Deserialize<List<SeedProductDto>>(productData, options);

        if (products == null)
        {
            Console.WriteLine("No products in seed data");
            return;
        }

        foreach (var item in products)
        {
            var product = new Product
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                Brand = item.Brand,
                ImageUrl = item.ImageUrl,
                IsDeleted = item.IsDeleted,
                CategoryId = item.CategoryId,
                PublicId = item.PublicId,
                Featured = item.Featured,
                IsNew = item.IsNew,
                Discount = item.Discount,
            };

            context.Products.Add(product);
        }

        await context.SaveChangesAsync();
    }


    // --- HÀM 3: SEED PRODUCT SIZES  ---
    public static async Task SeedProductSizes(AppDbContext context)
    {
        if (await context.ProductSizes.AnyAsync()) return;
    
        var sizeData = await File.ReadAllTextAsync("D:/Documents/SportZone/SportZone.API/Infrastructure/Data/SizesSeed.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        // Deserialize thẳng vào Entity ProductSize vì JSON khớp cấu trúc (ProductId, Name, Quantity)
        var sizes = JsonSerializer.Deserialize<List<ProductSize>>(sizeData, options);

        if (sizes == null) return;

         foreach (var size in sizes)
        {
            context.ProductSizes.Add(size);
        }
        await context.SaveChangesAsync();
    }

}
