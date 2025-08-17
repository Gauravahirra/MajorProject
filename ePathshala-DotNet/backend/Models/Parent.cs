using System.Collections.Generic;

namespace Backend.Models
{
    /// <summary>
    /// Represents a parent/guardian in the system.  Parents inherit
    /// from the base User class and may be linked to one or more
    /// students.  They also have leave approvals which track their
    /// decisions on leave requests.
    /// </summary>
    public class Parent : User
    {
        public ICollection<Student> Students { get; set; } = new List<Student>();

        public ICollection<LeaveRequest> LeaveApprovals { get; set; } = new List<LeaveRequest>();
    }
}