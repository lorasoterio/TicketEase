using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Models;
using System;

namespace BackendTicketEase.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.ToTable("Tickets");

                // TicketType -> string values matching schema
                entity.Property(e => e.TicketType)
                    .HasConversion(
                        v => v == TicketType.DocumentRequest ? "Document Request" : "Inquiry",
                        s => s == "Document Request" ? TicketType.DocumentRequest : TicketType.Inquiry
                    )
                    .HasMaxLength(50)
                    .IsRequired();

                // Priority -> string mapping, default 'Normal'
                entity.Property(e => e.Priority)
                    .HasConversion(
                        v => v == TicketPriority.Low ? "Low" :
                             v == TicketPriority.High ? "High" : "Normal",
                        s => s == "Low" ? TicketPriority.Low :
                             s == "High" ? TicketPriority.High : TicketPriority.Normal
                    )
                    .HasMaxLength(20)
                    .HasDefaultValue(TicketPriority.Normal)
                    .IsRequired();

                // Status -> string mapping, default 'Pending'
                entity.Property(e => e.Status)
                    .HasConversion(
                        v => v == TicketStatus.InProgress ? "In Progress" :
                             v == TicketStatus.ReadyForPickup ? "Ready for Pickup" :
                             v == TicketStatus.Responded ? "Responded" :
                             v == TicketStatus.Pending ? "Pending" :
                             v == TicketStatus.Assigned ? "Assigned" :
                             v == TicketStatus.Completed ? "Completed" :
                             v == TicketStatus.Rejected ? "Rejected" :
                             v == TicketStatus.Open ? "Open" :
                             v == TicketStatus.Closed ? "Closed" :
                             v.ToString().Replace("InProgress", "In Progress").Replace("ReadyForPickup", "Ready for Pickup"),
                        s => s == "In Progress" ? TicketStatus.InProgress :
                             s == "Ready for Pickup" ? TicketStatus.ReadyForPickup :
                             s == "Responded" ? TicketStatus.Responded :
                             s == "Assigned" ? TicketStatus.Assigned :
                             s == "Completed" ? TicketStatus.Completed :
                             s == "Rejected" ? TicketStatus.Rejected :
                             s == "Open" ? TicketStatus.Open :
                             s == "Closed" ? TicketStatus.Closed :
                             TicketStatus.Pending
                    )
                    .HasMaxLength(50)
                    .HasDefaultValue(TicketStatus.Pending)
                    .IsRequired();

                // Timestamps defaults — provider-specific SQL may be needed (CURRENT_TIMESTAMP works for many providers)
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAddOrUpdate();

                // Relationships to Users table (foreign keys reference Users.user_id)
                entity.HasOne(t => t.StudentUser)
                      .WithMany() // adjust to WithMany(u => u.CreatedTickets) if you add a collection on User
                      .HasForeignKey(t => t.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.AssignedStaff)
                      .WithMany() // adjust to WithMany(u => u.AssignedTickets) if you add a collection on User
                      .HasForeignKey(t => t.AssignedStaffId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Optional: column lengths
                entity.Property(e => e.Subject).HasMaxLength(255);
            });
        }
    }
}