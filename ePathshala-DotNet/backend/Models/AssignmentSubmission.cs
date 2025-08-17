using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a student's submission for a particular assignment.  Each
    /// submission links an assignment to a student and stores the
    /// uploaded file path along with the submission timestamp.
    /// </summary>
    public class AssignmentSubmission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; }

        [Required]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [Required]
        public string FilePath { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}