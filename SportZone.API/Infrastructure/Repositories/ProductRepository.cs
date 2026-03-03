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

        public async Task<IEnumerable<Product?>> GetListByLabelAsync(string label)
        {
            return await _context.Products
                .Where(p => p.Label == label)
                 .Include(p => p.ProductSizes)
                 .ToListAsync();
        }   
        
        public async Task<IEnumerable<Product?>> GetListByListFeatureAsync(List<int> featureIds)
        {
             return await _context.Products
                .AsNoTracking()
                .Include(p => p.Features.Where(f => featureIds.Contains(f.Id)))
                .Include(p => p.ProductSizes)
                .Where(p => p.Features.Any(f => featureIds.Contains(f.Id)))
                .ToListAsync();
         }

    }
}
