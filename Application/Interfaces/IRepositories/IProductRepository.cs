using API.Entities;

namespace Adidas.Application.Interfaces
{

    public interface IProductRepository : IGenericRepository<Product>
    {
        // Khai bao them ham
        Task<IEnumerable<Product?>> GetListByCategoryIdAsync(int id);
        Task<Product?> GetProductWithInventoryByIdAsync(int id);
        Task<IEnumerable<Product?>> GetAllProductWithInventoryAsync();
        Task<bool> ChangeStatusProduct(int id);
    }
}