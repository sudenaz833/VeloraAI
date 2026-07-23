using System;
using System.ComponentModel.DataAnnotations.Schema;  

namespace ShopAPI.Entities
{
    [Table("order")] 
    public class Order
    {
        [Column("order_id")] 
        public int OrderId { get; set; }

        [Column("customer_id")]
        public int CustomerId { get; set;}

        [ForeignKey("CustomerId")]
        public  Customer Customer { get; set;} = null!;
         
        [Column("products_summary")]
        public string ProductsSummary { get; set;} = string.Empty;


        [Column("total_price")]
        public decimal TotalPrice { get; set; }

        [Column("order_status")]
        public string OrderStatus { get; set; } = "Pending";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }
}