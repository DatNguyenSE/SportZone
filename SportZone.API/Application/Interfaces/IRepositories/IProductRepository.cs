using API.Entities;

namespace SportZone.Application.Interfaces
{

    public interface IProductRepository : IGenericRepository<Product>
    {
        // Khai bao them ham
        Task<IEnumerable<Product?>> GetListByCategoryIdAsync(int id);
        Task<Product?> GetProductWithInventoryByIdAsync(int id);
        Task<IEnumerable<Product?>> GetAllProductWithInventoryAndCategoryAsync();
        Task<bool> ChangeStatusProduct(int id);
    }
}