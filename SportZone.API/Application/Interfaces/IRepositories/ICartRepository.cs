using System;
using SportZone.Domain.Entities;
namespace SportZone.Application.Interfaces.IRepositories;

public interface ICartRepository : IGenericRepository<Cart>
{
    Task<Cart?> GetCartByUserIdAsync(string userId);
    Task<bool> AddItemToCartAsync(string userId, int productId, int quantity, int ProductSizeId);
    Task<bool> RemoveItemFromCartAsync(string userId, int productId, string sizeName);
    Task<bool> UpdateItemQuantityAsync(string userId, int productId, int quantity, string sizeName);
    Task<bool> ClearCartAsync(string userId);
    Task<int> GetItemQuantityInCartAsync(string userId, int productId, string sizeName);
}
