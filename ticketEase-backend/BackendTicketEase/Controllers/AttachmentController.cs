using System.Security.Claims;
using BackendTicketEase.DTOs;
using BackendTicketEase.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentService _attachmentService;
        private readonly IAuditLogService _auditLogService;

        public AttachmentController(IAttachmentService attachmentService, IAuditLogService auditLogService)
        {
            _attachmentService = attachmentService;
            _auditLogService = auditLogService;
        }

        [HttpGet("ticket/{ticketId}")]
        [Authorize]
        public async Task<IActionResult> GetByTicket(int ticketId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            var result = await _attachmentService.GetByTicketAsync(ticketId, userId, role);

            if (!result.Success)
            {
                if (result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("not allowed", StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Attachments);
        }

        [HttpGet("{attachmentId}")]
        [Authorize]
        public async Task<IActionResult> GetById(int attachmentId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            var result = await _attachmentService.GetByIdAsync(attachmentId, userId, role);

            if (!result.Success)
            {
                if (result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("not allowed", StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Attachment);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateAttachmentRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            var result = await _attachmentService.CreateAsync(
                userId,
                role,
                request.FileUrl,
                request.FileName,
                request.FileType,
                request.TicketId,
                request.MessageId);

            if (!result.Success)
            {
                if (result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("not allowed", StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            await _auditLogService.LogAsync(
                userId,
                "Create",
                "Attachment",
                result.Attachment?.AttachmentId,
                null,
                new
                {
                    request.FileName,
                    request.FileType,
                    request.TicketId,
                    request.MessageId,
                });

            return CreatedAtAction(nameof(GetById), new { attachmentId = result.Attachment!.AttachmentId }, result.Attachment);
        }

        [HttpDelete("{attachmentId}")]
        [Authorize]
        public async Task<IActionResult> Delete(int attachmentId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            var existing = await _attachmentService.GetByIdAsync(attachmentId, userId, role);

            var result = await _attachmentService.DeleteAsync(attachmentId, userId, role);
            if (!result.Success)
            {
                if (result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("not allowed", StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            await _auditLogService.LogAsync(
                userId,
                "Delete",
                "Attachment",
                attachmentId,
                existing.Attachment == null
                    ? null
                    : new
                    {
                        existing.Attachment.FileName,
                        existing.Attachment.FileType,
                        existing.Attachment.TicketId,
                        existing.Attachment.MessageId,
                    },
                null);

            return NoContent();
        }
    }
}
