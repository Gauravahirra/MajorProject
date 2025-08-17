namespace Backend.DTOs
{
    /// <summary>
    /// DTO used for updating an existing user.  Any non‑null
    /// properties will overwrite the existing values on the user.
    /// Fields not supplied (null) will be left unchanged.
    /// </summary>
    public class UpdateUserDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Class { get; set; }
        public string? Subject { get; set; }
        public int? ParentId { get; set; }
        public int? TeacherId { get; set; }
    }
}