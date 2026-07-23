using Microsoft.EntityFrameworkCore;
using ShopAPI.Entities;

namespace ShopAPI.Data
{
    public class ShopDbContext : DbContext
    {
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // İlişkileri netleştirelim
            modelBuilder.Entity<Basket>()
                .HasOne(b => b.Customer)
                .WithMany(c => c.Baskets)
                .HasForeignKey(b => b.CustomerId);

            modelBuilder.Entity<Basket>()
                .HasOne(b => b.Product)
                .WithMany()
                .HasForeignKey(b => b.ProductId);
        }
    }
}