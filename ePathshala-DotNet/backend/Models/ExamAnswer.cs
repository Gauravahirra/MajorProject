using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a student's answer to a specific question in an exam submission
    /// </summary>
    public class ExamAnswer
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// The student's selected answer (A, B, C, or D)
        /// </summary>
        [Required]
        [RegularExpression("^[ABCD]$", ErrorMessage = "Selected answer must be A, B, C, or D")]
        public string SelectedAnswer { get; set; }

        /// <summary>
        /// Whether this answer is correct
        /// </summary>
        public bool IsCorrect { get; set; }

        /// <summary>
        /// Marks awarded for this answer
        /// </summary>
        public int MarksAwarded { get; set; } = 0;

        /// <summary>
        /// When this answer was recorded/last updated
        /// </summary>
        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Foreign key to the exam submission this answer belongs to
        /// </summary>
        [Required]
        public int ExamSubmissionId { get; set; }
        public ExamSubmission ExamSubmission { get; set; }

        /// <summary>
        /// Foreign key to the question this answer is for
        /// </summary>
        [Required]
        public int ExamQuestionId { get; set; }
        public ExamQuestion ExamQuestion { get; set; }
    }
}
