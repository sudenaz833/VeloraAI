using System;
using System.ComponentModel.DataAnnotations.Schema; 
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Entities{
    [Table("comment")]
    public class Comment{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("comment_id")]
        public int CommentId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set;}

        [Column("customerId")]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set;}
        [Column("text")]
        public string Text { get; set; } = string.Empty;
        [Column("rating")]
        public string Rating {get; set;} =string.Empty;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
    }
}