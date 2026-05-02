using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public TicketsController(AppDbContext context, GenerateRefNumber refNumberService)
        {
            _context = context;
            _refNumberService = refNumberService;
        }

        // GET: api/tickets?studentId=5
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets([FromQuery] int? studentId = null)
        {
            var query = _context.Tickets.AsNoTracking();

            if (studentId.HasValue)
                query = query.Where(t => t.StudentId == studentId.Value);

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

            // Normalize EstimatedCompletion to UTC if provided
            if (ticket.EstimatedCompletion.HasValue)
            {
                ticket.EstimatedCompletion = ticket.EstimatedCompletion.Value.ToUniversalTime();
            }

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();

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

            // Update allowed fields
            existing.StudentId = ticket.StudentId;
            existing.TicketType = ticket.TicketType;
            existing.Subject = ticket.Subject;
            existing.Description = ticket.Description;
            existing.Priority = ticket.Priority;
            existing.Status = ticket.Status;
            existing.AssignedStaffId = ticket.AssignedStaffId;
            existing.UpdatedAt = DateTime.UtcNow;

            // Normalize EstimatedCompletion to UTC if provided
            if (ticket.EstimatedCompletion.HasValue)
            {
                existing.EstimatedCompletion = ticket.EstimatedCompletion.Value.ToUniversalTime();
            }
            else
            {
                existing.EstimatedCompletion = null;
            }

            _context.Tickets.Update(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tickets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var existing = await _context.Tickets.FindAsync(id);
            if (existing == null)
                return NotFound();

            _context.Tickets.Remove(existing);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
