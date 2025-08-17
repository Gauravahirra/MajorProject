using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents an attendance entry for a student on a particular date.
    /// The entry stores a status indicating whether the student was
    /// present, absent or late and references the teacher who recorded
    /// the attendance.  Additional statuses can be added without
    /// changing the schema because the Status field is stored as a string.
    /// </summary>
    public class Attendance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [Required]
        public DateTime Date { get; set; }

        /// <summary>
        /// Attendance status for the day.  Possible values include
        /// "Present", "Absent" and "Late".  Using a string allows
        /// easier extension of additional statuses in future.
        /// </summary>
        [Required]
        public string Status { get; set; }

        [Required]
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }
    }
}