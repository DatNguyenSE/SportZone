using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Sport.Application.IService;
using SportZone.Application.Dtos.Vnpay;
using SportZone.Infrastructure.Common.Utilities;
namespace Sport.Infrastructure.Service;
public class VnPayService : IVnPayService
{
    private readonly IConfiguration _configuration;

    public VnPayService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context, string txnRef)
    {
        var timeZoneId = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
        var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneId);
        var tick = DateTime.Now.Ticks.ToString();
        var vnpay = new VnPayLibrary();
        var urlCallBack = _configuration["Vnpay:ReturnUrl"];

        vnpay.AddRequestData("vnp_Version", _configuration["VnPay:Version"]);
        vnpay.AddRequestData("vnp_Command", _configuration["VnPay:Command"]);
        vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]);
        vnpay.AddRequestData("vnp_Amount", (model.Amount * 100).ToString()); // Số tiền phải nhân với 100
        
        vnpay.AddRequestData("vnp_CreateDate",timeNow.ToString("yyyyMMddHHmmss"));
        vnpay.AddRequestData("vnp_CurrCode", _configuration["VnPay:CurrCode"]);
        vnpay.AddRequestData("vnp_IpAddr", vnpay.GetIpAddress(context)); 
        vnpay.AddRequestData("vnp_Locale", _configuration["VnPay:Locale"]);
        
        vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + model.OrderDescription);
        vnpay.AddRequestData("vnp_OrderType", model.OrderType); // Ví dụ: "other"
        vnpay.AddRequestData("vnp_ReturnUrl", "https://localhost:5001/api/Payment/Callback"); // URL nhận kết quả
        vnpay.AddRequestData("vnp_TxnRef", tick); // Mã đơn hàng (phải là duy nhất)

        var paymentUrl = vnpay.CreateRequestUrl(_configuration["VnPay:BaseUrl"], _configuration["VnPay:HashSecret"]);
        return paymentUrl;
    }



    public PaymentResponseModel PaymentExecute(IQueryCollection collections)
    {
        var vnpay = new VnPayLibrary();
        foreach (var (key, value) in collections)
        {
            if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
            {
                vnpay.AddResponseData(key, value.ToString());
            }
        }

        var vnp_orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
        var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
        var vnp_SecureHash = collections.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
        var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
        var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

        bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _configuration["VnPay:HashSecret"]);
        
        if (!checkSignature)
        {
            return new PaymentResponseModel { Success = false };
        }

        return new PaymentResponseModel
        {
            Success = true,
            PaymentMethod = "VnPay",
            OrderDescription = vnp_OrderInfo,
            OrderId = vnp_orderId.ToString(),
            TransactionId = vnp_TransactionId.ToString(),
            Token = vnp_SecureHash,
            VnPayResponseCode = vnp_ResponseCode
        };
    }
}