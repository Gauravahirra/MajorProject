using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Backend.Controllers
{
    /// <summary>
    /// Controller exposing actions for the Teacher role.  Teachers can
    /// view their students, record grades and attendance, approve
    /// leave requests, upload assignments and view class averages.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Teacher")]
    public class TeacherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeacherController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        /// <summary>
        /// Returns a list of students.  In this simplified example
        /// teachers can see all students.  You can implement logic to
        /// filter students by class/subject based on teacher assignments.
        /// </summary>
        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var teacherId = GetUserId();
            var students = await _context.Students
                .Where(s => s.TeacherId == teacherId)
                .Select(s => new { s.Id, s.Name, s.Email, s.Class, s.AccountNumber })
                .ToListAsync();
            return Ok(students);
        }

        /// <summary>
        /// Records a grade for a student.  Teachers must specify the
        /// student ID, subject and marks.  In practice you might
        /// restrict the subject to the teacher's assigned subject.
        /// </summary>
        [HttpPost("grades")]
        public async Task<IActionResult> AddGrade([FromQuery] int studentId, [FromQuery] string subject, [FromQuery] decimal marks)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
            {
                return NotFound(new { message = "Student not found." });
            }
            // Ensure the student belongs to the current teacher
            var teacherId = GetUserId();
            if (student.TeacherId != teacherId)
            {
                return Forbid();
            }
            var grade = new Grade
            {
                StudentId = studentId,
                Subject = subject,
                Marks = marks
            };
            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Grade recorded.", grade.Id });
        }

        /// <summary>
        /// Alias for adding marks.  Teachers can also call /teacher/marks to
        /// record a numeric mark for a student.  This simply calls
        /// AddGrade internally to reuse the existing logic.  The route is
        /// provided to use "marks" terminology in API paths without
        /// changing the underlying entity.
        /// </summary>
        [HttpPost("marks")]
        public Task<IActionResult> AddMarks([FromQuery] int studentId, [FromQuery] string subject, [FromQuery] decimal marks)
        {
            return AddGrade(studentId, subject, marks);
        }

        /// <summary>
        /// Updates an existing grade's marks.
        /// </summary>
        [HttpPut("grades/{id}")]
        public async Task<IActionResult> UpdateGrade(int id, [FromQuery] decimal marks)
        {
            var grade = await _context.Grades.Include(g => g.Student).FirstOrDefaultAsync(g => g.Id == id);
            if (grade == null)
            {
                return NotFound();
            }
            // Ensure the student belongs to the current teacher
            var teacherId = GetUserId();
            if (grade.Student.TeacherId != teacherId)
            {
                return Forbid();
            }
            grade.Marks = marks;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Grade updated." });
        }

        /// <summary>
        /// Alias for updating marks.  Mirrors the /teacher/grades/{id}
        /// endpoint but uses "marks" in the path to align with the
        /// terminology used on the front‑end.
        /// </summary>
        [HttpPut("marks/{id}")]
        public Task<IActionResult> UpdateMarks(int id, [FromQuery] decimal marks)
        {
            return UpdateGrade(id, marks);
        }

        /// <summary>
        /// Returns all marks (grades) recorded in the system.  Each entry
        /// includes the ID, student ID, student name, subject and marks.
        /// Currently there is no teacher filtering because the Grade
        /// entity does not track which teacher recorded it.  You can
        /// extend the Grade model with a TeacherId property if
        /// necessary.
        /// </summary>
        [HttpGet("marks")]
        public async Task<IActionResult> GetMarks()
        {
            var teacherId = GetUserId();
            var marks = await _context.Grades
                .Include(g => g.Student)
                .Where(g => g.Student.TeacherId == teacherId)
                .Select(g => new
                {
                    g.Id,
                    g.StudentId,
                    StudentName = g.Student.Name,
                    g.Subject,
                    g.Marks
                })
                .ToListAsync();
            return Ok(marks);
        }

        /// <summary>
        /// Returns a list of assignments created by the currently
        /// authenticated teacher.  Each entry includes basic details
        /// and the file path for download.
        /// </summary>
        [HttpGet("assignments")]
        public async Task<IActionResult> GetAssignmentsForTeacher()
        {
            var teacherId = GetUserId();
            var assignments = await _context.Assignments
                .Where(a => a.TeacherId == teacherId)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.DueDate,
                    a.Subject,
                    ClassName = a.Class,
                    a.FilePath
                })
                .ToListAsync();
            return Ok(assignments);
        }

        /// <summary>
        /// Returns a list of student submissions for a particular assignment.
        /// Teachers can use this endpoint to view all uploaded solutions
        /// for an assignment they created.
        /// </summary>
        [HttpGet("assignments/{id}/submissions")]
        public async Task<IActionResult> GetAssignmentSubmissions(int id)
        {
            var submissions = await _context.AssignmentSubmissions
                .Where(s => s.AssignmentId == id)
                .Select(s => new
                {
                    s.Id,
                    s.StudentId,
                    s.FilePath,
                    s.SubmittedAt
                })
                .ToListAsync();
            return Ok(submissions);
        }

        /// <summary>
        /// Marks attendance for a student on a given date.  The teacher
        /// recording the attendance is inferred from the authenticated
        /// user.  Instead of a boolean present flag this endpoint accepts
        /// a status string (Present, Absent, Late) to allow more nuanced
        /// tracking of attendance.
        /// </summary>
        [HttpPost("attendance")]
        public async Task<IActionResult> MarkAttendance([FromQuery] int studentId, [FromQuery] DateTime date, [FromQuery] string status)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
            {
                return NotFound(new { message = "Student not found." });
            }
            // Validate status
            var normalizedStatus = status?.Trim();
            if (string.IsNullOrWhiteSpace(normalizedStatus))
            {
                return BadRequest(new { message = "Status is required." });
            }
            var allowed = new[] { "Present", "Absent", "Late" };
            // ensure provided status matches one of the allowed values (case‑insensitive)
            if (!allowed.Any(a => a.Equals(normalizedStatus, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new { message = "Invalid status. Allowed values: Present, Absent, Late." });
            }
            // normalise to canonical casing from the allowed list
            var capitalised = allowed.First(a => a.Equals(normalizedStatus, StringComparison.OrdinalIgnoreCase));
            var teacherId = GetUserId();
            var attendance = new Attendance
            {
                StudentId = studentId,
                Date = date.Date,
                Status = capitalised,
                TeacherId = teacherId
            };
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Attendance marked.", attendance.Id });
        }

        /// <summary>
        /// Returns attendance entries recorded by the teacher.  Each entry
        /// includes the attendance status instead of a boolean present flag.
        /// </summary>
        [HttpGet("attendance")]
        public async Task<IActionResult> GetAttendance()
        {
            var teacherId = GetUserId();
            var attendances = await _context.Attendances
                .Where(a => a.TeacherId == teacherId)
                .Select(a => new { a.Id, a.StudentId, a.Date, a.Status })
                .ToListAsync();
            return Ok(attendances);
        }

        /// <summary>
        /// Returns all leave requests in the system.  Teachers can view
        /// the current approval status of each leave and decide whether
        /// to approve or reject them.  In a more advanced system you
        /// might filter leaves by class or subject, but here we return
        /// every request.
        /// </summary>
        [HttpGet("leaves")]
        public async Task<IActionResult> GetLeaveRequests()
        {
            var teacherId = GetUserId();
            var leaves = await _context.LeaveRequests
                .Include(l => l.Student)
                .Where(l => l.Student.TeacherId == teacherId)
                .Select(l => new
                {
                    l.Id,
                    l.StudentId,
                    StudentName = l.Student.Name,
                    l.Reason,
                    l.StartDate,
                    l.EndDate,
                    l.TeacherApproval,
                    l.ParentApproval,
                    l.FinalStatus
                }).ToListAsync();
            return Ok(leaves);
        }

        /// <summary>
        /// Computes the average marks for the specified subject.
        /// </summary>
        [HttpGet("average")]
        public async Task<IActionResult> GetClassAverage([FromQuery] string subject)
        {
            var grades = await _context.Grades
                .Where(g => g.Subject == subject)
                .ToListAsync();
            if (!grades.Any())
            {
                return Ok(new { subject, average = 0 });
            }
            var average = grades.Average(g => g.Marks);
            return Ok(new { subject, average });
        }

        /// <summary>
        /// Uploads a new assignment.  Teachers provide a title, due date,
        /// subject, class and a file via multipart/form-data.  The file
        /// is saved to the server and the assignment record stores the
        /// relative file path so that students can download it later.
        /// </summary>
        [HttpPost("assignments")]
        public async Task<IActionResult> UploadAssignment([
            FromForm] string title,
            [FromForm] DateTime dueDate,
            [FromForm] string subject,
            [FromForm(Name = "class")] string classParam,
            [FromForm] IFormFile file)
        {
            var teacherId = GetUserId();
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }
            // Ensure uploads directory exists
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "assignments");
            if (!Directory.Exists(uploadsDir))
            {
                Directory.CreateDirectory(uploadsDir);
            }
            // Generate unique file name
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsDir, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))

            {
                await file.CopyToAsync(stream);
            }
            // Relative path to store in DB for download purposes
            var relativePath = Path.Combine("uploads", "assignments", fileName);
            var assignment = new Assignment
            {
                Title = title,
                DueDate = dueDate,
                Subject = subject,
                Class = classParam,
                FilePath = relativePath,
                TeacherId = teacherId
            };
            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Assignment uploaded.", assignment.Id, assignment.FilePath });
        }

        /// <summary>
        /// Deletes an assignment created by the current teacher.  Any
        /// associated submissions are also removed and the file on disk
        /// is deleted.  Students will no longer see this assignment.
        /// </summary>
        [HttpDelete("assignments/{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var teacherId = GetUserId();
            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound();
            }
            if (assignment.TeacherId != teacherId)
            {
                return Forbid();
            }
            // Remove submission records associated with this assignment
            var submissions = _context.AssignmentSubmissions.Where(s => s.AssignmentId == id);
            _context.AssignmentSubmissions.RemoveRange(submissions);
            // Delete the file from disk if it exists
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), assignment.FilePath);
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }
            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Assignment deleted." });
        }

        /// <summary>
        /// Approves or rejects a leave request.  The teacher sets
        /// TeacherApproval to Approved or Rejected and updates the final
        /// status if both teacher and parent have approved.
        /// </summary>
        [HttpPut("leave/{id}/teacher-approval")]
        public async Task<IActionResult> ApproveLeave(int id, [FromQuery] bool approve)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null)
            {
                return NotFound();
            }
            leave.TeacherApproval = approve ? ApprovalStatus.Approved : ApprovalStatus.Rejected;
            // Update final status
            if (leave.TeacherApproval == ApprovalStatus.Approved && leave.ParentApproval == ApprovalStatus.Approved)
            {
                leave.FinalStatus = ApprovalStatus.Approved;
            }
            else if (leave.TeacherApproval == ApprovalStatus.Rejected || leave.ParentApproval == ApprovalStatus.Rejected)
            {
                leave.FinalStatus = ApprovalStatus.Rejected;
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Leave request updated.", leave.FinalStatus });
        }

        /// <summary>
        /// Returns the profile of the logged‑in teacher.  Basic info
        /// only.
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var id = GetUserId();
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }
            return Ok(new
            {
                teacher.Name,
                teacher.Email,
                teacher.AccountNumber,
                teacher.Subject,
                Role = teacher.Role
            });
        }
    }


}



