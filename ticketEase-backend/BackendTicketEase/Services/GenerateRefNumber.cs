using BackendTicketEase.Data;
using Microsoft.EntityFrameworkCore;

namespace BackendTicketEase.Services
{
    public class GenerateRefNumber
    {
        private readonly IDbContext _context;
        private static readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);

        public GenerateRefNumber(IDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateTicketReferenceAsync(string prefix = "TKT")
        {
            await _lock.WaitAsync();
            try
            {
                var yearMonth = DateTime.UtcNow.ToString("yyyyMM");

                // Count only tickets created this month for a clean monthly reset
                var countThisMonth = await _context.Tickets
                    .CountAsync(x => x.ReferenceNumber.StartsWith($"{prefix}-{yearMonth}"));

                int nextNumber = countThisMonth + 1;
                return $"{prefix}-{yearMonth}-{nextNumber:D6}";
                // Output: TKT-202604-000001
            }
            finally
            {
                _lock.Release();
            }
        }
    }
}
