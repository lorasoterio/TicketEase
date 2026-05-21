using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendTicketEase.Migrations
{
    /// <inheritdoc />
    public partial class RenamedStatusHistoryToTicketStatusHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusHistory_Tickets_TicketId",
                table: "StatusHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_StatusHistory_Users_ChangedBy",
                table: "StatusHistory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StatusHistory",
                table: "StatusHistory");

            migrationBuilder.RenameTable(
                name: "StatusHistory",
                newName: "TicketStatusHistory");

            migrationBuilder.RenameIndex(
                name: "IX_StatusHistory_TicketId",
                table: "TicketStatusHistory",
                newName: "IX_TicketStatusHistory_TicketId");

            migrationBuilder.RenameIndex(
                name: "IX_StatusHistory_ChangedBy",
                table: "TicketStatusHistory",
                newName: "IX_TicketStatusHistory_ChangedBy");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TicketStatusHistory",
                table: "TicketStatusHistory",
                column: "StatusHistoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketStatusHistory_Tickets_TicketId",
                table: "TicketStatusHistory",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "TicketId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketStatusHistory_Users_ChangedBy",
                table: "TicketStatusHistory",
                column: "ChangedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketStatusHistory_Tickets_TicketId",
                table: "TicketStatusHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketStatusHistory_Users_ChangedBy",
                table: "TicketStatusHistory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TicketStatusHistory",
                table: "TicketStatusHistory");

            migrationBuilder.RenameTable(
                name: "TicketStatusHistory",
                newName: "StatusHistory");

            migrationBuilder.RenameIndex(
                name: "IX_TicketStatusHistory_TicketId",
                table: "StatusHistory",
                newName: "IX_StatusHistory_TicketId");

            migrationBuilder.RenameIndex(
                name: "IX_TicketStatusHistory_ChangedBy",
                table: "StatusHistory",
                newName: "IX_StatusHistory_ChangedBy");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatusHistory",
                table: "StatusHistory",
                column: "StatusHistoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusHistory_Tickets_TicketId",
                table: "StatusHistory",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "TicketId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StatusHistory_Users_ChangedBy",
                table: "StatusHistory",
                column: "ChangedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
