using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// Controller exposing administrative actions.  Only users in the
    /// Admin role may access these endpoints.  Admins can create
    /// students, teachers and parents, view and delete users and
    /// configure academic events.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --------------------- User Management ---------------------

        /// <summary>
        /// Registers a new user in the system.  The admin must specify
        /// the role (Student, Teacher or Parent) and provide any
        /// additional fields required for that role.  A unique
        /// account number is generated automatically.  Passwords are
        /// hashed using SHA‑256.
        /// </summary>
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterUserDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Role) ||
                string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Missing required fields.");
            }
            // Check for duplicate email
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return Conflict(new { message = "A user with this email already exists." });
            }
            var accountNumber = GenerateAccountNumber();
            var passwordHash = ComputeHash(dto.Password);
            switch (dto.Role)
            {
                case "Student":
                    // Create a new student.  If no ParentId is supplied, automatically
                    // generate a parent account using the student's email and a default
                    // password.  The parent email will be the student's email with
                    // ".parent" inserted before the @ sign (e.g. john@example.com -> john.parent@example.com).
                    var student = new Student
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        PasswordHash = passwordHash,
                        Role = "Student",
                        AccountNumber = accountNumber,
                        Class = dto.Class,
                        ParentId = dto.ParentId,
                        TeacherId = dto.TeacherId
                    };
                    // If parent is not explicitly linked, create one automatically
                    if (!dto.ParentId.HasValue)
                    {
                        // Derive parent email by inserting ".parent" before the @ symbol
                        var atIndex = dto.Email.IndexOf('@');
                        var parentEmail = atIndex > 0
                            ? dto.Email.Substring(0, atIndex) + ".parent" + dto.Email.Substring(atIndex)
                            : dto.Email + ".parent";
                        // Generate account and password for parent
                        var parentAccount = GenerateAccountNumber();
                        var parentPassword = ComputeHash("password123");
                        var parentName = dto.Name + "'s Parent";
                        var parent = new Parent
                        {
                            Name = parentName,
                            Email = parentEmail,
                            PasswordHash = parentPassword,
                            Role = "Parent",
                            AccountNumber = parentAccount
                        };
                        _context.Parents.Add(parent);
                        await _context.SaveChangesAsync();
                        // Link the new parent to the student
                        student.ParentId = parent.Id;
                    }
                    _context.Students.Add(student);
                    break;
                case "Teacher":
                    var teacher = new Teacher
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        PasswordHash = passwordHash,
                        Role = "Teacher",
                        AccountNumber = accountNumber,
                        Subject = dto.Subject
                    };
                    _context.Teachers.Add(teacher);
                    break;
                case "Parent":
                    var parentOnly = new Parent
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        PasswordHash = passwordHash,
                        Role = "Parent",
                        AccountNumber = accountNumber
                    };
                    _context.Parents.Add(parentOnly);
                    break;
                default:
                    return BadRequest("Invalid role specified.");
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "User created successfully.", accountNumber });
        }

        /// <summary>
        /// Returns a list of all students.  Basic profile details are
        /// returned without exposing passwords.  For a production
        /// system you may implement pagination.
        /// </summary>
        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _context.Students
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Email,
                    s.AccountNumber,
                    s.Class,
                    ParentId = s.ParentId,
                    TeacherId = s.TeacherId
                }).ToListAsync();
            return Ok(students);
        }

        /// <summary>
        /// Returns a list of all teachers.
        /// </summary>
        [HttpGet("teachers")]
        public async Task<IActionResult> GetTeachers()
        {
            var teachers = await _context.Teachers
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Email,
                    t.AccountNumber,
                    t.Subject
                }).ToListAsync();
            return Ok(teachers);
        }

        /// <summary>
        /// Returns a list of all parents.
        /// </summary>
        [HttpGet("parents")]
        public async Task<IActionResult> GetParents()
        {
            var parents = await _context.Parents
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Email,
                    p.AccountNumber
                }).ToListAsync();
            return Ok(parents);
        }

        /// <summary>
        /// Deletes a user by ID.  This will cascade delete any related
        /// records (e.g. grades, attendance, leave requests) due to
        /// EF Core configuration.  Only call this endpoint if you are
        /// sure you want to permanently remove the user.
        /// </summary>
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            // If deleting a student, check if their parent has no other
            // students and delete the parent as well.  Otherwise
            // removing the student will leave the parent orphaned.
            if (user is Student student)
            {
                // Capture parent before removal (may be null)
                var parentId = student.ParentId;
                _context.Users.Remove(student);
                await _context.SaveChangesAsync();
                // If there is an associated parent and they have no other children,
                // delete the parent as well.
                if (parentId.HasValue)
                {
                    var otherChildren = await _context.Students.AnyAsync(s => s.ParentId == parentId && s.Id != id);
                    if (!otherChildren)
                    {
                        var parent = await _context.Parents.FindAsync(parentId.Value);
                        if (parent != null)
                        {
                            _context.Users.Remove(parent);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
            else
            {
                // When deleting a teacher, EF will set TeacherId on students to null
                // because of DeleteBehavior.SetNull configured in OnModelCreating.
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }

        /// <summary>
        /// Updates an existing user.  The role determines which
        /// properties are valid.  Fields that are null will be
        /// ignored and leave the existing values unchanged.
        /// </summary>
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            // Update name and email if provided
            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.Name = dto.Name;
            }
            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                // prevent duplicate emails
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id))
                {
                    return Conflict(new { message = "A user with this email already exists." });
                }
                user.Email = dto.Email;
            }
            switch (user)
            {
                case Student student:
                    if (!string.IsNullOrWhiteSpace(dto.Class))
                        student.Class = dto.Class;
                    if (dto.ParentId.HasValue)
                        student.ParentId = dto.ParentId;
                    if (dto.TeacherId.HasValue)
                        student.TeacherId = dto.TeacherId;
                    break;
                case Teacher teacher:
                    if (!string.IsNullOrWhiteSpace(dto.Subject))
                        teacher.Subject = dto.Subject;
                    break;
                case Parent parent:
                    // Parents have no additional fields to update beyond Name/Email
                    break;
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully." });
        }

        // --------------------- Academic Events ---------------------

        /// <summary>
        /// Creates a new academic event such as a holiday, exam or
        /// other calendar item.  Events are visible to all roles.
        /// </summary>
        [HttpPost("events")]
        public async Task<IActionResult> CreateEvent([FromBody] AcademicEvent evt)
        {
            if (evt == null || string.IsNullOrWhiteSpace(evt.Title))
            {
                return BadRequest("Invalid event.");
            }
            _context.AcademicEvents.Add(evt);
            await _context.SaveChangesAsync();

            // Notify all teachers
            var teachers = await _context.Teachers.ToListAsync();
            foreach (var teacher in teachers)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = teacher.Id,
                    UserRole = "Teacher",
                    Title = $"New Academic Event: {evt.Title}",
                    Message = $"A new event '{evt.Title}' has been added to the academic calendar.",
                    Type = "Event",
                    RelatedEntityId = evt.Id
                });
            }
            // Notify all students
            var students = await _context.Students.ToListAsync();
            foreach (var student in students)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = student.Id,
                    UserRole = "Student",
                    Title = $"New Academic Event: {evt.Title}",
                    Message = $"A new event '{evt.Title}' has been added to the academic calendar.",
                    Type = "Event",
                    RelatedEntityId = evt.Id
                });
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Event created.", evt.Id });
        }

        /// <summary>
        /// Lists all academic events.
        /// </summary>
        [HttpGet("events")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _context.AcademicEvents.ToListAsync();
            return Ok(events);
        }

        // --------------------- Teacher Assignment ---------------------

        /// <summary>
        /// Assigns a teacher to a subject.  The teacher's Subject field
        /// is updated.  Future versions might support assigning
        /// multiple subjects or linking classes separately.
        /// </summary>
        [HttpPost("assign-teacher")]
        public async Task<IActionResult> AssignTeacher([FromQuery] int teacherId, [FromQuery] string subject)
        {
            var teacher = await _context.Teachers.FindAsync(teacherId);
            if (teacher == null)
            {
                return NotFound(new { message = "Teacher not found." });
            }
            teacher.Subject = subject;
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Teacher assigned to subject {subject}." });
        }

        // --------------------- Utility methods ---------------------

        /// <summary>
        /// Generates a pseudo‑random account number.  This implementation
        /// creates a 10‑digit numeric string based on the current
        /// timestamp combined with a random suffix.  You can replace
        /// this with your own logic to ensure uniqueness.
        /// </summary>
        private static string GenerateAccountNumber()
        {
            var random = new Random();
            var timestamp = DateTime.UtcNow.Ticks.ToString();
            var suffix = random.Next(1000, 9999).ToString();
            // Take the last 6 digits of the timestamp and append the random
            var acct = timestamp.Substring(timestamp.Length - 6) + suffix;
            return acct;
        }

        private static string ComputeHash(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}