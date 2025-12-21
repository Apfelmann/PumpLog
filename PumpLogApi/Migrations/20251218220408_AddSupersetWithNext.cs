using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PumpLogApi.Migrations
{
    /// <inheritdoc />
    public partial class AddSupersetWithNext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SupersetWithNext",
                table: "Sections",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SupersetWithNext",
                table: "Sections");
        }
    }
}
