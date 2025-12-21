using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PumpLogApi.Migrations
{
    /// <inheritdoc />
    public partial class addSections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StrengthSets");

            migrationBuilder.AddColumn<int>(
                name: "Reps",
                table: "Sections",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SetResults",
                table: "Sections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Sets",
                table: "Sections",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Weight",
                table: "Sections",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reps",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "SetResults",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "Sets",
                table: "Sections");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Sections");

            migrationBuilder.CreateTable(
                name: "StrengthSets",
                columns: table => new
                {
                    StrengthSetGuid = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SectionGuid = table.Column<Guid>(type: "uuid", nullable: false),
                    IsFinished = table.Column<bool>(type: "boolean", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    SetNumber = table.Column<int>(type: "integer", nullable: false),
                    Weight = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StrengthSets", x => x.StrengthSetGuid);
                    table.ForeignKey(
                        name: "FK_StrengthSets_Sections_SectionGuid",
                        column: x => x.SectionGuid,
                        principalTable: "Sections",
                        principalColumn: "SectionGuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StrengthSets_SectionGuid",
                table: "StrengthSets",
                column: "SectionGuid");
        }
    }
}
