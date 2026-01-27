using System;
using SportZone.Application.Dtos;

namespace SportZone.Application.Interfaces.IService;

public interface ICartService
{
    Task<CartDto?> GetCartByUserIdAsync(string userId);
    Task AddItemToCartAsync(string userId, int productId, int quantity);
    Task RemoveItemFromCartAsync(string userId, int productId);
    Task UpdateItemQuantityAsync(string userId, int productId, int quantity);
    Task ClearCartAsync(string userId);
}
