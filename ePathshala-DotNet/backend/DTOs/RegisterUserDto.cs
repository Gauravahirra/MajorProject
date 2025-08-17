namespace Backend.DTOs
{
    /// <summary>
    /// DTO used by the Admin when creating a new user.  Depending on
    /// the selected role, not all fields will be populated.  For
    /// example, the Class property is used for students, while the
    /// Subject property is used for teachers.  ParentId links a
    /// parent to a student and is optional when creating a parent.
    /// </summary>
    public class RegisterUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string? Class { get; set; }
        public string? Subject { get; set; }
        public int? ParentId { get; set; }

        /// <summary>
        /// Optional ID of the teacher to assign to a new student.  If
        /// provided when creating a student, the student will be
        /// linked to the specified teacher.  Ignored for other roles.
        /// </summary>
        public int? TeacherId { get; set; }
    }
}