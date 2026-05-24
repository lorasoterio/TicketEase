
using Microsoft.AspNetCore.Mvc;
using BackendTicketEase.Models;
using BackendTicketEase.Data;
using BackendTicketEase.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StrandController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Strand
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StrandDto>>> GetStrands()
        {
            var strands = await _context.Strands
                .Select(s => new StrandDto
                {
                    StrandId = s.StrandId,
                    StrandCode = s.StrandCode,
                    StrandName = s.StrandName,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                })
                .ToListAsync();
            return Ok(strands);
        }

        // GET: api/Strand/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StrandDto>> GetStrand(int id)
        {
            var strand = await _context.Strands.FindAsync(id);
            if (strand == null)
            {
                return NotFound();
            }
            var dto = new StrandDto
            {
                StrandId = strand.StrandId,
                StrandCode = strand.StrandCode,
                StrandName = strand.StrandName,
                CreatedAt = strand.CreatedAt,
                UpdatedAt = strand.UpdatedAt
            };
            return Ok(dto);
        }

        // POST: api/Strand
        [HttpPost]
        public async Task<ActionResult<StrandDto>> CreateStrand([FromBody] StrandDto strandDto)
        {
            var strand = new Strand
            {
                StrandCode = strandDto.StrandCode,
                StrandName = strandDto.StrandName
            };
            _context.Strands.Add(strand);
            await _context.SaveChangesAsync();

            strandDto.StrandId = strand.StrandId;
            strandDto.CreatedAt = strand.CreatedAt;
            strandDto.UpdatedAt = strand.UpdatedAt;

            return CreatedAtAction(nameof(GetStrand), new { id = strand.StrandId }, strandDto);
        }

        // PUT: api/Strand/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStrand(int id, [FromBody] StrandDto strandDto)
        {
            var strand = await _context.Strands.FindAsync(id);
            if (strand == null)
            {
                return NotFound();
            }
            strand.StrandCode = strandDto.StrandCode;
            strand.StrandName = strandDto.StrandName;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Strand/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStrand(int id)
        {
            var strand = await _context.Strands.FindAsync(id);
            if (strand == null)
            {
                return NotFound();
            }
            _context.Strands.Remove(strand);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
