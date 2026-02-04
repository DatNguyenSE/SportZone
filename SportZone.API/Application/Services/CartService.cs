using System;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using AutoMapper;

namespace SportZone.Application.Services;

public class CartService(IUnitOfWork uow, IMapper mapper) : ICartService
{
    public async Task AddItemToCartAsync(string userId, int productId, int quantity, string sizeName)
    {
        // Validate
        var productSize = await uow.ProductSizeRepository.GetProductSizeIdAsync(productId, sizeName);
        if (productSize == null)
        {
            throw new BadRequestException("Product size does not exist.");
        }
        
        if( quantity <= 0) throw new BadRequestException("Quantity must be greater than 0.");
        
        var productExists = await uow.ProductRepository.AnyAsync(p => p.Id == productId);
        if (!productExists)
        {
            throw new BadRequestException("Product does not exist.");
        }
        // Check stock
        var hasStock =  productSize.Quantity;

    
        if( quantity > hasStock) throw new BadRequestException("Insufficient stock for the requested quantity.");

        var stockInCart = await uow.CartRepository.GetItemQuantityInCartAsync(userId, productId, sizeName);
        if ( quantity + stockInCart > hasStock) throw new BadRequestException("Insufficient stock for the requested quantity, please check your cart.");


       
        
        await uow.CartRepository.AddItemToCartAsync(userId, productId, quantity, productSize.Id);
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

    public Task RemoveItemFromCartAsync(string userId, int productId, string sizeName)
    {
        return  uow.CartRepository.RemoveItemFromCartAsync(userId, productId, sizeName);
    }

    public async Task UpdateItemQuantityAsync(string userId, int productId, int quantity, string sizeName)
    {
        var productQuantity = await uow.CartRepository.GetItemQuantityInCartAsync(userId, productId, sizeName);
        if (productQuantity == 0) throw new BadRequestException("Product does not exist in cart.");

        if( quantity < 0)  
        {
           throw new BadRequestException("Quantity must be greater than 0.");
        }

        if (quantity == 0)
        {
            await uow.CartRepository.RemoveItemFromCartAsync(userId, productId, sizeName);
            return;
        }

        var hasStock = await uow.ProductSizeRepository.GetQuantityBySizeNameAsync(productId, sizeName);
        
        if (quantity > hasStock) throw new BadRequestException("Insufficient stock for the requested quantity.");
        
        var updated = await uow.CartRepository.UpdateItemQuantityAsync(userId, productId, quantity, sizeName);
        if (!updated)
        {
            throw new NotFoundException("Cart Id not found.");
            
        }
    }
}

