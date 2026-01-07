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
        public async Task<Product?> GetProductWithInventoryByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Inventory)

                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<IEnumerable<Product?>> GetAllProductWithInventoryAsync()
        {
            return await _context.Products
                .Include(p => p.Inventory)
                .ToListAsync();
        }
        public async Task<bool> ChangeStatusProduct(int id) // soft delete
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                return false;
            }

            product.IsDeleted = true;
            return true;
        }

        
    }

}
