using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for creating a new exam
    /// </summary>
    public class CreateExamDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string Subject { get; set; }

        [Required]
        [MaxLength(50)]
        public string Class { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        [Range(1, 300)]
        public int DurationMinutes { get; set; }

        public List<CreateExamQuestionDto> Questions { get; set; } = new List<CreateExamQuestionDto>();
    }

    /// <summary>
    /// DTO for creating exam questions
    /// </summary>
    public class CreateExamQuestionDto
    {
        [Required]
        [MaxLength(1000)]
        public string QuestionText { get; set; }

        [Required]
        [MaxLength(500)]
        public string OptionA { get; set; }

        [Required]
        [MaxLength(500)]
        public string OptionB { get; set; }

        [Required]
        [MaxLength(500)]
        public string OptionC { get; set; }

        [Required]
        [MaxLength(500)]
        public string OptionD { get; set; }

        [Required]
        [RegularExpression("^[ABCD]$")]
        public string CorrectAnswer { get; set; }

        [Required]
        [Range(1, 10)]
        public int Marks { get; set; } = 1;

        [MaxLength(1000)]
        public string? Explanation { get; set; }

        public int QuestionOrder { get; set; }
    }

    /// <summary>
    /// DTO for exam details (for teachers)
    /// </summary>
    public class ExamDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string Subject { get; set; }
        public string Class { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationMinutes { get; set; }
        public int TotalMarks { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsLive { get; set; }
        public bool HasEnded { get; set; }
        public DateTime EndTime { get; set; }
        public string TeacherName { get; set; }
        public int TotalSubmissions { get; set; }
        public List<ExamQuestionDto> Questions { get; set; } = new List<ExamQuestionDto>();
    }

    /// <summary>
    /// DTO for exam questions (includes correct answer for teachers)
    /// </summary>
    public class ExamQuestionDto
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string CorrectAnswer { get; set; }
        public int Marks { get; set; }
        public int QuestionOrder { get; set; }
        public string? Explanation { get; set; }
    }

    /// <summary>
    /// DTO for student exam view (without correct answers)
    /// </summary>
    public class StudentExamDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string Subject { get; set; }
        public string Class { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationMinutes { get; set; }
        public int TotalMarks { get; set; }
        public bool IsLive { get; set; }
        public bool HasEnded { get; set; }
        public DateTime EndTime { get; set; }
        public string TeacherName { get; set; }
        public bool HasSubmitted { get; set; }
        public List<StudentExamQuestionDto> Questions { get; set; } = new List<StudentExamQuestionDto>();
    }

    /// <summary>
    /// DTO for student exam questions (without correct answers)
    /// </summary>
    public class StudentExamQuestionDto
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public int Marks { get; set; }
        public int QuestionOrder { get; set; }
        public string? SelectedAnswer { get; set; } // For showing previously selected answer
    }

    /// <summary>
    /// DTO for submitting exam answers
    /// </summary>
    public class SubmitExamDto
    {
        [Required]
        public int ExamId { get; set; }

        public List<ExamAnswerDto> Answers { get; set; } = new List<ExamAnswerDto>();
    }

    /// <summary>
    /// DTO for individual exam answers
    /// </summary>
    public class ExamAnswerDto
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        [RegularExpression("^[ABCD]$")]
        public string SelectedAnswer { get; set; }
    }

    /// <summary>
    /// DTO for exam submission results
    /// </summary>
    public class ExamSubmissionResultDto
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public string Subject { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public bool IsAutoSubmitted { get; set; }
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public bool IsGraded { get; set; }
        public int? TimeTakenMinutes { get; set; }
        public string? Remarks { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsWithinTimeLimit { get; set; }
        public string StudentName { get; set; }
        public List<ExamAnswerResultDto> Answers { get; set; } = new List<ExamAnswerResultDto>();
    }

    /// <summary>
    /// DTO for individual answer results
    /// </summary>
    public class ExamAnswerResultDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string CorrectAnswer { get; set; }
        public string SelectedAnswer { get; set; }
        public bool IsCorrect { get; set; }
        public int MarksAwarded { get; set; }
        public int TotalMarks { get; set; }
        public string? Explanation { get; set; }
    }

    /// <summary>
    /// DTO for exam list view
    /// </summary>
    public class ExamListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subject { get; set; }
        public string Class { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationMinutes { get; set; }
        public int TotalMarks { get; set; }
        public bool IsActive { get; set; }
        public bool IsLive { get; set; }
        public bool HasEnded { get; set; }
        public string TeacherName { get; set; }
        public int TotalQuestions { get; set; }
        public int TotalSubmissions { get; set; }
        public bool HasSubmitted { get; set; } // For student view
    }
}
