using System;
using System.Linq.Expressions;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IRepositories;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Adidas.Infrastructure.Repositories;

public class CartRepository(AppDbContext _context) : GenericRepository<Cart>(_context), ICartRepository
{
    public async Task<bool> AddItemToCartAsync(string userId, int productId, int quantity)
    {
        var cart = await GetCartByUserIdAsync(userId); // include items, products
        if (cart == null)
        {
            var newCart = new Cart
            {
                UserId = userId,
                Items = new List<CartItem>
                {
                    new CartItem { ProductId = productId, Quantity = quantity }
                }
            };
            await _context.Carts.AddAsync(newCart);

            return true;
        }
        if (cart.Items != null)
        {
             await _context.CartItems
                 .Where(i => i.CartId == cart.Id && i.ProductId == productId)
                 .ExecuteUpdateAsync(s => s.SetProperty(i => i.Quantity, i => i.Quantity + quantity));
        }
        else
        {
            var newItem = new CartItem 
            { 
                CartId = cart.Id, 
                ProductId = productId, 
                Quantity = quantity 
            };
            await _context.CartItems.AddAsync(newItem);
        }

        return true;
    }

    public async Task<bool> ClearCartAsync(string userId)
    {
        var cartId = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

        if (cartId == 0) return false;

        await _context.CartItems
            .Where(item => item.CartId == cartId)
            .ExecuteDeleteAsync(); // delete table by cart id

        return true;
    }

    public async Task<Cart?> GetCartByUserIdAsync(string userId)
    {
        return await _context.Carts
            .Include(C => C.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(C => C.UserId == userId);
    }

    public async Task<bool> RemoveItemFromCartAsync(string userId, int productId)
    {
        var cartId = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

        if (cartId == 0) return false;


        var rowAffected = await _context.CartItems
                         .Where(item => item.ProductId == productId && item.CartId == cartId)
                         .ExecuteDeleteAsync();
        return rowAffected > 0;
    }

    public async Task<bool> UpdateItemQuantityAsync(string userId, int productId, int quantity)
    {
        var cartId = await _context.Carts.Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

        if (cartId == 0) return false;

        var rowsAffected = await _context.CartItems
                        .Where(item => item.ProductId == productId && item.CartId == cartId)
                        .ExecuteUpdateAsync(setter => setter
                            .SetProperty(i => i.Quantity, quantity));

        return rowsAffected > 0;
    }
}
