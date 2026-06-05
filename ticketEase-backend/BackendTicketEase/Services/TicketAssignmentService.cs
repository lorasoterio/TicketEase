using BackendTicketEase.Data;
using BackendTicketEase.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendTicketEase.DTOs;

namespace BackendTicketEase.Services
{
    public class TicketAssignmentService : ITicketAssignmentService
    {
        private readonly AppDbContext _context;
        public TicketAssignmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<StaffGradeAssignment> AssignTicketToStaffAsync(StaffAssignmentRequest request)
        {
            var assignment = new StaffGradeAssignment
            {
                StaffId = request.StaffId,
                GradeLevelId = request.GradeLevelId,
                IsGraduate = request.IsGraduate
            };

            return await UpsertAssignmentAsync(assignment);
        }

        public async Task<StaffGradeAssignment> AssignStaffAsync(StaffAssignmentRequest request)
        {
            var assignment = new StaffGradeAssignment
            {
                StaffId = request.StaffId,
                GradeLevelId = request.GradeLevelId,
                IsGraduate = request.IsGraduate
            };

            return await UpsertAssignmentAsync(assignment);
        }

        public async Task<List<StaffGradeAssignment>> GetAssignmentsForTicketAsync(int ticketId)
        {
            // TODO: Implement logic to get assignments for a ticket
            return new List<StaffGradeAssignment>();
        }

        public async Task<StaffGradeAssignment?> GetAssignmentByIdAsync(int assignmentId)
        {
            return await _context.StaffGradeAssignments
                .Include(sga => sga.Staff)
                .Include(sga => sga.GradeLevels)
                .Include(sga => sga.Strand)
                .FirstOrDefaultAsync(sga => sga.Id == assignmentId);
        }

        public async Task<List<StaffGradeAssignment>> GetAllAssignmentsAsync()
        {
            return await _context.StaffGradeAssignments
                .Include(sga => sga.Staff)
                .Include(sga => sga.GradeLevels)
                .Include(sga => sga.Strand)
                .ToListAsync();
        }

        public async Task<StaffGradeAssignment> CreateAssignmentAsync(StaffGradeAssignment assignment)
        {
            return await UpsertAssignmentAsync(assignment);
        }

        public async Task<StaffGradeAssignment> UpdateAssignmentAsync(StaffGradeAssignment assignment)
        {
            _context.StaffGradeAssignments.Update(assignment);
            assignment.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<bool> DeleteAssignmentAsync(int assignmentId)
        {
            var assignment = await _context.StaffGradeAssignments.FindAsync(assignmentId);
            if (assignment == null) return false;
            _context.StaffGradeAssignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<StaffGradeAssignment> UpsertAssignmentAsync(StaffGradeAssignment assignment)
        {
            if (!assignment.IsGraduate && assignment.GradeLevelId == null)
            {
                throw new ArgumentException("GradeLevelId is required for non-graduate assignments.");
            }

            var existingAssignment = await _context.StaffGradeAssignments.FirstOrDefaultAsync(
                a => a.IsGraduate == assignment.IsGraduate && a.GradeLevelId == assignment.GradeLevelId);

            using var transaction = await _context.Database.BeginTransactionAsync();

            if (existingAssignment != null)
            {
                _context.StaffGradeAssignments.Remove(existingAssignment);
                await _context.SaveChangesAsync();

                if (assignment.StrandId == null)
                {
                    assignment.StrandId = existingAssignment.StrandId;
                }

                if (assignment.Priority == 0)
                {
                    assignment.Priority = existingAssignment.Priority;
                }
            }

            assignment.Id = 0;
            assignment.CreatedAt = DateTime.UtcNow;
            assignment.UpdatedAt = DateTime.UtcNow;

            _context.StaffGradeAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return assignment;
        }
    }
}
