using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a subject mark awarded to a student.  Each Grade
    /// record links a student to a subject and stores the numeric
    /// marks.  In a more advanced system you might include term
    /// information, weightings or letter grades.
    /// </summary>
    public class Grade
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public decimal Marks { get; set; }
    }
}