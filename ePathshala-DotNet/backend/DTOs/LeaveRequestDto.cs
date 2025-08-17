using System;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO used when a student submits a leave request.  The student
    /// ID is inferred from the authenticated user, but it is included
    /// here for flexibility and clarity.
    /// </summary>
    public class LeaveRequestDto
    {
        /// <summary>
        /// The ID of the student submitting the request.  This field is
        /// ignored by the API when the student role is authenticated
        /// because the user ID is derived from the JWT token.  It can
        /// be used by admins or parents if they need to create
        /// requests on behalf of a student.
        /// </summary>
        public int? StudentId { get; set; }
        public string Reason { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}