using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendTicketEase.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedStaffsStudentsTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedCompletion",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ContactNumber",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "ContactNumber",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Department",
                table: "Staff");

            migrationBuilder.RenameColumn(
                name: "YearLevel",
                table: "Students",
                newName: "GradeLevel");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Students",
                newName: "Strand");

            migrationBuilder.RenameColumn(
                name: "CourseProgram",
                table: "Students",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Students",
                newName: "Suffix");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Staff",
                newName: "FirstName");

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Tickets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsGraduate",
                table: "Students",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Students",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MiddleName",
                table: "Students",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Staff",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MiddleName",
                table: "Staff",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Suffix",
                table: "Staff",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "IsGraduate",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "MiddleName",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "MiddleName",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Suffix",
                table: "Staff");

            migrationBuilder.RenameColumn(
                name: "Suffix",
                table: "Students",
                newName: "Address");

            migrationBuilder.RenameColumn(
                name: "Strand",
                table: "Students",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "GradeLevel",
                table: "Students",
                newName: "YearLevel");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Students",
                newName: "CourseProgram");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Staff",
                newName: "FullName");

            migrationBuilder.AddColumn<DateTime>(
                name: "EstimatedCompletion",
                table: "Tickets",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactNumber",
                table: "Students",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactNumber",
                table: "Staff",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Staff",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
