using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a notification for a user (student or teacher).
    /// </summary>
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // FK to User

        [Required]
        [MaxLength(20)]
        public string UserRole { get; set; } // "Student" or "Teacher"

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Message { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(30)]
        public string Type { get; set; } // e.g., "Exam", "Submission"

        public int? RelatedEntityId { get; set; } // e.g., ExamId, SubmissionId
    }
}