using System;
using BackendTicketEase.Models;
using BackendTicketEase.Data;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Tests
{
    public class GradeLevelsUpdateTest
    {
        public static void RunTest(AppDbContext context)
        {
            // Create a new GradeLevel
            var grade = new GradeLevels { GradeLevelName = "Test Grade", LevelOrder = 1 };
            context.Add(grade);
            context.SaveChanges();
            var createdAt = grade.CreatedAt;
            var updatedAt = grade.UpdatedAt;

            // Wait and update
            System.Threading.Thread.Sleep(1500);
            grade.GradeLevelName = "Updated Grade";
            context.SaveChanges();

            Console.WriteLine($"CreatedAt: {grade.CreatedAt:O}");
            Console.WriteLine($"UpdatedAt: {grade.UpdatedAt:O}");
            Console.WriteLine($"UpdatedAt changed: {grade.UpdatedAt > updatedAt}");
        }
    }
}