//[ApiController]
//[Route("api/[controller]")]
//public class ChatBotController : ControllerBase
//{
//    [HttpPost("query")]
//    public IActionResult Query([FromBody] ChatQueryDto dto)
//    {
//        string q = dto.Question?.ToLower() ?? "";

//        if (q.Contains("holiday")) return Ok("Your next holiday is on 15th August.");
//        if (q.Contains("leave")) return Ok("Go to Dashboard > Leave Application to apply.");
//        if (q.Contains("admin")) return Ok("Contact admin at admin@schoolerp.com.");
//        if (q.Contains("timing")) return Ok("School timings are 8:00 AM to 2:00 PM.");
//        if (q.Contains("marks")) return Ok("Visit Dashboard > Marks to view your performance.");
//        if (q.Contains("assignment")) return Ok("Dashboard > Assignments > Download.");
//        if (q.Contains("class teacher")) return Ok("Check your profile for assigned class teacher.");
//        if (q.Contains("reset password")) return Ok("Use 'Forgot Password' link on login page.");

//        return Ok("Sorry, I didn’t understand. Try asking about marks, leave, or events.");
//    }
//}





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

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatBotController : ControllerBase
    {
        [HttpPost("query")]
        public IActionResult Query([FromBody] ChatQueryDto dto)
        {
            string q = dto.Question?.ToLower() ?? "";

            if (q.Contains("holiday")) return Ok("Your next holiday is on 15th August.");
            if (q.Contains("leave")) return Ok("Go to Dashboard > Leave Application to apply.");
            if (q.Contains("admin")) return Ok("Contact admin at admin@schoolerp.com.");
            if (q.Contains("timing")) return Ok("School timings are 8:00 AM to 2:00 PM.");
            if (q.Contains("marks")) return Ok("Visit Dashboard > Marks to view your performance.");
            if (q.Contains("assignment")) return Ok("Dashboard > Assignments > Download.");
            if (q.Contains("class teacher")) return Ok("Check your profile for assigned class teacher.");
            if (q.Contains("reset password")) return Ok("Use 'Forgot Password' link on login page.");

            return Ok("Sorry, I didn’t understand. Try asking about marks, leave, or events.");
        }
    }
}

