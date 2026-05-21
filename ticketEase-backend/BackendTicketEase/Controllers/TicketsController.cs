using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;
using BackendTicketEase.Services;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly GenerateRefNumber _refNumberService;
        private readonly IAuditLogService _auditLogService;

        public TicketsController(AppDbContext context, GenerateRefNumber refNumberService, IAuditLogService auditLogService)
        {
            _context = context;
            _refNumberService = refNumberService;
            _auditLogService = auditLogService;
        }

        // GET: api/tickets
        // Students always see only their own tickets (derived from JWT).
        // Staff/Admin may optionally filter by studentId query param.
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromQuery] int? studentId = null)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            // If role claim is absent, default to the most restrictive (student) behavior
            var isStudent = string.IsNullOrEmpty(roleClaim) ||
                            string.Equals(roleClaim, nameof(UserRole.Student), StringComparison.OrdinalIgnoreCase);

            var query = _context.Tickets.AsNoTracking();

            if (isStudent)
            {
                // Students can only access their own tickets; ignore any caller-supplied studentId
                query = query.Where(t => t.StudentId == userId);
            }
            else if (studentId.HasValue)
            {
                // Staff/Admin can optionally filter by a specific student
                query = query.Where(t => t.StudentId == studentId.Value);
            }

            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        // GET: api/tickets/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TicketId == id);

            if (ticket == null)
                return NotFound();

            return Ok(ticket);
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<ActionResult<Ticket>> CreateTicket([FromBody] Ticket ticket)
        {
            if (ticket == null)
                return BadRequest();

            // Generate unique reference number
            ticket.ReferenceNumber = await _refNumberService.GenerateTicketReferenceAsync();

            // Ensure timestamps are UTC (Npgsql requires UTC for timestamptz)
            ticket.CreatedAt = DateTime.UtcNow;
            ticket.UpdatedAt = DateTime.UtcNow;

            // Remarks is already initialized in the model, no need for EstimatedCompletion

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var cpid) ? cpid : ticket.StudentId;
            await _auditLogService.LogAsync(actorId, "Create", "Ticket", ticket.TicketId, null, new { ticket.TicketType, ticket.Subject, ticket.Priority, ticket.Status });
            return CreatedAtAction(nameof(GetTicket), new { id = ticket.TicketId }, ticket);
        }

        // PUT: api/tickets/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] Ticket ticket)
        {
            if (ticket == null || id != ticket.TicketId)
                return BadRequest();

            var existing = await _context.Tickets.FindAsync(id);
            if (existing == null)
                return NotFound();

            // Validate status constraints based on ticket type
            if (ticket.Status == TicketStatus.Responded && existing.TicketType != TicketType.Inquiry)
                return BadRequest(new { message = "'Responded' status is only applicable to Inquiry tickets." });

            if (ticket.Status == TicketStatus.ReadyForPickup)
            {
                if (existing.TicketType != TicketType.DocumentRequest)
                    return BadRequest(new { message = "'Ready for Pickup' status is only applicable to Document Request tickets." });
            }

            var oldSnapshot = new { existing.TicketType, existing.Subject, existing.Priority, existing.Status, existing.AssignedStaffId };
            // Update allowed fields
            existing.StudentId = ticket.StudentId;
            existing.TicketType = ticket.TicketType;
            existing.Subject = ticket.Subject;
            existing.Description = ticket.Description;
            existing.Priority = ticket.Priority;
            existing.Status = ticket.Status;
            existing.AssignedStaffId = ticket.AssignedStaffId;
            existing.Remarks = ticket.Remarks;
            existing.UpdatedAt = DateTime.UtcNow;

            // No EstimatedCompletion field anymore

            _context.Tickets.Update(existing);
            await _context.SaveChangesAsync();

            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var upid) ? upid : existing.StudentId;
            await _auditLogService.LogAsync(actorId, "Update", "Ticket", id, oldSnapshot, new { existing.TicketType, existing.Subject, existing.Priority, existing.Status, existing.AssignedStaffId });
            return NoContent();
        }

        // DELETE: api/tickets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var existing = await _context.Tickets.FindAsync(id);
            if (existing == null)
                return NotFound();

            var snapshot = new { existing.TicketType, existing.Subject, existing.Priority, existing.Status, existing.StudentId };
            int? actorId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var dpid) ? dpid : existing.StudentId;
            _context.Tickets.Remove(existing);
            await _context.SaveChangesAsync();

            await _auditLogService.LogAsync(actorId, "Delete", "Ticket", existing.TicketId, snapshot, null);
            return NoContent();
        }

        // GET: api/tickets/{id}/messages
        [HttpGet("{id}/messages")]
        [Authorize]
        public async Task<ActionResult> GetTicketMessages(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            var isStudent = string.IsNullOrEmpty(roleClaim) ||
                            string.Equals(roleClaim, nameof(UserRole.Student), StringComparison.OrdinalIgnoreCase);

            var ticket = await _context.Tickets.AsNoTracking()
                .FirstOrDefaultAsync(t => t.TicketId == id);
            if (ticket == null) return NotFound();

            if (isStudent && ticket.StudentId != userId)
                return Forbid();

            var query = _context.TicketMessages
                .AsNoTracking()
                .Where(m => m.TicketId == id);

            var messages = await query
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.MessageId,
                    m.TicketId,
                    m.SenderId,
                    m.Message,
                    m.CreatedAt,
                    SenderName = (_context.Students
                        .Where(s => s.UserId == m.SenderId)
                        .Select(s =>
                            (s.FirstName +
                            (string.IsNullOrEmpty(s.MiddleName) ? "" : " " + s.MiddleName) +
                            (string.IsNullOrEmpty(s.LastName) ? "" : " " + s.LastName) +
                            (string.IsNullOrEmpty(s.Suffix) ? "" : ", " + s.Suffix)
                            ).Trim())
                        .FirstOrDefault()
                        ??
                        _context.Staffs
                        .Where(st => st.UserId == m.SenderId)
                        .Select(st =>
                            (st.FirstName +
                            (string.IsNullOrEmpty(st.MiddleName) ? "" : " " + st.MiddleName) +
                            (string.IsNullOrEmpty(st.LastName) ? "" : " " + st.LastName) +
                            (string.IsNullOrEmpty(st.Suffix) ? "" : ", " + st.Suffix)
                            ).Trim())
                        .FirstOrDefault()
                        ?? "Unknown"),
                    SenderRole = _context.Users
                        .Where(u => u.UserId == m.SenderId)
                        .Select(u => u.Role.ToString())
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(messages);
        }

        // POST: api/tickets/{id}/messages
        [HttpPost("{id}/messages")]
        [Authorize]
        public async Task<ActionResult> PostTicketMessage(int id, [FromBody] TicketMessageRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { error = "Message cannot be empty." });

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound();

            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            var isStudent = string.IsNullOrEmpty(roleClaim) ||
                            string.Equals(roleClaim, nameof(UserRole.Student), StringComparison.OrdinalIgnoreCase);

            if (isStudent && ticket.StudentId != userId)
                return Forbid();

            var message = new TicketMessage
            {
                TicketId = id,
                SenderId = userId,
                Message = request.Message,
                CreatedAt = DateTime.UtcNow,
            };

            await _context.TicketMessages.AddAsync(message);
            await _context.SaveChangesAsync();

            await _auditLogService.LogAsync(userId, "Create", "TicketMessage", message.MessageId, null, new { message.TicketId, message.Message });
            return Ok(new
            {
                message.MessageId,
                message.TicketId,
                message.SenderId,
                message.Message,
                message.CreatedAt,
            });
        }
    }

    public class TicketMessageRequest
    {
        public string Message { get; set; } = "";
    }
}
