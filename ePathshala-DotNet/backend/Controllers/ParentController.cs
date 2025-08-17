using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// Controller exposing actions for the Parent role.  Parents can
    /// view their child(ren)'s attendance and grades and approve or
    /// reject leave requests.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Parent")]
    public class ParentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ParentController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        /// <summary>
        /// Returns attendance records for all children linked to the
        /// logged‑in parent.  Children are linked via the ParentId
        /// foreign key on Student.  Each record includes the attendance
        /// status (Present, Absent, Late) rather than a boolean.
        /// </summary>
        [HttpGet("attendance")]
        public async Task<IActionResult> GetAttendance()
        {
            var parentId = GetUserId();
            var childrenIds = await _context.Students
                .Where(s => s.ParentId == parentId)
                .Select(s => s.Id)
                .ToListAsync();
            var attendance = await _context.Attendances
                .Where(a => childrenIds.Contains(a.StudentId))
                .Select(a => new { a.StudentId, a.Date, a.Status, a.TeacherId })
                .ToListAsync();
            return Ok(attendance);
        }

        /// <summary>
        /// Returns grades for all children linked to the parent.
        /// </summary>
        [HttpGet("grades")]
        public async Task<IActionResult> GetGrades()
        {
            var parentId = GetUserId();
            var childrenIds = await _context.Students
                .Where(s => s.ParentId == parentId)
                .Select(s => s.Id)
                .ToListAsync();
            var grades = await _context.Grades
                .Where(g => childrenIds.Contains(g.StudentId))
                .Select(g => new { g.StudentId, g.Subject, g.Marks })
                .ToListAsync();
            return Ok(grades);
        }

        /// <summary>
        /// Returns leave requests for all children linked to the logged‑in
        /// parent.  Each entry includes the approval statuses so the
        /// parent can decide whether to approve or reject.
        /// </summary>
        [HttpGet("leaves")]
        public async Task<IActionResult> GetLeaves()
        {
            var parentId = GetUserId();
            var childrenIds = await _context.Students
                .Where(s => s.ParentId == parentId)
                .Select(s => s.Id)
                .ToListAsync();
            var leaves = await _context.LeaveRequests
                .Where(l => childrenIds.Contains(l.StudentId))
                .Include(l => l.Student)
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
                })
                .ToListAsync();
            return Ok(leaves);
        }

        /// <summary>
        /// Alias for retrieving marks.  Parents can also call
        /// /parent/marks to fetch subject marks for their children.  This
        /// method simply calls GetGrades internally.
        /// </summary>
        [HttpGet("marks")]
        public Task<IActionResult> GetMarks()
        {
            return GetGrades();
        }

        /// <summary>
        /// Approves or rejects a leave request.  The parent sets
        /// ParentApproval accordingly and updates the final status if
        /// both parent and teacher have approved.
        /// </summary>
        [HttpPut("leave/{id}/parent-approval")]
        public async Task<IActionResult> ApproveLeave(int id, [FromQuery] bool approve)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null)
            {
                return NotFound();
            }
            leave.ParentApproval = approve ? ApprovalStatus.Approved : ApprovalStatus.Rejected;
            // Update final status
            if (leave.ParentApproval == ApprovalStatus.Approved && leave.TeacherApproval == ApprovalStatus.Approved)
            {
                leave.FinalStatus = ApprovalStatus.Approved;
            }
            else if (leave.ParentApproval == ApprovalStatus.Rejected || leave.TeacherApproval == ApprovalStatus.Rejected)
            {
                leave.FinalStatus = ApprovalStatus.Rejected;
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Leave request updated.", leave.FinalStatus });
        }

        /// <summary>
        /// Returns the profile of the logged‑in parent including a list
        /// of child IDs.
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var parentId = GetUserId();
            var parent = await _context.Parents.FindAsync(parentId);
            if (parent == null)
            {
                return NotFound();
            }
            var childrenIds = await _context.Students
                .Where(s => s.ParentId == parentId)
                .Select(s => s.Id)
                .ToListAsync();
            return Ok(new
            {
                parent.Name,
                parent.Email,
                parent.AccountNumber,
                Role = parent.Role,
                Children = childrenIds
            });
        }
    }
}