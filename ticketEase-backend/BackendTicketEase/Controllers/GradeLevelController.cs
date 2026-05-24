using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Data;
using BackendTicketEase.Models;
using BackendTicketEase.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradeLevelController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GradeLevelController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/GradeLevel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GradeLevelDto>>> GetGradeLevels()
        {
            var gradeLevels = await _context.GradeLevels.ToListAsync();
            var dtos = gradeLevels.ConvertAll(g => new GradeLevelDto
            {
                GradeLevelId = g.GradeLevelId,
                GradeLevelName = g.GradeLevelName,
                LevelOrder = g.LevelOrder,
                CreatedAt = g.CreatedAt,
                UpdatedAt = g.UpdatedAt
            });
            return Ok(dtos);
        }

        // GET: api/GradeLevel/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GradeLevelDto>> GetGradeLevel(int id)
        {
            var gradeLevel = await _context.GradeLevels.FindAsync(id);
            if (gradeLevel == null)
            {
                return NotFound(new { message = $"GradeLevel with ID {id} not found." });
            }
            var dto = new GradeLevelDto
            {
                GradeLevelId = gradeLevel.GradeLevelId,
                GradeLevelName = gradeLevel.GradeLevelName,
                LevelOrder = gradeLevel.LevelOrder,
                CreatedAt = gradeLevel.CreatedAt,
                UpdatedAt = gradeLevel.UpdatedAt
            };
            return Ok(dto);
        }

        // POST: api/GradeLevel
        [HttpPost]
        public async Task<ActionResult<GradeLevelDto>> CreateGradeLevel([FromBody] GradeLevelDto dto)
        {
            // Ignore any GradeLevelId sent by the client
            dto.GradeLevelId = 0;
            if (string.IsNullOrWhiteSpace(dto.GradeLevelName))
            {
                return BadRequest(new { message = "GradeLevelName is required." });
            }
            var exists = await _context.GradeLevels.AnyAsync(g => g.GradeLevelName == dto.GradeLevelName);
            if (exists)
            {
                return BadRequest(new { message = "GradeLevelName must be unique." });
            }
            var gradeLevel = new GradeLevels
            {
                GradeLevelName = dto.GradeLevelName,
                LevelOrder = dto.LevelOrder,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.GradeLevels.Add(gradeLevel);
            await _context.SaveChangesAsync();
            dto.GradeLevelId = gradeLevel.GradeLevelId;
            dto.CreatedAt = gradeLevel.CreatedAt;
            dto.UpdatedAt = gradeLevel.UpdatedAt;
            return CreatedAtAction(nameof(GetGradeLevel), new { id = gradeLevel.GradeLevelId }, dto);
        }

        // PUT: api/GradeLevel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGradeLevel(int id, [FromBody] GradeLevelDto dto)
        {
            var gradeLevel = await _context.GradeLevels.FindAsync(id);
            if (gradeLevel == null)
            {
                return NotFound(new { message = $"GradeLevel with ID {id} not found." });
            }
            if (string.IsNullOrWhiteSpace(dto.GradeLevelName))
            {
                return BadRequest(new { message = "GradeLevelName is required." });
            }
            var exists = await _context.GradeLevels.AnyAsync(g => g.GradeLevelName == dto.GradeLevelName && g.GradeLevelId != id);
            if (exists)
            {
                return BadRequest(new { message = "GradeLevelName must be unique." });
            }
            gradeLevel.GradeLevelName = dto.GradeLevelName;
            gradeLevel.LevelOrder = dto.LevelOrder;
            gradeLevel.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/GradeLevel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGradeLevel(int id)
        {
            var gradeLevel = await _context.GradeLevels.FindAsync(id);
            if (gradeLevel == null)
            {
                return NotFound(new { message = $"GradeLevel with ID {id} not found." });
            }
            _context.GradeLevels.Remove(gradeLevel);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
