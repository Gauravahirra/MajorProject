namespace Backend.Models
{
    /// <summary>
    /// Represents an administrator.  Admins are responsible for
    /// managing users, assigning teachers to classes/subjects and
    /// setting up the academic calendar.  They inherit directly from
    /// the User base class and do not define additional fields.
    /// </summary>
    public class Admin : User
    {
    }
}