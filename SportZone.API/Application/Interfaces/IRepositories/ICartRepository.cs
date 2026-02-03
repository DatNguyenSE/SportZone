using System;
using API.Entities;

namespace SportZone.Application.Interfaces.IRepositories;

public interface ICartRepository : IGenericRepository<Cart>
{
    Task<Cart?> GetCartByUserIdAsync(string userId);
    Task<bool> AddItemToCartAsync(string userId, int productId, int quantity);
    Task<bool> RemoveItemFromCartAsync(string userId, int productId);
    Task<bool> UpdateItemQuantityAsync(string userId, int productId, int quantity);
    Task<bool> ClearCartAsync(string userId);
    Task<int> GetItemQuantityInCartAsync(string userId, int productId);
}
