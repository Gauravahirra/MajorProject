using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents an item on the academic calendar such as a holiday,
    /// exam, or school event.  Each event has a title, date and
    /// description.
    /// </summary>
    public class AcademicEvent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string? Description { get; set; }
    }
}