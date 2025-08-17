using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents an MCQ exam created by a teacher with time constraints
    /// and automatic scoring capabilities.
    /// </summary>
    public class Exam
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        /// <summary>
        /// The subject for which the exam is created (e.g., "Mathematics", "Physics")
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string Subject { get; set; }

        /// <summary>
        /// The class/grade for which this exam is intended (e.g., "10A", "12B")
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Class { get; set; }

        /// <summary>
        /// When the exam becomes available to students
        /// </summary>
        [Required]
        public DateTime StartTime { get; set; }

        /// <summary>
        /// Duration of the exam in minutes
        /// </summary>
        [Required]
        [Range(1, 300)] // 1 minute to 5 hours maximum
        public int DurationMinutes { get; set; }

        /// <summary>
        /// Maximum marks for the exam (calculated from questions)
        /// </summary>
        public int TotalMarks { get; set; }

        /// <summary>
        /// Whether the exam is currently active and accepting submissions
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// When the exam was created
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Foreign key to the teacher who created this exam
        /// </summary>
        [Required]
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }

        /// <summary>
        /// Collection of questions for this exam
        /// </summary>
        public ICollection<ExamQuestion> Questions { get; set; } = new List<ExamQuestion>();

        /// <summary>
        /// Collection of student submissions for this exam
        /// </summary>
        public ICollection<ExamSubmission> Submissions { get; set; } = new List<ExamSubmission>();

        /// <summary>
        /// Returns the current IST time
        /// </summary>
        private static DateTime NowIST
        {
            get
            {
                var istZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, istZone);
            }
        }

        /// <summary>
        /// Calculated property to determine if the exam is currently live (IST)
        /// </summary>
        public bool IsLive => IsActive && NowIST >= StartTime && NowIST <= StartTime.AddMinutes(DurationMinutes);

        /// <summary>
        /// Calculated property to determine if the exam has ended (IST)
        /// </summary>
        public bool HasEnded => NowIST > StartTime.AddMinutes(DurationMinutes);

        /// <summary>
        /// Calculated end time of the exam
        /// </summary>
        public DateTime EndTime => StartTime.AddMinutes(DurationMinutes);

        /// <summary>
        /// Start time in IST (for display)
        /// </summary>
        public string StartTimeIST => StartTime.ToString("yyyy-MM-dd HH:mm:ss");
    }
}
