using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PumpLogApi.Migrations
{
    /// <inheritdoc />
    public partial class initialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    SessionGuid = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SessionNumber = table.Column<int>(type: "integer", nullable: true),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: true),
                    UserGuid = table.Column<Guid>(type: "uuid", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.SessionGuid);
                });

            migrationBuilder.CreateTable(
                name: "Sections",
                columns: table => new
                {
                    SectionGuid = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SessionGuid = table.Column<Guid>(type: "uuid", nullable: false),
                    order = table.Column<int>(type: "integer", nullable: false),
                    SectionType = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    WodName = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ExerciseName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sections", x => x.SectionGuid);
                    table.ForeignKey(
                        name: "FK_Sections_Sessions_SessionGuid",
                        column: x => x.SessionGuid,
                        principalTable: "Sessions",
                        principalColumn: "SessionGuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StrengthSets",
                columns: table => new
                {
                    StrengthSetGuid = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SectionGuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Weight = table.Column<decimal>(type: "numeric", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    SetNumber = table.Column<int>(type: "integer", nullable: false),
                    IsFinished = table.Column<bool>(type: "boolean", nullable: false)
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
                name: "IX_Sections_SessionGuid",
                table: "Sections",
                column: "SessionGuid");

            migrationBuilder.CreateIndex(
                name: "IX_StrengthSets_SectionGuid",
                table: "StrengthSets",
                column: "SectionGuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StrengthSets");

            migrationBuilder.DropTable(
                name: "Sections");

            migrationBuilder.DropTable(
                name: "Sessions");
        }
    }
}
