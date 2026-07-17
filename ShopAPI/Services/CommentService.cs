using ShopAPI.Data;
using ShopAPI.DTOs;
using ShopAPI.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopAPI.Services
{
    public class CommentService : ICommentService
    {
        private readonly ShopDbContext _context;
        private readonly IMapper _mapper;

        public CommentService(ShopDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CommentReadDto?> GetCommentByIdAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return null;
            return _mapper.Map<CommentReadDto>(comment);
        }

        public async Task<IEnumerable<CommentReadDto>> GetCommentsByProductIdAsync(int productId)
        {
            var comments = await _context.Comments
                .Include(c => c.Customer)
                .Where(c => c.ProductId == productId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            return _mapper.Map<IEnumerable<CommentReadDto>>(comments);
        }

        public async Task<CommentReadDto> CreateCommentAsync(CommentCreateDto dto)
        {
            var comment = _mapper.Map<Comment>(dto);
            comment.CreatedAt = DateTime.UtcNow;
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            await _context.Entry(comment).Reference(c => c.Customer).LoadAsync();
            return _mapper.Map<CommentReadDto>(comment);
        }

        public async Task<CommentReadDto?> UpdateCommentAsync(int id, CommentUpdateDto dto)
        {
            var existingComment = await _context.Comments.Include(c => c.Customer).FirstOrDefaultAsync(c => c.CommentId == id);
            if (existingComment == null) return null;

            existingComment.Text = dto.Text;
            existingComment.Rating = dto.Rating;

            await _context.SaveChangesAsync();
            return _mapper.Map<CommentReadDto>(existingComment);
        }

        public async Task<bool> DeleteCommentAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return false;
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}