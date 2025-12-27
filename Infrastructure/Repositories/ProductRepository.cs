using Adidas.Application.Interfaces;
using API.Data;
using API.Entities;
namespace Adidas.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {
        }

        public Task<Product?> GetByCategoryIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }

}
