namespace Backend.DTOs
{
    /// <summary>
    /// Data Transfer Object used when a user attempts to log in.  The
    /// role field allows the API to confirm that the user is logging
    /// in with the correct role (e.g. a teacher cannot log in as a
    /// student).
    /// </summary>
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}