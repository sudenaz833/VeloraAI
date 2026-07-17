using System.Collections.Generic;
using System.Threading.Tasks;
using ShopAPI.DTOs;

namespace ShopAPI.Services
{
    public interface ICommentService
    {
        Task<CommentReadDto?> GetCommentByIdAsync(int id);
        Task<IEnumerable<CommentReadDto>> GetCommentsByProductIdAsync(int productId);
        Task<CommentReadDto> CreateCommentAsync(CommentCreateDto dto);
        Task<CommentReadDto?> UpdateCommentAsync(int id, CommentUpdateDto dto);
        Task<bool> DeleteCommentAsync(int id);
    }
}