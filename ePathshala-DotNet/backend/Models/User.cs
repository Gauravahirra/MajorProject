using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Base class for all user types.  Contains common properties such as
    /// a unique account number, name, email and password hash.  This
    /// abstract class is used by Entity Framework Core to implement
    /// table-per-hierarchy (TPH) inheritance using the Role discriminator.
    /// </summary>
    public abstract class User
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// A human‑readable unique account number generated on user creation.
        /// </summary>
        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// Hashed password.  Do not store plaintext passwords.
        /// </summary>
        [Required]
        public string PasswordHash { get; set; }

        /// <summary>
        /// Discriminator column used by EF Core for role‑based inheritance.
        /// Valid values include "Student", "Teacher", "Parent", "Admin".
        /// </summary>
        [Required]
        public string Role { get; set; }
    }
}