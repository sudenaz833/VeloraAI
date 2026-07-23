using System;
using System.ComponentModel.DataAnnotations.Schema; 
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShopAPI.Entities
{
    [Table("customer")] // Sınıfın SQL'deki "customer" tablosu olduğunu belirtiyoruz
    public class Customer// ticari detaylarıda tutar
    {
        [Key]
[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("customer_id")] //sql tarafındaki ismi
        public int CustomerId { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }=string.Empty;

        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("phone")]
        public string ?Phone { get; set; } 

        [Column("address")]
        public string? Address { get; set; } 
        public string PasswordHash { get; set; } = string.Empty;
       
        public string Role {get; set;} = "User";
        

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [System.Text.Json.Serialization.JsonIgnore]


        public ICollection<Basket> Baskets { get; set; } = new List<Basket>();
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Comment> Comments {get; set;} = new List<Comment>();
    }
}