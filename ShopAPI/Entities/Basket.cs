using System;
using System.ComponentModel.DataAnnotations.Schema;  

namespace ShopAPI.Entities
{
    [Table("basket")] 
    public class Basket
    {
        [Column("basket_id")] 
        public int BasketId { get; set; }

        [Column("customer_id")]
        public int CustomerId { get; set;}

        [ForeignKey("CustomerId")]
        public  virtual Customer? Customer { get; set;}

         [Column("product_id")]
        public int ProductId { get; set;}

        [ForeignKey("ProductId")]
        public  virtual Product? Product { get; set;}

        [Column("quantity")]
        public int  Quantity { get; set; } = 1;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }
}