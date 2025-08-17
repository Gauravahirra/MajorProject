using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    /// <summary>
    /// Service responsible for issuing JSON Web Tokens (JWT) for
    /// authenticated users.  The tokens contain claims such as the
    /// user's ID, name and role and are signed using a symmetric
    /// secret defined in the configuration.  Consumers must register
    /// this service in the dependency injection container.
    /// </summary>
    public class JwtService
    {
        private readonly JwtSettings _jwtSettings;

        public JwtService(IOptions<JwtSettings> options)
        {
            _jwtSettings = options.Value;
        }

        /// <summary>
        /// Generates a JWT for the specified user.  The token includes
        /// the user's ID, name and role and is valid for the number of
        /// minutes specified in JwtSettings.  If JwtSettings is not
        /// configured, an ArgumentException will be thrown.
        /// </summary>
        public string GenerateToken(User user)
        {
            if (string.IsNullOrEmpty(_jwtSettings.Secret))
            {
                throw new ArgumentException("JWT secret key is not configured.");
            }
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? string.Empty)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}