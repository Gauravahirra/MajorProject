using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a multiple-choice question within an exam
    /// </summary>
    public class ExamQuestion
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// The question text
        /// </summary>
        [Required]
        [MaxLength(1000)]
        public string QuestionText { get; set; }

        /// <summary>
        /// Option A text
        /// </summary>
        [Required]
        [MaxLength(500)]
        public string OptionA { get; set; }

        /// <summary>
        /// Option B text
        /// </summary>
        [Required]
        [MaxLength(500)]
        public string OptionB { get; set; }

        /// <summary>
        /// Option C text
        /// </summary>
        [Required]
        [MaxLength(500)]
        public string OptionC { get; set; }

        /// <summary>
        /// Option D text
        /// </summary>
        [Required]
        [MaxLength(500)]
        public string OptionD { get; set; }

        /// <summary>
        /// The correct answer (A, B, C, or D)
        /// </summary>
        [Required]
        [RegularExpression("^[ABCD]$", ErrorMessage = "Correct answer must be A, B, C, or D")]
        public string CorrectAnswer { get; set; }

        /// <summary>
        /// Marks awarded for this question
        /// </summary>
        [Required]
        [Range(1, 10)]
        public int Marks { get; set; } = 1;

        /// <summary>
        /// Order/sequence of this question in the exam
        /// </summary>
        public int QuestionOrder { get; set; }

        /// <summary>
        /// Optional explanation for the correct answer
        /// </summary>
        [MaxLength(1000)]
        public string? Explanation { get; set; }

        /// <summary>
        /// Foreign key to the exam this question belongs to
        /// </summary>
        [Required]
        public int ExamId { get; set; }
        public Exam Exam { get; set; }

        /// <summary>
        /// Collection of student answers for this question
        /// </summary>
        public ICollection<ExamAnswer> StudentAnswers { get; set; } = new List<ExamAnswer>();
    }
}
