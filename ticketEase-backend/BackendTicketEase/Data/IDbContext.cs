using BackendTicketEase.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Data
{
    public interface IDbContext
    {
        DbSet<Ticket> Tickets { get; set; }
        // Add other DbSets here as needed, e.g.:
        // DbSet<User> Users { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        int SaveChanges();
    }
}
