using SportZone.Domain.Entities;
namespace SportZone.Application.Interfaces
{

    public interface IProductRepository : IGenericRepository<Product>
    {
        // Khai bao them ham
        Task<IEnumerable<Product?>> GetListByCategoryIdAsync(int id);
        Task<Product?> GetProductByIdAsync(int id);
        Task<IEnumerable<Product?>> GetAllProductsDetailAsync();
        Task<bool> ChangeStatusProduct(int id);
    }
}