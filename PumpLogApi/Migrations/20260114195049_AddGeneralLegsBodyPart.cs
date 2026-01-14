using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PumpLogApi.Migrations
{
    /// <inheritdoc />
    public partial class AddGeneralLegsBodyPart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "BodyParts",
                columns: new[] { "BodyPartGuid", "Name" },
                values: new object[] { new Guid("2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"), "Beine" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BodyParts",
                keyColumn: "BodyPartGuid",
                keyValue: new Guid("2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"));
        }
    }
}
