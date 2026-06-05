using BackendTicketEase.DTOs;
using BackendTicketEase.Models;
using BackendTicketEase.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendTicketEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffGradeAssignmentController : ControllerBase
    {
        private readonly ITicketAssignmentService _assignmentService;

        public StaffGradeAssignmentController(ITicketAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<StaffGradeAssignment>>> GetAll()
        {
            var assignments = await _assignmentService.GetAllAssignmentsAsync();
            return Ok(assignments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StaffGradeAssignment>> GetById(int id)
        {
            var assignment = await _assignmentService.GetAssignmentByIdAsync(id);
            if (assignment == null) return NotFound();
            return Ok(assignment);
        }

        [HttpPost]
        public async Task<ActionResult<StaffGradeAssignment>> Create([FromBody] StaffGradeAssignment assignment)
        {
            var created = await _assignmentService.CreateAssignmentAsync(assignment);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StaffGradeAssignment>> Update(int id, [FromBody] StaffGradeAssignment assignment)
        {
            if (id != assignment.Id) return BadRequest();
            var updated = await _assignmentService.UpdateAssignmentAsync(assignment);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _assignmentService.DeleteAssignmentAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignStaff([FromBody] StaffAssignmentRequest request)
        {
            if (!request.IsGraduate && request.GradeLevelId == null)
            {
                return BadRequest(new { message = "GradeLevelId is required for non-graduate assignments." });
            }

            var result = await _assignmentService.AssignStaffAsync(request);
            return Ok(result);
        }
    }
}
