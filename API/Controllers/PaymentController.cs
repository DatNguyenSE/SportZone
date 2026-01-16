using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sport.Application.IService;
using SportZone.Application.Dtos.Vnpay;

namespace SportZone.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [HttpPost("create-payment-url")]
        public IActionResult CreatePaymentUrl([FromBody] PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl( model,HttpContext, "ai biet");
            return Ok(new { url });
        }

        [HttpGet("Callback")]
        public IActionResult PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (response.Success == false || response.VnPayResponseCode != "00")
            {
                // Thanh toán thất bại hoặc chữ ký không hợp lệ
                // Redirect về trang thất bại của React/Angular/Vue
                return Redirect($"http://localhost:3000/payment-fail?orderId={response.OrderId}");
            }

            // Thanh toán thành công
            // TODO: Update trạng thái đơn hàng trong Database (OrderService.CompleteOrder(...))

            // Redirect về trang thành công của Frontend
            return Redirect($"http://localhost:3000/payment-success?orderId={response.OrderId}");
        }
    }
}
