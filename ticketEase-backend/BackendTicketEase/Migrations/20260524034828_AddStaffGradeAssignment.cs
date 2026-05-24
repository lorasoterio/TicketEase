using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackendTicketEase.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffGradeAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StaffGradeAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StaffId = table.Column<int>(type: "integer", nullable: false),
                    GradeLevelId = table.Column<int>(type: "integer", nullable: true),
                    StrandId = table.Column<int>(type: "integer", nullable: true),
                    IsGraduate = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Priority = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffGradeAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaffGradeAssignments_GradeLevels_GradeLevelId",
                        column: x => x.GradeLevelId,
                        principalTable: "GradeLevels",
                        principalColumn: "GradeLevelId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_StaffGradeAssignments_Staff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staff",
                        principalColumn: "StaffId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StaffGradeAssignments_Strands_StrandId",
                        column: x => x.StrandId,
                        principalTable: "Strands",
                        principalColumn: "StrandId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffGradeAssignments_GradeLevelId",
                table: "StaffGradeAssignments",
                column: "GradeLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffGradeAssignments_StaffId",
                table: "StaffGradeAssignments",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffGradeAssignments_StrandId",
                table: "StaffGradeAssignments",
                column: "StrandId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffGradeAssignments");
        }
    }
}
