using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// Controller responsible for authentication.  Provides a login
    /// endpoint that validates a user's credentials and returns a
    /// signed JWT token.  Registration is handled by the AdminController.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        /// <summary>
        /// Logs a user into the system.  Users must supply their email,
        /// password and role.  If the credentials match an existing
        /// user the endpoint returns a JWT token along with some basic
        /// profile information.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Invalid login request.");
            }
            // Find user by email and role
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == dto.Role);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or role." });
            }
            // Verify password
            var hashed = ComputeHash(dto.Password);
            if (!string.Equals(user.PasswordHash, hashed, StringComparison.Ordinal))
            {
                return Unauthorized(new { message = "Invalid password." });
            }
            var token = _jwtService.GenerateToken(user);
            return Ok(new
            {
                token,
                name = user.Name,
                accountNumber = user.AccountNumber,
                role = user.Role
            });
        }

        /// <summary>
        /// Computes a SHA‑256 hash of the provided password.  This is a
        /// basic example; in production you should use a stronger hashing
        /// algorithm such as BCrypt or the ASP.NET Core Identity API.
        /// </summary>
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


//using System;
//using System.Linq;
//using System.Security.Cryptography;
//using System.Text;
//using System.Threading.Tasks;
//using Backend.Data;
//using Backend.DTOs;
//using Backend.Models;
//using Backend.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace Backend.Controllers
//{
//    /// <summary>
//    /// Controller responsible for authentication.  Provides a login
//    /// endpoint that validates a user's credentials and returns a
//    /// signed JWT token.  Registration is handled by the AdminController.
//    /// </summary>
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AuthController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly JwtService _jwtService;

//        public AuthController(ApplicationDbContext context, JwtService jwtService)
//        {
//            _context = context;
//            _jwtService = jwtService;
//        }

//        /// <summary>
//        /// Logs a user into the system.  Users must supply their email,
//        /// password and role.  If the credentials match an existing
//        /// user the endpoint returns a JWT token along with some basic
//        /// profile information.
//        /// </summary>
//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginDto dto)
//        {
//            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
//            {
//                return BadRequest("Invalid login request.");
//            }

//            // Find user by email and role
//            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == dto.Role);
//            if (user == null)
//            {
//                return Unauthorized(new { message = "Invalid email or role." });
//            }

//            // Verify password
//            var hashed = ComputeHash(dto.Password);
//            if (!string.Equals(user.PasswordHash, hashed, StringComparison.Ordinal))
//            {
//                return Unauthorized(new { message = "Invalid password." });
//            }

//            var token = _jwtService.GenerateToken(user);
//            return Ok(new
//            {
//                token,
//                name = user.Name,
//                accountNumber = user.AccountNumber,
//                role = user.Role
//            });
//        }

//        /// <summary>
//        /// Allows a logged-in user to change their password.
//        /// Requires the current password and new password.
//        /// </summary>
//        [Authorize]
//        [HttpPut("change-password")]
//        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
//        {
//            if (string.IsNullOrWhiteSpace(dto.NewPassword))
//                return BadRequest("New password is required.");

//            var email = User.Identity?.Name;
//            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
//            if (user == null)
//                return NotFound("User not found.");

//            if (!string.IsNullOrEmpty(dto.CurrentPassword))
//            {
//                var currentHash = ComputeHash(dto.CurrentPassword);
//                if (user.PasswordHash != currentHash)
//                    return BadRequest("Current password is incorrect.");
//            }

//            user.PasswordHash = ComputeHash(dto.NewPassword);
//            await _context.SaveChangesAsync();

//            return Ok("Password updated successfully.");
//        }

//        /// <summary>
//        /// Computes a SHA‑256 hash of the provided password.
//        /// </summary>
//        private static string ComputeHash(string password)
//        {
//            using (var sha256 = SHA256.Create())
//            {
//                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
//                return Convert.ToBase64String(bytes);
//            }
//        }
//    }
//}
