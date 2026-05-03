using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Services;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuditLogsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditLogService _auditLogService;

        public AuditLogsController(AppDbContext context, IAuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }



        // POST: api/auditlogs
        [HttpPost]
        public async Task<IActionResult> CreateAuditLog([FromBody] CreateAuditLogRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Request body cannot be null." });
            }

            if (string.IsNullOrWhiteSpace(request.ActionType))
            {
                return BadRequest(new { message = "ActionType is required." });
            }

            await _auditLogService.LogAsync(
                request.UserId,
                request.ActionType,
                request.EntityType,
                request.EntityId,
                request.OldValues,
                request.NewValues);

            return Created(nameof(CreateAuditLog), new { message = "Audit log created successfully." });
        }

        // GET: api/auditlogs
        [HttpGet]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _context.AuditLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt)
                .Select(l => new
                {
                    l.LogId,
                    l.UserId,
                    userEmail = l.User != null ? l.User.Email : "—",
                    l.ActionType,
                    l.EntityType,
                    l.EntityId,
                    l.OldValues,
                    l.NewValues,
                    l.CreatedAt,
                })
                .ToListAsync();

            return Ok(logs);
        }

        // GET: api/auditlogs/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuditLog(int id)
        {
            var log = await _context.AuditLogs
                .Include(l => l.User)
                .Where(l => l.LogId == id)
                .Select(l => new
                {
                    l.LogId,
                    l.UserId,
                    userEmail = l.User != null ? l.User.Email : "—",
                    l.ActionType,
                    l.EntityType,
                    l.EntityId,
                    l.OldValues,
                    l.NewValues,
                    l.CreatedAt,
                })
                .FirstOrDefaultAsync();

            if (log == null)
                return NotFound(new { message = $"Audit log with ID {id} not found." });

            return Ok(log);
        }
    }

    public class CreateAuditLogRequest
    {
        public int? UserId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public object? OldValues { get; set; }
        public object? NewValues { get; set; }
    }
}
