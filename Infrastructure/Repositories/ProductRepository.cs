using Adidas.Application.Interfaces;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
namespace Adidas.Infrastructure.Repositories
{
    public class ProductRepository(AppDbContext context) : GenericRepository<Product>(context), IProductRepository
    {
        public async Task<IEnumerable<Product?>> GetListByCategoryIdAsync(int id)
        {
        return await context.Products
         .Where(p => p.CategoryId == id)
         .ToListAsync();
        }
    }

}
