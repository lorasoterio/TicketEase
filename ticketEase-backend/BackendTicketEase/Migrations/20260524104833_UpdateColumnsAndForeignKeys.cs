using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendTicketEase.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnsAndForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GradeLevel",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Strand",
                table: "Students");

            migrationBuilder.AddColumn<int>(
                name: "DocumentTypeId",
                table: "Tickets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GradeLevelId",
                table: "Students",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StrandId",
                table: "Students",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_DocumentTypeId",
                table: "Tickets",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_GradeLevelId",
                table: "Students",
                column: "GradeLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_StrandId",
                table: "Students",
                column: "StrandId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_GradeLevels_GradeLevelId",
                table: "Students",
                column: "GradeLevelId",
                principalTable: "GradeLevels",
                principalColumn: "GradeLevelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Strands_StrandId",
                table: "Students",
                column: "StrandId",
                principalTable: "Strands",
                principalColumn: "StrandId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_DocumentTypes_DocumentTypeId",
                table: "Tickets",
                column: "DocumentTypeId",
                principalTable: "DocumentTypes",
                principalColumn: "DocumentTypeId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_GradeLevels_GradeLevelId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Strands_StrandId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_DocumentTypes_DocumentTypeId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_DocumentTypeId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Students_GradeLevelId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_StrandId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "DocumentTypeId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "GradeLevelId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "StrandId",
                table: "Students");

            migrationBuilder.AddColumn<string>(
                name: "GradeLevel",
                table: "Students",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Strand",
                table: "Students",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
