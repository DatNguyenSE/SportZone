using SportZone.Application.Dtos;
using SportZone.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SportZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController(IInventoryService inventoryService) : ControllerBase
    {
        [HttpPut("{productId:int}/update")]
        public async Task<ActionResult> UpdateInventory(int productId, int quantity)
        {
            await inventoryService.UpdateInventoryAsync(productId, quantity);
            return Ok();
        }
        
        [HttpGet("{productId:int}")]
        public async Task<ActionResult<InventoryDto>> GetInventory(int productId)
        {
            var inventory = await inventoryService.GetInventoryAsync(productId);
            return Ok(inventory);
        }
        

        [HttpGet("{productId:int}/quantity")]
        public async Task<ActionResult<int>> GetQuantity(int productId)
        {
            var quantity = await inventoryService.GetQuantityAsync(productId);
            return Ok(quantity);
        }
    }
}
