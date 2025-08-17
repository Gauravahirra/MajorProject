using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents an assignment uploaded by a teacher for a specific
    /// class and subject.  The FilePath field stores the relative
    /// location of the uploaded file on the server.  In production
    /// you might use a cloud storage service and store a URI instead.
    /// </summary>
    public class Assignment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        /// <summary>
        /// Relative or absolute path to the uploaded assignment file.
        /// </summary>
        [Required]
        public string FilePath { get; set; }

        /// <summary>
        /// The subject for which the assignment is given (e.g. "Physics").
        /// </summary>
        [Required]
        public string Subject { get; set; }

        /// <summary>
        /// The class to which this assignment applies (e.g. "12B").
        /// </summary>
        [Required]
        public string Class { get; set; }

        [Required]
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }
    }
}