using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents a leave request submitted by a student.  The request
    /// contains a date range and a reason, along with the current
    /// approval statuses from the teacher and parent.  When both the
    /// teacher and parent approve, the final status becomes Approved.
    /// </summary>
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [Required]
        public string Reason { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public ApprovalStatus TeacherApproval { get; set; } = ApprovalStatus.Pending;

        [Required]
        public ApprovalStatus ParentApproval { get; set; } = ApprovalStatus.Pending;

        [Required]
        public ApprovalStatus FinalStatus { get; set; } = ApprovalStatus.Pending;
    }

    /// <summary>
    /// Enumeration used to track the approval status of leave requests.
    /// </summary>
    public enum ApprovalStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }
}