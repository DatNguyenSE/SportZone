using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SportZone.Application.Dtos;

namespace SportZone.Infrastructure.Data;

public class Seed
{
    // HÀM 1: SEED CATEGORY
    public static async Task SeedCategories(AppDbContext context)
    {
        if (await context.Categories.AnyAsync()) return;

        var categoryData = await File.ReadAllTextAsync("D:/Documents/Project/SportZone/SportZone.API/Infrastructure/Data/CategorySeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true }; 
    var categories = JsonSerializer.Deserialize<List<Category>>(categoryData, options);

        if (categories == null) return;

        foreach (var category in categories)
        {
            context.Categories.Add(category);
        }
        await context.SaveChangesAsync();
    }
    public static async Task SeedProducts(AppDbContext context)
    {
        if (await context.Products.AnyAsync()) return;

        var productData = await File.ReadAllTextAsync("D:/Documents/Project/SportZone/SportZone.API/Infrastructure/Data/ProductSeedData.json");
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
                Inventory = new Inventory
                {
                    ProductId = item.Id,
                    Quantity = item.Quantity
                }
            };
            
            context.Products.Add(product);
        }
          
        await context.SaveChangesAsync();
    }
}
