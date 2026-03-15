using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Each DbSet<T> = one table in your database
        // You'll add your tables here later, e.g.:
        // public DbSet<Ticket> Tickets { get; set; }
        // public DbSet<User> Users { get; set; }
    }
}