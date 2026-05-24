
using Microsoft.AspNetCore.Mvc;
using BackendTicketEase.Data;
using BackendTicketEase.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentTypeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DocumentTypeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/DocumentType
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var documentTypes = await _context.DocumentTypes.ToListAsync();
            return Ok(documentTypes);
        }

        // GET: api/DocumentType/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var documentType = await _context.DocumentTypes.FindAsync(id);
            if (documentType == null)
                return NotFound();
            return Ok(documentType);
        }

        // POST: api/DocumentType
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DocumentType documentType)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.DocumentTypes.Add(documentType);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = documentType.DocumentTypeId }, documentType);
        }

        // PUT: api/DocumentType/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DocumentType documentType)
        {
            if (id != documentType.DocumentTypeId)
                return BadRequest();

            _context.Entry(documentType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DocumentTypes.Any(e => e.DocumentTypeId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/DocumentType/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var documentType = await _context.DocumentTypes.FindAsync(id);
            if (documentType == null)
                return NotFound();

            _context.DocumentTypes.Remove(documentType);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
