using Microsoft.EntityFrameworkCore;
using BackendTicketEase.Models;
using System;

namespace BackendTicketEase.Data
{
    public class AppDbContext : DbContext, IDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<TicketAssignment> TicketAssignments { get; set; }
        public DbSet<StatusHistory> StatusHistories { get; set; }
        public DbSet<TicketMessage> TicketMessages { get; set; }
      

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();
            });

            // Student Configuration
            modelBuilder.Entity<Student>(entity =>
            {
                entity.ToTable("Students");
                entity.HasKey(e => e.StudentId);
                entity.HasOne(e => e.User)
                      .WithOne(u => u.Student)
                      .HasForeignKey<Student>(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();
            });

            // Staff Configuration
            modelBuilder.Entity<Staff>(entity =>
            {
                entity.ToTable("Staff");
                entity.HasKey(e => e.StaffId);
                entity.HasOne(e => e.User)
                      .WithOne(u => u.Staff)
                      .HasForeignKey<Staff>(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").ValueGeneratedOnAddOrUpdate();
            });

            // Ticket Configuration
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
                             v == TicketStatus.Rejected ? "Rejected" :
                             v == TicketStatus.Closed ? "Closed" :
                             v.ToString().Replace("InProgress", "In Progress").Replace("ReadyForPickup", "Ready for Pickup"),
                        s => s == "In Progress" ? TicketStatus.InProgress :
                             s == "Ready for Pickup" ? TicketStatus.ReadyForPickup :
                             s == "Responded" ? TicketStatus.Responded :
                             s == "Assigned" ? TicketStatus.Assigned :
                             s == "Rejected" ? TicketStatus.Rejected :
                             s == "Closed" ? TicketStatus.Closed :
                             TicketStatus.Pending
                    )
                    .HasMaxLength(50)
                    .HasDefaultValue(TicketStatus.Pending)
                    .IsRequired();

                // Timestamps defaults
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAddOrUpdate();

                // Relationships to Users table
                entity.HasOne(t => t.StudentUser)
                      .WithMany()
                      .HasForeignKey(t => t.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.AssignedStaff)
                      .WithMany()
                      .HasForeignKey(t => t.AssignedStaffId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Subject).HasMaxLength(255);
            });

            // AuditLog Configuration
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("AuditLogs");
                entity.HasKey(e => e.LogId);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Notification Configuration
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("Notifications");
                entity.HasKey(e => e.NotificationId);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // TicketAssignment Configuration
            modelBuilder.Entity<TicketAssignment>(entity =>
            {
                entity.ToTable("TicketAssignment");
                entity.HasKey(e => e.AssignmentId);

                entity.HasOne(e => e.Ticket)
                      .WithMany()
                      .HasForeignKey(e => e.TicketId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.AssignedByUser)
                      .WithMany()
                      .HasForeignKey(e => e.AssignedBy)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.AssignedToUser)
                      .WithMany()
                      .HasForeignKey(e => e.AssignedTo)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.AssignedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // StatusHistory Configuration
            modelBuilder.Entity<StatusHistory>(entity =>
            {
                entity.ToTable("StatusHistory");
                entity.HasKey(e => e.StatusHistoryId);

                entity.HasOne(e => e.Ticket)
                      .WithMany()
                      .HasForeignKey(e => e.TicketId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.ChangedByUser)
                      .WithMany()
                      .HasForeignKey(e => e.ChangedBy)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.ChangedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // TicketMessage Configuration
            modelBuilder.Entity<TicketMessage>(entity =>
            {
                entity.ToTable("TicketMessages");
                entity.HasKey(e => e.MessageId);

                entity.HasOne(e => e.Ticket)
                      .WithMany()
                      .HasForeignKey(e => e.TicketId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Sender)
                      .WithMany()
                      .HasForeignKey(e => e.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            
            
        }
    }
}