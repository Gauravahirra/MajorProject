namespace Backend.Services
{
    /// <summary>
    /// Configuration class used to bind JWT settings from
    /// appsettings.json.  Contains the secret key, issuer, audience and
    /// token expiration.
    /// </summary>
    public class JwtSettings
    {
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpirationMinutes { get; set; }
    }
}