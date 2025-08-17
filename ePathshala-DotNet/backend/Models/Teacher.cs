using System.Collections.Generic;

namespace Backend.Models
{
    /// <summary>
    /// Represents a teacher in the system.  Teachers inherit from the
    /// base User class and contain additional properties such as the
    /// subject they teach and collections of assignments, attendance
    /// records and leave approvals.
    /// </summary>
    public class Teacher : User
    {
        /// <summary>
        /// The subject taught by this teacher (e.g. "Mathematics").
        /// Optional; an admin may assign multiple subjects via a
        /// mapping table in the future.
        /// </summary>
        public string? Subject { get; set; }

        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

        /// <summary>
        /// All leave requests that require teacher approval.  The
        /// ApprovalStatus values on each LeaveRequest represent the
        /// teacher's decision separately from the parent's decision.
        /// </summary>
        public ICollection<LeaveRequest> LeaveApprovals { get; set; } = new List<LeaveRequest>();

        /// <summary>
        /// Collection of students assigned to this teacher.  An admin
        /// assigns students to teachers, and teachers can only view
        /// and manage the students in this collection.  The inverse
        /// relationship is defined on Student via the TeacherId
        /// property.
        /// </summary>
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}