using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendTicketEase.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppDbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Staff_AssignedStaffId",
                table: "Tickets");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_AssignedStaffId",
                table: "Tickets",
                column: "AssignedStaffId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_AssignedStaffId",
                table: "Tickets");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Staff_AssignedStaffId",
                table: "Tickets",
                column: "AssignedStaffId",
                principalTable: "Staff",
                principalColumn: "StaffId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
