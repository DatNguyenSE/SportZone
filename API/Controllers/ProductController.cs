using Adidas.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{   
    [Route("api/products")]
    [ApiController]
    public class ProductController(IUnitOfWork _uow) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _uow.ProductRepository.GetAllAsync();
            return Ok (products);
        }
    }
}