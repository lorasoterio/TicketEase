using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

     
        public DbSet<Ticket> Tickets { get; set; }

    }
}