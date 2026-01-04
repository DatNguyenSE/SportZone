using System;
using Adidas.Application.Dtos;

namespace Adidas.Application.Interfaces.IService;

public interface ICartService
{
    Task<CartDto?> GetCartByUserIdAsync(string userId);
    Task<bool> AddItemToCartAsync(string userId, int productId, int quantity);
    Task<bool> RemoveItemFromCartAsync(string userId, int productId);
    Task<bool> UpdateItemQuantityAsync(string userId, int productId, int quantity);
    Task<bool> ClearCartAsync(string userId);
}
