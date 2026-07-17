using System;
using System.ComponentModel.DataAnnotations.Schema;  
using System.Collections.Generic;

namespace ShopAPI.Entities
{
    [Table("product")] 
    public class Product
    {
        [Column("product_id")] 
        public int ProductId { get; set; }

        [Column("product_name")]
        public string ProductName { get; set; }= string.Empty;

        [Column("price")]
        public decimal Price { get; set; }

        [Column("stock")]
        public int Stock { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("category")]
        public string? Category {get; set;}

        [Column("discountPrice")]
        public decimal? DiscountPrice { get; set; }

        [Column("discountExpiresAt")]
        public DateTime? DiscountExpiresAt { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Comment> Comments {get; set;} = new List <Comment>();
    }
}