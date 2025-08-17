using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AllowMultipleExamAttempts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExamSubmissions_StudentId_ExamId",
                table: "ExamSubmissions");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSubmissions_StudentId",
                table: "ExamSubmissions",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExamSubmissions_StudentId",
                table: "ExamSubmissions");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSubmissions_StudentId_ExamId",
                table: "ExamSubmissions",
                columns: new[] { "StudentId", "ExamId" },
                unique: true);
        }
    }
}
