using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sport.Application.IService;
using SportZone.API.Extensions;
using SportZone.Application.Dtos.Vnpay;
using SportZone.Application.Interfaces.IService;
using SportZone.Application.Services;
using SportZone.Domain.Enums;

namespace SportZone.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IOrderService _orderService;
        public PaymentController(IVnPayService vnPayService, IOrderService orderService)
        {
            _vnPayService = vnPayService;
            _orderService = orderService;
        }

        [HttpPost("create-payment-url")]
        public async Task<IActionResult> CreatePaymentUrl([FromBody] PaymentRequestDto request)
        {
            var order = await _orderService.GetOrderWithPaymentAsync(request.OrderId);

            if (order == null) return NotFound("Your order not found!");
            if (order.Status == OrderStatus.Paid.ToString()
                || order.Status == OrderStatus.Cancelled.ToString()
                || order.Status == OrderStatus.Completed.ToString())
               return BadRequest($"Unable to process payment. The order is currently '{order.Status}'.");
            if(order.Payment.PaymentMethod == PaymentMethod.COD.ToString())
            {
                return BadRequest("Payment cannot be processed. The order is currently in the COD payment stage.");
            }
            var paymentModel = new PaymentInformationModel()
            {
                OrderId = order.Id.ToString(),
                Amount = (double)order.TotalAmount,
                OrderDescription = $"Pay for order - {order.Id}"

            };
            var returnUrl = "http://localhost:5144/api/Payment/Callback";
            var url = _vnPayService.CreatePaymentUrl(paymentModel, HttpContext, returnUrl);
            return Ok(new { url });
        }

        [HttpGet("Callback")]
        public async Task<IActionResult> PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            if (!response.Success || response.VnPayResponseCode != "00")
            {
                // Redirect về trang thất bại
                return Redirect($"http://localhost:3000/payment-fail?orderId={response.OrderId}");
            }

        // --- XỬ LÝ CẮT CHUỖI "12_ticks" ---
            string vnpTxnRef = response.OrderId; // Ví dụ: "12_639045166745147581"
            string orderIdRaw = vnpTxnRef;

            if (vnpTxnRef.Contains("_"))
            {
                orderIdRaw = vnpTxnRef.Split('_')[0]; // Lấy "12"
            }

            if (!int.TryParse(orderIdRaw, out int orderId))
            {
                return BadRequest("Mã đơn hàng lỗi định dạng");
            }
        // --- output là orderId:int ---

            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
                return Redirect($"http://localhost:3000/payment-fail?orderId={response.OrderId}");

            long vnpayAmount = response.Amount;
            long orderAmount = (long)(order.TotalAmount * 100); // vì vnpay trả amount về đã nhân với 100 nên ta nhân với order.amount để sosanh

            if (vnpayAmount != orderAmount) return BadRequest("The payment amounts don't match!");
            if (order.Status != OrderStatus.Paid.ToString())
            {

                await _orderService.CompletedOrderStatus(orderId);
            }
            // Redirect về trang thành công 
            return Redirect($"http://localhost:3000/payment-success?orderId={response.OrderId}");
        }
    }
}
