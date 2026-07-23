using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddAiFieldsToProductNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "activeIngredients",
                table: "product",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "concerns",
                table: "product",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "skinTypes",
                table: "product",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usageTime",
                table: "product",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "activeIngredients",
                table: "product");

            migrationBuilder.DropColumn(
                name: "concerns",
                table: "product");

            migrationBuilder.DropColumn(
                name: "skinTypes",
                table: "product");

            migrationBuilder.DropColumn(
                name: "usageTime",
                table: "product");
        }
    }
}
