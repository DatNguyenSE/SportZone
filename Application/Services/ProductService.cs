using Adidas.Application.Dtos;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IService;
using API.Entities;
using AutoMapper;

namespace Adidas.Application.Services
{
    public class ProductService(IUnitOfWork uow, IMapper mapper) : IProductService
    {
        public async Task<ProductDto> AddAsync(CreateProductDto createDto)
        {
            var isDuplicate = await uow.ProductRepository.AnyAsync(p => p.Name == createDto.Name);
            if (isDuplicate)
            {
                throw new Exception("Product name already exists.");
            }

            var entity = mapper.Map<Product>(createDto);

            // 1:1 relationship 
                entity.Inventory = new Inventory
                {
                    Quantity = createDto.Quantity,
                };
            
            
            await uow.ProductRepository.AddAsync(entity);
            await uow.Complete();
            return mapper.Map<ProductDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var result = await uow.ProductRepository.ChangeStatusProduct(id); // soft delete
            if (result)
            {
                await uow.Complete();
            }
            return result;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await uow.ProductRepository.GetAllProductWithInventoryAsync();
            return mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var entity = await uow.ProductRepository.GetProductWithInventoryByIdAsync(id);
            return mapper.Map<ProductDto>(entity);
        }

        public async Task<IEnumerable<ProductDto>> GetListByCategoryIdAsync(int categoryId)
        {
            var entities = await uow.ProductRepository.GetListByCategoryIdAsync(categoryId);
            return mapper.Map<IEnumerable<ProductDto>>(entities);
        }

        public async Task<ProductDto?> UpdateAsync(int id, ProductDto productDto)
        {
            var existingProduct = await uow.ProductRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return null;
            }
            mapper.Map(productDto, existingProduct); // bo qua thuoc tinh thieu dto có mà entity k
            uow.ProductRepository.Update(existingProduct);
            await uow.Complete();
            return mapper.Map<ProductDto>(existingProduct);
        }
    }
}