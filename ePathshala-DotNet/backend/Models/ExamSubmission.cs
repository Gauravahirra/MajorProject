using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a student's submission for an exam, including timing and scoring information
    /// </summary>
    public class ExamSubmission
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// When the student started the exam
        /// </summary>
        [Required]
        public DateTime StartedAt { get; set; }

        /// <summary>
        /// When the student submitted the exam (or auto-submitted)
        /// </summary>
        public DateTime? SubmittedAt { get; set; }

        /// <summary>
        /// Whether this submission was auto-submitted due to time expiry
        /// </summary>
        public bool IsAutoSubmitted { get; set; } = false;

        /// <summary>
        /// Total score achieved by the student
        /// </summary>
        public int Score { get; set; } = 0;

        /// <summary>
        /// Maximum possible score for this exam
        /// </summary>
        public int MaxScore { get; set; }

        /// <summary>
        /// Percentage score (calculated field)
        /// </summary>
        public double Percentage => MaxScore > 0 ? (double)Score / MaxScore * 100 : 0;

        /// <summary>
        /// Whether the submission has been graded/evaluated
        /// </summary>
        public bool IsGraded { get; set; } = false;

        /// <summary>
        /// Time taken to complete the exam in minutes
        /// </summary>
        public int? TimeTakenMinutes { get; set; }

        /// <summary>
        /// Additional remarks from the teacher (optional)
        /// </summary>
        [MaxLength(500)]
        public string? Remarks { get; set; }

        /// <summary>
        /// Foreign key to the student who made this submission
        /// </summary>
        [Required]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        /// <summary>
        /// Foreign key to the exam this submission is for
        /// </summary>
        [Required]
        public int ExamId { get; set; }
        public Exam Exam { get; set; }

        /// <summary>
        /// Collection of individual answers for each question
        /// </summary>
        public ICollection<ExamAnswer> Answers { get; set; } = new List<ExamAnswer>();

        /// <summary>
        /// Calculated property to check if submission is complete
        /// </summary>
        public bool IsCompleted => SubmittedAt.HasValue;

        /// <summary>
        /// Calculated property to check if submission is within time limit
        /// </summary>
        public bool IsWithinTimeLimit
        {
            get
            {
                if (!SubmittedAt.HasValue) return false;
                var examEndTime = Exam.StartTime.AddMinutes(Exam.DurationMinutes);
                return SubmittedAt.Value <= examEndTime;
            }
        }
    }
}
