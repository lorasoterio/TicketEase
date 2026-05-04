using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BackendTicketEase.DTOs;
using BackendTicketEase.Services;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly ITicketMessageService _ticketMessageService;

        public MessageController(ITicketMessageService ticketMessageService)
        {
            _ticketMessageService = ticketMessageService;
        }

        [HttpGet("ticket/{ticketId}")]
        [Authorize]
        public async Task<IActionResult> GetTicketMessages(int ticketId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            var result = await _ticketMessageService.GetMessagesAsync(ticketId, userId, role);

            if (!result.Success)
            {
                if (result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("not allowed", StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Contains("assigned staff", StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Contains("Unauthorized role", StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Messages);
        }

        [HttpPost("ticket/{ticketId}")]
        [Authorize]
        public async Task<IActionResult> SendTicketMessage(int ticketId, [FromBody] CreateTicketMessageRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = "Message cannot be empty." });

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role);
            var result = await _ticketMessageService.SendMessageAsync(ticketId, userId, role, request.Message);

            if (!result.Success)
            {
                if (result.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("not allowed", StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Contains("assigned staff", StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Contains("Unauthorized role", StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(result.TicketMessage);
        }
    }
}
