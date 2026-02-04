using SportZone.Application.Interfaces;

using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;
using SportZone.Domain.Entities;
namespace SportZone.Infrastructure.Repositories
{
    public class ProductRepository(AppDbContext _context) : GenericRepository<Product>(_context), IProductRepository
    {
        public async Task<IEnumerable<Product?>> GetListByCategoryIdAsync(int id)
        {
            return await _context.Products
             .Where(p => p.CategoryId == id)
             .Include(p => p.ProductSizes)
             .ToListAsync();
        }
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.ProductSizes)
                .Include(p => p.Category)
                .Include(P => P.Reviews)
                .Include(p => p.ProductSizes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<IEnumerable<Product?>> GetAllProductsDetailAsync()
        {
            return await _context.Products
                .Include(p => p.ProductSizes)
                .Include(p => p.Category)
                .Include(P => P.Reviews)
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
