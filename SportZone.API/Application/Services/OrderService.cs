using System;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Enums;
using SportZone.Domain.Exceptions;
using API.Entities;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;

namespace SportZone.Application.Services;

public class OrderService(IUnitOfWork uow, IMapper mapper, ILogger<OrderService> logger) : IOrderService
{
    public async Task<OrderDetailsDto> CreateOrderByCartItemsAsync(string userId, PaymentMethod paymentMethod)
    {
        // 1. Get user cart
        var userCart = await uow.CartRepository.GetCartByUserIdAsync(userId);

        if (userCart == null || userCart.Items.Count == 0)
        {
            throw new InvalidOperationException("Cart is empty or does not exist.");
        }

        // 2. TỐI ƯU: Load Inventory và chuyển sang Dictionary để tra cứu nhanh O(1)
        var productIds = userCart.Items.Select(i => i.ProductId).Distinct().ToList();
        var inventoriesList = await uow.InventoryRepository.GetListByProductIdsAsync(productIds);

        // Key là ProductId, Value là Inventory Object
        var inventoryDict = inventoriesList.ToDictionary(x => x.ProductId);

        // 3. Create order object
        var order = new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            Items = new List<OrderItem>()
        };

        decimal totalAmount = 0;

        foreach (var cartItem in userCart.Items)
        {
            // Validate Product exists in cart
            if (cartItem.Product == null)
                throw new Exception($"Product info missing for CartItem ID: {cartItem.CartId}");

            if (!inventoryDict.TryGetValue(cartItem.ProductId, out var inventory))
            {
                throw new BadRequestException($"Inventory not found for Product ID: {cartItem.ProductId}");
            }

            // Check stock
            if (inventory.Quantity < cartItem.Quantity)
            {
                throw new InvalidOperationException($"Not enough stock for '{cartItem.Product.Name}'. Available: {inventory.Quantity}, Requested: {cartItem.Quantity}");
            }

            // Update stock (Memory)
            inventory.Quantity -= cartItem.Quantity;
            inventory.UpdatedAt = DateTime.UtcNow;

            var orderItem = new OrderItem
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.Product.Price
            };

            totalAmount += orderItem.Quantity * orderItem.UnitPrice;
            order.Items.Add(orderItem);
        }

        order.TotalAmount = totalAmount;

        //chia 2 truong hop 
        if(paymentMethod == PaymentMethod.COD)
        {
            order.Payment = new Payment
            {
                PaymentMethod = PaymentMethod.COD,
                PaymentStatus = PaymentStatus.Pending,
                PaidAt = null
            };
            order.Status = OrderStatus.Placed; // dat hang va nhan tai cua hang
            
        }
        else if(paymentMethod == PaymentMethod.OnlineBanking)
        {
            order.Payment = new Payment
            {
                PaymentMethod = PaymentMethod.OnlineBanking,
                PaymentStatus = PaymentStatus.Pending,
                PaidAt = null
            };
            order.Status = OrderStatus.Pending; 
        }
        else
        {
             throw new BadRequestException($"Payment method '{paymentMethod}' is not supported.");
        }


        // 6. Save changes
        await uow.OrderRepository.AddAsync(order);
        await uow.CartRepository.ClearCartAsync(userId);
        await uow.Complete(); // Commit transaction (Order + Inventory + Cart)

        return mapper.Map<OrderDetailsDto>(order);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId)
    {
        var orders = await uow.OrderRepository.GetOrdersByUserIdAsync(userId);
        return mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<OrderDetailsDto?> GetOrderWithDetailsAsync(int orderId, string userId)
    {
        var orderEntity = await uow.OrderRepository.GetOrderWithDetailsAsync(orderId, userId);
        if (orderEntity == null)
        {
            throw new NotFoundException($"Order with ID {orderId} not found.");
        }
        return mapper.Map<OrderDetailsDto>(orderEntity);
    }

    public async Task<IEnumerable<OrderDetailsDto>> GetListOrderWithPaymentAsync(string userId, PaymentStatus paymentStatus)
    {
        var orderEntity = await uow.OrderRepository.GetListOrderWithPaymentAsync(userId, paymentStatus);

        return mapper.Map<IEnumerable<OrderDetailsDto>>(orderEntity);
    }

    public async Task CancelOrderAsync(int orderId, string userId)
    {
        // Đảm bảo Repository có Include(Items)
        var order = await uow.OrderRepository.GetOrderWithDetailsAsync(orderId, userId)
            ?? throw new NotFoundException($"Order with ID {orderId} not found!!!");

        if (order.Payment?.PaymentStatus != null && order.Payment.PaymentStatus != PaymentStatus.Pending)
        {
            throw new BadRequestException($"Cannot cancel order. Payment status is {order.Payment.PaymentStatus}");
        }

        // Update status
        if (order.Payment != null) 
        order.Payment.PaymentStatus = PaymentStatus.Failed;
        order.Status = OrderStatus.Cancelled;

        // REFUND QUANTITY 
        if (order.Items != null && order.Items.Count != 0)
        {
            var productIds = order.Items.Select(i => i.ProductId).Distinct().ToList();
            var inventoriesList = await uow.InventoryRepository.GetListByProductIdsAsync(productIds);

            // Dùng Dictionary để map nhanh
            var inventoryDict = inventoriesList.ToDictionary(i => i.ProductId);

            foreach (var orderItem in order.Items)
            {
                if (inventoryDict.TryGetValue(orderItem.ProductId, out var inventory))
                {
                    inventory.Quantity += orderItem.Quantity;
                    inventory.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    logger.LogWarning(
                        "Refund Warning: Order {OrderId} cancelled but Inventory for ProductId {ProductId} not found. Stock could not be restored.",
                        orderId,
                        orderItem.ProductId
                    );
                }
            }
        }

        await uow.Complete();
    }

    public async Task UpdateOrderStatus(int orderId, OrderStatus orderStatus)
    {
        var order = await uow.OrderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new BadRequestException("Order not found");
        }
        order.Status = orderStatus;

        await uow.Complete();
    }

    public async Task CompletedOrderStatus(int orderId)
    {
        var order = await uow.OrderRepository.GetOrderWithPaymentAsync(orderId); //include Payment

        if (order == null)
        {
            throw new BadRequestException("Order not found");
        }

        if (order.Status != OrderStatus.Paid)
        {
            order.Status = OrderStatus.Paid;

            if (order.Payment != null)
            {
                order.Payment.PaymentStatus = PaymentStatus.Success;
                order.Payment.PaidAt = DateTime.UtcNow;
            }
            else
            {
                // Trường hợp dữ liệu bị lỗi: Có đơn hàng nhưng chưa tạo record Payment
                // Bạn có thể tạo mới Payment tại đây hoặc log warning tùy nghiệp vụ
            }

            await uow.Complete();
        }
    }

    public async Task<OrderDto> GetOrderByIdAsync(int orderId)
    {
        var order = await uow.OrderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new NotFoundException("Order not found");
        }
        return mapper.Map<OrderDto>(order);
    }

    public async Task<OrderDetailsDto> GetOrderWithPaymentAsync(int orderId)
    {
       var order = await uow.OrderRepository.GetOrderWithPaymentAsync(orderId);
       return mapper.Map<OrderDetailsDto>(order);
    }
}
