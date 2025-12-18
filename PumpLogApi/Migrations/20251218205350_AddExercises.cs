using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PumpLogApi.Migrations
{
    /// <inheritdoc />
    public partial class AddExercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BodyParts",
                columns: table => new
                {
                    BodyPartGuid = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BodyParts", x => x.BodyPartGuid);
                });

            migrationBuilder.CreateTable(
                name: "Exercises",
                columns: table => new
                {
                    ExerciseGuid = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    BodyPartGuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.ExerciseGuid);
                    table.ForeignKey(
                        name: "FK_Exercises_BodyParts_BodyPartGuid",
                        column: x => x.BodyPartGuid,
                        principalTable: "BodyParts",
                        principalColumn: "BodyPartGuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "BodyParts",
                columns: new[] { "BodyPartGuid", "Name" },
                values: new object[,]
                {
                    { new Guid("1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f"), "Bizeps" },
                    { new Guid("1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b"), "Gesäß" },
                    { new Guid("3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d"), "Nacken" },
                    { new Guid("3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b"), "Beine (Quadrizeps)" },
                    { new Guid("3f8e1a2b-4c5d-6e7f-8a9b-0c1d2e3f4a5b"), "Brust" },
                    { new Guid("5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d"), "Waden" },
                    { new Guid("5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b"), "Schultern" },
                    { new Guid("7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d"), "Trizeps" },
                    { new Guid("7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f"), "Bauch" },
                    { new Guid("9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d"), "Rücken" },
                    { new Guid("9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f"), "Beine (Beuger)" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_BodyPartGuid",
                table: "Exercises",
                column: "BodyPartGuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Exercises");

            migrationBuilder.DropTable(
                name: "BodyParts");
        }
    }
}
