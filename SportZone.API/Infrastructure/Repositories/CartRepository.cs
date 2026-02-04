using SportZone.Application.Interfaces.IRepositories;
using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;
using SportZone.Domain.Entities;

namespace SportZone.Infrastructure.Repositories;

public class CartRepository(AppDbContext _context) : GenericRepository<Cart>(_context), ICartRepository
{
    public async Task<bool> AddItemToCartAsync(string userId, int productId, int quantity, int ProductSizeId)
    {
        var cart = await GetCartByUserIdAsync(userId); 
        if (cart == null)
        {
            var newCart = new Cart
            {
                UserId = userId,
                Items = new List<CartItem> { new() { ProductId = productId, Quantity = quantity, ProductSizeId = ProductSizeId } }
                
            };
            await _context.Carts.AddAsync(newCart);

            return true;
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId && i.ProductSizeId == ProductSizeId);
        if (existingItem != null)
        {
             await _context.CartItems
                 .Where(i => i.CartId == cart.Id && i.ProductId == productId && i.ProductSizeId == ProductSizeId)
                 .ExecuteUpdateAsync(s => s.SetProperty(i => i.Quantity, i => i.Quantity + quantity));
        }
        else                    
        {
            var newItem = new CartItem 
            { 
                CartId = cart.Id, 
                ProductId = productId, 
                Quantity = quantity,
                ProductSizeId = ProductSizeId 
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
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .ThenInclude(i => i.ProductSizes)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<int> GetItemQuantityInCartAsync(string userId, int productId, string sizeName)
    {
        var cartId = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

        if (cartId == 0) return 0;

        var quantity = await _context.CartItems
                    .Where(i => i.CartId == cartId && i.ProductId == productId && i.ProductSize.SizeName == sizeName)
                    .Select(i => i.Quantity)
                    .FirstOrDefaultAsync();

        return quantity; 
    }

    public async Task<bool> RemoveItemFromCartAsync(string userId, int productId, string sizeName)
    {
        var cartId = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

        if (cartId == 0) return false;


        var rowAffected = await _context.CartItems
                         .Where(item => item.ProductId == productId && item.CartId == cartId && item.ProductSize.SizeName == sizeName)
                         .ExecuteDeleteAsync();
        return rowAffected > 0;
    }

    public async Task<bool> UpdateItemQuantityAsync(string userId, int productId, int quantity, string sizeName)
    {
        var cartId = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

        if( cartId == 0 ) return false;
       
        var rowsAffected = await _context.CartItems
                        .Where(item => item.ProductId == productId && item.CartId == cartId && item.ProductSize.SizeName == sizeName)
                        .ExecuteUpdateAsync(setter => setter
                            .SetProperty(i => i.Quantity, quantity));

        return rowsAffected > 0;
    }
}
