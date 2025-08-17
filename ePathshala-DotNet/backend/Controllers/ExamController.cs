using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get current user ID from JWT token
        /// </summary>
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        /// <summary>
        /// Get current user role from JWT token
        /// </summary>
        private string GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? "";
        }

        #region Teacher Endpoints

        /// <summary>
        /// Create a new exam (Teachers only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<ExamDetailsDto>> CreateExam([FromBody] CreateExamDto createExamDto)
        {
            try
            {
                var teacherId = GetCurrentUserId();
                
                // Validate that the teacher exists
                var teacher = await _context.Teachers.FindAsync(teacherId);
                if (teacher == null)
                {
                    return NotFound("Teacher not found");
                }

                // Create the exam
                var exam = new Exam
                {
                    Title = createExamDto.Title,
                    Description = createExamDto.Description,
                    Subject = createExamDto.Subject,
                    Class = createExamDto.Class,
                    StartTime = createExamDto.StartTime,
                    DurationMinutes = createExamDto.DurationMinutes,
                    TeacherId = teacherId,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Exams.Add(exam);
                await _context.SaveChangesAsync();

                // Add questions
                var totalMarks = 0;
                foreach (var questionDto in createExamDto.Questions)
                {
                    var question = new ExamQuestion
                    {
                        QuestionText = questionDto.QuestionText,
                        OptionA = questionDto.OptionA,
                        OptionB = questionDto.OptionB,
                        OptionC = questionDto.OptionC,
                        OptionD = questionDto.OptionD,
                        CorrectAnswer = questionDto.CorrectAnswer,
                        Marks = questionDto.Marks,
                        QuestionOrder = questionDto.QuestionOrder,
                        Explanation = questionDto.Explanation,
                        ExamId = exam.Id
                    };

                    totalMarks += question.Marks;
                    _context.ExamQuestions.Add(question);
                }

                // Update total marks
                exam.TotalMarks = totalMarks;
                await _context.SaveChangesAsync();

                // Notify all students in the class
                var students = await _context.Students.Where(s => s.Class == createExamDto.Class).ToListAsync();
                foreach (var student in students)
                {
                    _context.Notifications.Add(new Notification
                    {
                        UserId = student.Id,
                        UserRole = "Student",
                        Title = $"New Exam: {exam.Title}",
                        Message = $"A new exam '{exam.Title}' is available for your class.",
                        Type = "Exam",
                        RelatedEntityId = exam.Id
                    });
                }
                await _context.SaveChangesAsync();

                // Return the created exam details
                return await GetExamDetails(exam.Id);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating exam: {ex.Message}");
            }
        }

        /// <summary>
        /// Get all exams created by the current teacher
        /// </summary>
        [HttpGet("teacher")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<List<ExamListDto>>> GetTeacherExams()
        {
            try
            {
                var teacherId = GetCurrentUserId();

                var exams = await _context.Exams
                    .Where(e => e.TeacherId == teacherId)
                    .Include(e => e.Teacher)
                    .Include(e => e.Questions)
                    .Include(e => e.Submissions)
                    .OrderByDescending(e => e.CreatedAt)
                    .Select(e => new ExamListDto
                    {
                        Id = e.Id,
                        Title = e.Title,
                        Subject = e.Subject,
                        Class = e.Class,
                        StartTime = e.StartTime,
                        DurationMinutes = e.DurationMinutes,
                        TotalMarks = e.TotalMarks,
                        IsActive = e.IsActive,
                        IsLive = e.IsLive,
                        HasEnded = e.HasEnded,
                        TeacherName = e.Teacher.Name,
                        TotalQuestions = e.Questions.Count,
                        TotalSubmissions = e.Submissions.Count
                    })
                    .ToListAsync();

                return Ok(exams);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching teacher exams: {ex.Message}");
            }
        }

        /// <summary>
        /// Get detailed exam information (Teachers only)
        /// </summary>
        [HttpGet("{id}/details")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<ExamDetailsDto>> GetExamDetails(int id)
        {
            try
            {
                var teacherId = GetCurrentUserId();

                var exam = await _context.Exams
                    .Include(e => e.Teacher)
                    .Include(e => e.Questions.OrderBy(q => q.QuestionOrder))
                    .Include(e => e.Submissions)
                    .FirstOrDefaultAsync(e => e.Id == id && e.TeacherId == teacherId);

                if (exam == null)
                {
                    return NotFound("Exam not found or you don't have permission to view it");
                }

                var examDetailsDto = new ExamDetailsDto
                {
                    Id = exam.Id,
                    Title = exam.Title,
                    Description = exam.Description,
                    Subject = exam.Subject,
                    Class = exam.Class,
                    StartTime = exam.StartTime,
                    DurationMinutes = exam.DurationMinutes,
                    TotalMarks = exam.TotalMarks,
                    IsActive = exam.IsActive,
                    CreatedAt = exam.CreatedAt,
                    IsLive = exam.IsLive,
                    HasEnded = exam.HasEnded,
                    EndTime = exam.EndTime,
                    TeacherName = exam.Teacher.Name,
                    TotalSubmissions = exam.Submissions.Count,
                    Questions = exam.Questions.Select(q => new ExamQuestionDto
                    {
                        Id = q.Id,
                        QuestionText = q.QuestionText,
                        OptionA = q.OptionA,
                        OptionB = q.OptionB,
                        OptionC = q.OptionC,
                        OptionD = q.OptionD,
                        CorrectAnswer = q.CorrectAnswer,
                        Marks = q.Marks,
                        QuestionOrder = q.QuestionOrder,
                        Explanation = q.Explanation
                    }).ToList()
                };

                return Ok(examDetailsDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching exam details: {ex.Message}");
            }
        }

        /// <summary>
        /// Get exam submissions and results (Teachers only)
        /// </summary>
        [HttpGet("{id}/submissions")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<List<ExamSubmissionResultDto>>> GetExamSubmissions(int id)
        {
            try
            {
                var teacherId = GetCurrentUserId();

                // Verify teacher owns this exam
                var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == id && e.TeacherId == teacherId);
                if (exam == null)
                {
                    return NotFound("Exam not found or you don't have permission to view it");
                }

                var submissions = await _context.ExamSubmissions
                    .Include(s => s.Student)
                    .Include(s => s.Exam)
                    .Include(s => s.Answers)
                        .ThenInclude(a => a.ExamQuestion)
                    .Where(s => s.ExamId == id)
                    .OrderByDescending(s => s.SubmittedAt)
                    .Select(s => new ExamSubmissionResultDto
                    {
                        Id = s.Id,
                        ExamId = s.ExamId,
                        ExamTitle = s.Exam.Title,
                        Subject = s.Exam.Subject,
                        StartedAt = s.StartedAt,
                        SubmittedAt = s.SubmittedAt,
                        IsAutoSubmitted = s.IsAutoSubmitted,
                        Score = s.Score,
                        MaxScore = s.MaxScore,
                        Percentage = s.Percentage,
                        IsGraded = s.IsGraded,
                        TimeTakenMinutes = s.TimeTakenMinutes,
                        Remarks = s.Remarks,
                        IsCompleted = s.IsCompleted,
                        IsWithinTimeLimit = s.IsWithinTimeLimit,
                        StudentName = s.Student.Name,
                        Answers = s.Answers.Select(a => new ExamAnswerResultDto
                        {
                            QuestionId = a.ExamQuestionId,
                            QuestionText = a.ExamQuestion.QuestionText,
                            OptionA = a.ExamQuestion.OptionA,
                            OptionB = a.ExamQuestion.OptionB,
                            OptionC = a.ExamQuestion.OptionC,
                            OptionD = a.ExamQuestion.OptionD,
                            CorrectAnswer = a.ExamQuestion.CorrectAnswer,
                            SelectedAnswer = a.SelectedAnswer,
                            IsCorrect = a.IsCorrect,
                            MarksAwarded = a.MarksAwarded,
                            TotalMarks = a.ExamQuestion.Marks,
                            Explanation = a.ExamQuestion.Explanation
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching exam submissions: {ex.Message}");
            }
        }

        /// <summary>
        /// Toggle exam active status (Teachers only)
        /// </summary>
        [HttpPut("{id}/toggle-status")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult> ToggleExamStatus(int id)
        {
            try
            {
                var teacherId = GetCurrentUserId();

                var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == id && e.TeacherId == teacherId);
                if (exam == null)
                {
                    return NotFound("Exam not found or you don't have permission to modify it");
                }

                exam.IsActive = !exam.IsActive;
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Exam {(exam.IsActive ? "activated" : "deactivated")} successfully", isActive = exam.IsActive });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error toggling exam status: {ex.Message}");
            }
        }

        #endregion

        #region Student Endpoints

        /// <summary>
        /// Get available exams for the current student
        /// </summary>
        [HttpGet("student")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<ExamListDto>>> GetStudentExams()
        {
            try
            {
                var studentId = GetCurrentUserId();

                // Get student's class
                var student = await _context.Students.FindAsync(studentId);
                if (student == null)
                {
                    return NotFound("Student not found");
                }

                var exams = await _context.Exams
                    .Include(e => e.Teacher)
                    .Include(e => e.Questions)
                    .Include(e => e.Submissions)
                    .Where(e => e.Class == student.Class && e.IsActive)
                    .OrderBy(e => e.StartTime)
                    .Select(e => new ExamListDto
                    {
                        Id = e.Id,
                        Title = e.Title,
                        Subject = e.Subject,
                        Class = e.Class,
                        StartTime = e.StartTime,
                        DurationMinutes = e.DurationMinutes,
                        TotalMarks = e.TotalMarks,
                        IsActive = e.IsActive,
                        IsLive = e.IsLive,
                        HasEnded = e.HasEnded,
                        TeacherName = e.Teacher.Name,
                        TotalQuestions = e.Questions.Count,
                        TotalSubmissions = e.Submissions.Count,
                        HasSubmitted = e.Submissions.Any(s => s.StudentId == studentId)
                    })
                    .ToListAsync();

                return Ok(exams);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching student exams: {ex.Message}");
            }
        }

        /// <summary>
        /// Start an exam (Students only)
        /// </summary>
        [HttpPost("{id}/start")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<StudentExamDto>> StartExam(int id)
        {
            try
            {
                var studentId = GetCurrentUserId();

                // Get student's class
                var student = await _context.Students.FindAsync(studentId);
                if (student == null)
                {
                    return NotFound("Student not found");
                }

                var exam = await _context.Exams
                    .Include(e => e.Teacher)
                    .Include(e => e.Questions.OrderBy(q => q.QuestionOrder))
                    .Include(e => e.Submissions)
                    .FirstOrDefaultAsync(e => e.Id == id && e.Class == student.Class && e.IsActive);

                if (exam == null)
                {
                    return NotFound("Exam not found or not available for your class");
                }

                // Check if exam is live
                if (!exam.IsLive)
                {
                    if (exam.HasEnded)
                    {
                        return BadRequest("This exam has already ended");
                    }
                    else
                    {
                        return BadRequest("This exam has not started yet");
                    }
                }

                // Check if student has already submitted
                var existingSubmission = await _context.ExamSubmissions
                    .FirstOrDefaultAsync(s => s.ExamId == id && s.StudentId == studentId);

                if (existingSubmission != null)
                {
                    return BadRequest("You have already submitted this exam");
                }

                // Create new submission
                var submission = new ExamSubmission
                {
                    ExamId = id,
                    StudentId = studentId,
                    StartedAt = DateTime.UtcNow,
                    MaxScore = exam.TotalMarks
                };

                _context.ExamSubmissions.Add(submission);
                await _context.SaveChangesAsync();

                // Return exam for student
                var studentExamDto = new StudentExamDto
                {
                    Id = exam.Id,
                    Title = exam.Title,
                    Description = exam.Description,
                    Subject = exam.Subject,
                    Class = exam.Class,
                    StartTime = exam.StartTime,
                    DurationMinutes = exam.DurationMinutes,
                    TotalMarks = exam.TotalMarks,
                    IsLive = exam.IsLive,
                    HasEnded = exam.HasEnded,
                    EndTime = exam.EndTime,
                    TeacherName = exam.Teacher.Name,
                    HasSubmitted = false,
                    Questions = exam.Questions.Select(q => new StudentExamQuestionDto
                    {
                        Id = q.Id,
                        QuestionText = q.QuestionText,
                        OptionA = q.OptionA,
                        OptionB = q.OptionB,
                        OptionC = q.OptionC,
                        OptionD = q.OptionD,
                        Marks = q.Marks,
                        QuestionOrder = q.QuestionOrder
                    }).ToList()
                };

                return Ok(studentExamDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error starting exam: {ex.Message}");
            }
        }

        /// <summary>
        /// Submit exam answers (Students only)
        /// </summary>
        [HttpPost("submit")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<ExamSubmissionResultDto>> SubmitExam([FromBody] SubmitExamDto submitExamDto)
        {
            try
            {
                var studentId = GetCurrentUserId();

                // Get the submission
                var submission = await _context.ExamSubmissions
                    .Include(s => s.Exam)
                        .ThenInclude(e => e.Questions)
                    .Include(s => s.Exam)
                        .ThenInclude(e => e.Teacher)
                    .Include(s => s.Student)
                    .FirstOrDefaultAsync(s => s.ExamId == submitExamDto.ExamId && s.StudentId == studentId);

                if (submission == null)
                {
                    return NotFound("Exam submission not found. Please start the exam first.");
                }

                if (submission.IsCompleted)
                {
                    return BadRequest("Exam has already been submitted");
                }

                // Check if submission is within time limit
                var currentTime = DateTime.UtcNow;
                var examEndTime = submission.Exam.StartTime.AddMinutes(submission.Exam.DurationMinutes);
                var isAutoSubmitted = currentTime > examEndTime;

                // Calculate time taken
                var timeTaken = (int)(currentTime - submission.StartedAt).TotalMinutes;

                // Process answers and calculate score
                var totalScore = 0;
                var answers = new List<ExamAnswer>();

                foreach (var answerDto in submitExamDto.Answers)
                {
                    var question = submission.Exam.Questions.FirstOrDefault(q => q.Id == answerDto.QuestionId);
                    if (question != null)
                    {
                        var isCorrect = question.CorrectAnswer.Equals(answerDto.SelectedAnswer, StringComparison.OrdinalIgnoreCase);
                        var marksAwarded = isCorrect ? question.Marks : 0;
                        totalScore += marksAwarded;

                        var answer = new ExamAnswer
                        {
                            ExamSubmissionId = submission.Id,
                            ExamQuestionId = question.Id,
                            SelectedAnswer = answerDto.SelectedAnswer,
                            IsCorrect = isCorrect,
                            MarksAwarded = marksAwarded,
                            AnsweredAt = currentTime
                        };

                        answers.Add(answer);
                    }
                }

                // Update submission
                submission.SubmittedAt = currentTime;
                submission.IsAutoSubmitted = isAutoSubmitted;
                submission.Score = totalScore;
                submission.IsGraded = true;
                submission.TimeTakenMinutes = timeTaken;

                // Add answers
                _context.ExamAnswers.AddRange(answers);
                await _context.SaveChangesAsync();

                // Notify teacher of submission
                var teacher = submission.Exam.Teacher;
                if (teacher != null)
                {
                    _context.Notifications.Add(new Notification
                    {
                        UserId = teacher.Id,
                        UserRole = "Teacher",
                        Title = $"Exam Submitted: {submission.Exam.Title}",
                        Message = $"Student {submission.Student.Name} submitted the exam '{submission.Exam.Title}'. Score: {submission.Score}/{submission.MaxScore}",
                        Type = "Submission",
                        RelatedEntityId = submission.Id
                    });
                    await _context.SaveChangesAsync();
                }

                // Return result
                var result = new ExamSubmissionResultDto
                {
                    Id = submission.Id,
                    ExamId = submission.ExamId,
                    ExamTitle = submission.Exam.Title,
                    Subject = submission.Exam.Subject,
                    StartedAt = submission.StartedAt,
                    SubmittedAt = submission.SubmittedAt,
                    IsAutoSubmitted = submission.IsAutoSubmitted,
                    Score = submission.Score,
                    MaxScore = submission.MaxScore,
                    Percentage = submission.Percentage,
                    IsGraded = submission.IsGraded,
                    TimeTakenMinutes = submission.TimeTakenMinutes,
                    IsCompleted = submission.IsCompleted,
                    IsWithinTimeLimit = submission.IsWithinTimeLimit,
                    StudentName = submission.Student.Name,
                    Answers = answers.Select(a => new ExamAnswerResultDto
                    {
                        QuestionId = a.ExamQuestionId,
                        QuestionText = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).QuestionText,
                        OptionA = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).OptionA,
                        OptionB = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).OptionB,
                        OptionC = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).OptionC,
                        OptionD = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).OptionD,
                        CorrectAnswer = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).CorrectAnswer,
                        SelectedAnswer = a.SelectedAnswer,
                        IsCorrect = a.IsCorrect,
                        MarksAwarded = a.MarksAwarded,
                        TotalMarks = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).Marks,
                        Explanation = submission.Exam.Questions.First(q => q.Id == a.ExamQuestionId).Explanation
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error submitting exam: {ex.Message}");
            }
        }

        /// <summary>
        /// Get student's exam results
        /// </summary>
        [HttpGet("student/results")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<ExamSubmissionResultDto>>> GetStudentResults()
        {
            try
            {
                var studentId = GetCurrentUserId();

                var results = await _context.ExamSubmissions
                    .Include(s => s.Exam)
                    .Include(s => s.Student)
                    .Where(s => s.StudentId == studentId && s.IsCompleted)
                    .OrderByDescending(s => s.SubmittedAt)
                    .Select(s => new ExamSubmissionResultDto
                    {
                        Id = s.Id,
                        ExamId = s.ExamId,
                        ExamTitle = s.Exam.Title,
                        Subject = s.Exam.Subject,
                        StartedAt = s.StartedAt,
                        SubmittedAt = s.SubmittedAt,
                        IsAutoSubmitted = s.IsAutoSubmitted,
                        Score = s.Score,
                        MaxScore = s.MaxScore,
                        Percentage = s.Percentage,
                        IsGraded = s.IsGraded,
                        TimeTakenMinutes = s.TimeTakenMinutes,
                        Remarks = s.Remarks,
                        IsCompleted = s.IsCompleted,
                        IsWithinTimeLimit = s.IsWithinTimeLimit,
                        StudentName = s.Student.Name
                    })
                    .ToListAsync();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching student results: {ex.Message}");
            }
        }

        #endregion

        #region Common Endpoints

        /// <summary>
        /// Get exam result details (for both teachers and students)
        /// </summary>
        [HttpGet("submission/{submissionId}/result")]
        public async Task<ActionResult<ExamSubmissionResultDto>> GetSubmissionResult(int submissionId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();

                var submission = await _context.ExamSubmissions
                    .Include(s => s.Exam)
                        .ThenInclude(e => e.Teacher)
                    .Include(s => s.Student)
                    .Include(s => s.Answers)
                        .ThenInclude(a => a.ExamQuestion)
                    .FirstOrDefaultAsync(s => s.Id == submissionId);

                if (submission == null)
                {
                    return NotFound("Submission not found");
                }

                // Check permissions
                if (userRole == "Student" && submission.StudentId != userId)
                {
                    return Forbid("You can only view your own results");
                }
                else if (userRole == "Teacher" && submission.Exam.TeacherId != userId)
                {
                    return Forbid("You can only view results for your own exams");
                }

                var result = new ExamSubmissionResultDto
                {
                    Id = submission.Id,
                    ExamId = submission.ExamId,
                    ExamTitle = submission.Exam.Title,
                    Subject = submission.Exam.Subject,
                    StartedAt = submission.StartedAt,
                    SubmittedAt = submission.SubmittedAt,
                    IsAutoSubmitted = submission.IsAutoSubmitted,
                    Score = submission.Score,
                    MaxScore = submission.MaxScore,
                    Percentage = submission.Percentage,
                    IsGraded = submission.IsGraded,
                    TimeTakenMinutes = submission.TimeTakenMinutes,
                    Remarks = submission.Remarks,
                    IsCompleted = submission.IsCompleted,
                    IsWithinTimeLimit = submission.IsWithinTimeLimit,
                    StudentName = submission.Student.Name,
                    Answers = submission.Answers.Select(a => new ExamAnswerResultDto
                    {
                        QuestionId = a.ExamQuestionId,
                        QuestionText = a.ExamQuestion.QuestionText,
                        OptionA = a.ExamQuestion.OptionA,
                        OptionB = a.ExamQuestion.OptionB,
                        OptionC = a.ExamQuestion.OptionC,
                        OptionD = a.ExamQuestion.OptionD,
                        CorrectAnswer = a.ExamQuestion.CorrectAnswer,
                        SelectedAnswer = a.SelectedAnswer,
                        IsCorrect = a.IsCorrect,
                        MarksAwarded = a.MarksAwarded,
                        TotalMarks = a.ExamQuestion.Marks,
                        Explanation = a.ExamQuestion.Explanation
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching submission result: {ex.Message}");
            }
        }

        #endregion
    }
}
