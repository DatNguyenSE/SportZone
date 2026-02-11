using System;
using SportZone.Application.Dtos;

namespace SportZone.Application.Interfaces.IService;

public interface ICartService
{
    Task<CartDto?> GetCartByUserIdAsync(string userId);
    Task AddItemToCartAsync(string userId, int productId, int quantity, string sizeName);
    Task RemoveItemFromCartAsync(string userId, int productId, string sizeName);
    Task UpdateItemQuantityAsync(string userId, int productId, int quantity, string sizeName);
    Task ClearCartAsync(string userId);
}
