using System.Collections.Generic;

namespace Backend.Models
{
    /// <summary>
    /// Represents a student in the system.  Students inherit from the base
    /// User class and contain additional properties such as class name,
    /// grades, attendance records and linked parent.
    /// </summary>
    public class Student : User
    {
        /// <summary>
        /// The class (e.g. "10A") the student belongs to.  Optional.
        /// </summary>
        public string? Class { get; set; }

        public ICollection<Grade> Grades { get; set; } = new List<Grade>();

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

        public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();

        /// <summary>
        /// Optional foreign key linking the student to a parent.  A
        /// student may have multiple parents (for example, in the future
        /// you might support guardians), but for simplicity we assume
        /// one parent per student here.  The relationship is defined
        /// further in ApplicationDbContext.
        /// </summary>
        public int? ParentId { get; set; }
        public Parent? Parent { get; set; }

        // Restore one-to-one teacher relationship
        public int? TeacherId { get; set; }
        public Teacher? Teacher { get; set; }
    }
}