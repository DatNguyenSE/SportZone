using System;
using Adidas.Application.Dtos;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IService;
using AutoMapper;

namespace Adidas.Application.Services;

public class CartService(IUnitOfWork uow, IMapper mapper) : ICartService
{
    public Task<bool> AddItemToCartAsync(string userId, int productId, int quantity)
    {
        return uow.CartRepository.AddItemToCartAsync(userId, productId, quantity);
    }

    public Task<bool> ClearCartAsync(string userId)
    {
        return uow.CartRepository.ClearCartAsync(userId);
    }

    public async Task<CartDto?> GetCartByUserIdAsync(string userId)
    {
        var entity = await uow.CartRepository.GetCartByUserIdAsync(userId);
        return mapper.Map<CartDto?>(entity);
    }

    public Task<bool> RemoveItemFromCartAsync(string userId, int productId)
    {
        return uow.CartRepository.RemoveItemFromCartAsync(userId, productId);
    }

    public Task<bool> UpdateItemQuantityAsync(string userId, int productId, int quantity)
    {
        return uow.CartRepository.UpdateItemQuantityAsync(userId, productId, quantity);
    }
}
