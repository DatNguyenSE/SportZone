using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace SportZone.Application.Services
{
    public class ProductService(IUnitOfWork uow, IMapper mapper, IPhotoService photoService) : IProductService
    {
        public async Task<ProductDto> AddAsync(CreateProductDto createDto)
        {
            var errors = new List<string>();

            var isDuplicate = await uow.ProductRepository.AnyAsync(p => p.Name == createDto.Name);
            if (isDuplicate) errors.Add("Product name already exists.");

            if (createDto.Price < 0) errors.Add("Price must be greater than or equal to 0.");

            if (errors.Count > 0)
            {
                throw new BadRequestException("Validation failed.", errors.ToArray());
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

        public async Task DeleteAsync(int id)
        {
            var result = await uow.ProductRepository.ChangeStatusProduct(id); // soft delete
            if (!result)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }
            await uow.Complete();
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await uow.ProductRepository.GetAllProductWithInventoryAndCategoryAsync();
            return mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var entity = await uow.ProductRepository.GetProductByIdAsync(id);
            if (entity == null)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }
            return mapper.Map<ProductDto>(entity);
        }

        public async Task<IEnumerable<ProductDto>> GetListByCategoryIdAsync(int categoryId)
        {
            // Kiểm tra Category có tồn tại không trước (Optional - Good UX)
            // var categoryExists = await uow.CategoryRepository.ExistsAsync(categoryId);
            // if (!categoryExists) throw new NotFoundException($"Category {categoryId} not found.");
            var entities = await uow.ProductRepository.GetListByCategoryIdAsync(categoryId);
            return mapper.Map<IEnumerable<ProductDto>>(entities);
        }

        public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto productDto, IFormFile? file)
        {
            var product = await uow.ProductRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }


            if (!string.IsNullOrEmpty(productDto.Name)) product.Name = productDto.Name;
            
            if (!string.IsNullOrEmpty(productDto.Description)) product.Description = productDto.Description;

            if (!string.IsNullOrEmpty(productDto.Brand)) product.Brand = productDto.Brand;
            
            if (productDto.CategoryId != 0) product.CategoryId = productDto.CategoryId;


           
            if (productDto.Price > 0)  product.Price = productDto.Price;
    

            if (file != null)
            {
                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    var deleteResult = await photoService.DeletePhotoAsync(product.PublicId);

                }

                var uploadResult = await photoService.AddPhotoAsync(file);
                if (uploadResult.Error != null) throw new Exception(uploadResult.Error);

                product.ImageUrl = uploadResult.Url;
                product.PublicId = uploadResult.PublicId;
            }

            uow.ProductRepository.Update(product);
            await uow.Complete();
            return mapper.Map<ProductDto>(product);
        }

    }
}