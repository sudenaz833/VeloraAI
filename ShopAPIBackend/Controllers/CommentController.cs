using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ShopAPI.Services;
using ShopAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CommentReadDto>> GetCommentById(int id)
        {
            var comment = await _commentService.GetCommentByIdAsync(id);
            if (comment == null) return NotFound("Yorum bulunamadı.");
            return Ok(comment);
        }

        [HttpGet("product/{productId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CommentReadDto>>> GetCommentsByProductId(int productId)
        {
            var comments = await _commentService.GetCommentsByProductIdAsync(productId);
            return Ok(comments);
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<CommentReadDto>> CreateComment(CommentCreateDto dto)
        {
            var createdComment = await _commentService.CreateCommentAsync(dto);
            return Ok(createdComment);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await _commentService.GetCommentByIdAsync(id);
            if (comment == null) return NotFound("Yorum bulunamadı.");

            var nameIdentifier = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (int.TryParse(nameIdentifier, out int authenticatedCustomerId))
            {
                if (role != "Admin" && comment.CustomerId != authenticatedCustomerId)
                {
                    return Forbid("Sadece kendi yorumlarınızı silebilirsiniz.");
                }
            }
            else
            {
                return Unauthorized();
            }

            var deleted = await _commentService.DeleteCommentAsync(id);
            if (!deleted) return NotFound("Yorum bulunamadı.");
            return Ok("Yorum başarıyla silindi.");
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<CommentReadDto>> UpdateComment(int id, CommentUpdateDto dto)
        {
            var comment = await _commentService.GetCommentByIdAsync(id);
            if (comment == null) return NotFound("Yorum bulunamadı.");

            var nameIdentifier = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (int.TryParse(nameIdentifier, out int authenticatedCustomerId))
            {
                if (role != "Admin" && comment.CustomerId != authenticatedCustomerId)
                {
                    return Forbid("Sadece kendi yorumlarınızı güncelleyebilirsiniz.");
                }
            }
            else
            {
                return Unauthorized();
            }

            var updatedComment = await _commentService.UpdateCommentAsync(id, dto);
            if (updatedComment == null) return NotFound("Yorum bulunamadı.");
            return Ok(updatedComment);
        }
    }
}