using API.Entities;

namespace Adidas.Application.Interfaces
{

    public interface IProductRepository : IGenericRepository<Product>
    {
        // Khai bao them ham
        Task<IEnumerable<Product?>> GetListByCategoryIdAsync(int id);
    }
}