using System;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using API.Entities;
using AutoMapper;

namespace SportZone.Application.Services;

public class CartService(IUnitOfWork uow, IMapper mapper) : ICartService
{
    public async Task AddItemToCartAsync(string userId, int productId, int quantity)
    {

        
        var productExists = await uow.ProductRepository.AnyAsync(p => p.Id == productId);
        if (!productExists)
        {
            throw new BadRequestException("Product does not exist.");
        }

        var hasStock = await uow.InventoryRepository.GetQuantityAsync(productId);
        if( quantity > hasStock) throw new BadRequestException("Insufficient stock for the requested quantity.");
        var stockInCart = await uow.CartRepository.GetItemQuantityInCartAsync(userId, productId);
        if ( quantity + stockInCart > hasStock) throw new BadRequestException("Insufficient stock for the requested quantity, please check your cart.");


        if( quantity <= 0)
        {
            throw new BadRequestException("Quantity must be greater than 0.");
        }
        
        await uow.CartRepository.AddItemToCartAsync(userId, productId, quantity);
        await uow.Complete();
    }

    public async Task ClearCartAsync(string userId)
    {
        await uow.CartRepository.ClearCartAsync(userId);
    }

    public async Task<CartDto?> GetCartByUserIdAsync(string userId)
    {
        var entity = await uow.CartRepository.GetCartByUserIdAsync(userId);
        return mapper.Map<CartDto?>(entity);
    }

    public Task RemoveItemFromCartAsync(string userId, int productId)
    {
        return uow.CartRepository.RemoveItemFromCartAsync(userId, productId);
    }

    public async Task UpdateItemQuantityAsync(string userId, int productId, int quantity)
    {
        var productExists = await uow.CartRepository.GetItemQuantityInCartAsync(userId, productId);
        if (productExists == 0) throw new BadRequestException("Product does not exist.");

        if( quantity < 0)  
        {
           throw new BadRequestException("Quantity must be greater than 0.");
        }

        if (quantity == 0)
        {
            await uow.CartRepository.RemoveItemFromCartAsync(userId, productId);
            return;
        }

        var hasStock = await uow.InventoryRepository.GetQuantityAsync(productId);
        
        if (quantity > hasStock) throw new BadRequestException("Insufficient stock for the requested quantity.");
        
        var updated = await uow.CartRepository.UpdateItemQuantityAsync(userId, productId, quantity);
        if (!updated)
        {
            throw new NotFoundException("Cart Id not found.");
            
        }
    }
}

            //phải có cart thì mới thêm đc item vào và update chứ
        //    var newCart = new CartDto
        //     {
        //         UserId = userId
        //     };
        //     var entity = mapper.Map<Cart>(newCart);
        //     await uow.CartRepository.AddAsync(entity);