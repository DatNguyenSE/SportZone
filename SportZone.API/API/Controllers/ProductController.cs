using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts()
        {
            var products = await productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{productId:int}")]
        public async Task<IActionResult> GetProductById(int productId)
        {
            var product = await productService.GetByIdAsync(productId);
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> AddProduct(CreateProductDto productDto)
        {

            var productAdded = await productService.AddAsync(productDto);

            return CreatedAtAction(nameof(GetProductById), new { productId = productAdded.Id }, productAdded);

        }

        [HttpDelete("delete/{productId:int}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            await productService.DeleteAsync(productId);
            return NoContent();
        }
    }
}