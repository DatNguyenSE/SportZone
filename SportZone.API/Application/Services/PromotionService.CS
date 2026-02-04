using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using SportZone.Application.Dtos;

namespace SportZone.Application.Services
{
    public class PromotionService(IUnitOfWork uow, IMapper mapper) : IPromotionService
    {
        public async Task<IEnumerable<PromotionDto>> GetActivePromotionsAsync()
        {
            var promotions = await uow.PromotionRepository.GetActivePromotionsAsync();
            return mapper.Map<IEnumerable<PromotionDto>>(promotions);
        }

        public async Task<PromotionDto?> GetByCodeAsync(string code)
        {
            var promotion = await uow.PromotionRepository.GetByCodeAsync(code);
            return mapper.Map<PromotionDto>(promotion);
        }
    }

}