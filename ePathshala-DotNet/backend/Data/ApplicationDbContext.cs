using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    /// <summary>
    /// Entity Framework Core database context.  It defines DbSet
    /// properties for each entity and configures table-per-hierarchy
    /// inheritance for users.  The context is configured in
    /// Program.cs to use a MySQL provider.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<AcademicEvent> AcademicEvents { get; set; }

        public DbSet<AssignmentSubmission> AssignmentSubmissions { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        // Exam-related entities
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamQuestion> ExamQuestions { get; set; }
        public DbSet<ExamSubmission> ExamSubmissions { get; set; }
        public DbSet<ExamAnswer> ExamAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure inheritance using a discriminator column called "Role"
            modelBuilder.Entity<User>().HasDiscriminator<string>("Role")
                .HasValue<Student>("Student")
                .HasValue<Teacher>("Teacher")
                .HasValue<Parent>("Parent")
                .HasValue<Admin>("Admin");

            // One‑to‑many relationship between parent and students
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Parent)
                .WithMany(p => p.Students)
                .HasForeignKey(s => s.ParentId)
                .OnDelete(DeleteBehavior.SetNull);

            // One‑to‑many relationship between teacher and students
            // Each student belongs to one teacher.  When a teacher is
            // deleted, the TeacherId on the student is set to null so
            // that orphaned students can be reassigned by an admin.
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Teacher)
                .WithMany(t => t.Students)
                .HasForeignKey(s => s.TeacherId)
                .OnDelete(DeleteBehavior.SetNull);

            // One‑to‑many relationship between teacher and assignments
            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Teacher)
                .WithMany(t => t.Assignments)
                .HasForeignKey(a => a.TeacherId);

            // One‑to‑many relationship for attendance (teacher -> attendances)
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Teacher)
                .WithMany(t => t.Attendances)
                .HasForeignKey(a => a.TeacherId);

            // Assignment submissions relationships
            modelBuilder.Entity<AssignmentSubmission>()
                .HasOne(s => s.Assignment)
                .WithMany()
                .HasForeignKey(s => s.AssignmentId);
            modelBuilder.Entity<AssignmentSubmission>()
                .HasOne(s => s.Student)
                .WithMany()
                .HasForeignKey(s => s.StudentId);

            // Exam relationships
            // One-to-many relationship between teacher and exams
            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Teacher)
                .WithMany()
                .HasForeignKey(e => e.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship between exam and questions
            modelBuilder.Entity<ExamQuestion>()
                .HasOne(q => q.Exam)
                .WithMany(e => e.Questions)
                .HasForeignKey(q => q.ExamId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship between exam and submissions
            modelBuilder.Entity<ExamSubmission>()
                .HasOne(s => s.Exam)
                .WithMany(e => e.Submissions)
                .HasForeignKey(s => s.ExamId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship between student and exam submissions
            modelBuilder.Entity<ExamSubmission>()
                .HasOne(s => s.Student)
                .WithMany()
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship between submission and answers
            modelBuilder.Entity<ExamAnswer>()
                .HasOne(a => a.ExamSubmission)
                .WithMany(s => s.Answers)
                .HasForeignKey(a => a.ExamSubmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship between question and answers
            modelBuilder.Entity<ExamAnswer>()
                .HasOne(a => a.ExamQuestion)
                .WithMany(q => q.StudentAnswers)
                .HasForeignKey(a => a.ExamQuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // REMOVE unique constraint: one submission per student per exam
            // modelBuilder.Entity<ExamSubmission>()
            //     .HasIndex(s => new { s.StudentId, s.ExamId })
            //     .IsUnique();

            // Ensure unique constraint: one answer per question per submission
            modelBuilder.Entity<ExamAnswer>()
                .HasIndex(a => new { a.ExamSubmissionId, a.ExamQuestionId })
                .IsUnique();
        }
    }
}