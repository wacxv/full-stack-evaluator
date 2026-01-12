using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TaskManager.Models;
using TaskManager.Data;
using TaskManager.Services;
using System.Security.Cryptography;
using System.Text;

namespace TaskManager.API
{
    [Route("users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;

        public UsersController(ApplicationDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return Unauthorized("Invalid email or password");

            if (!VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password");

            var token = _jwtService.GenerateToken(user);
            return Ok(new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                Token = token
            });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Include(u => u.Tasks)
                .AsNoTracking()
                .ToListAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var userId = User.FindFirst("userId")?.Value;
            
            // Only allow users to see their own data
            if (userId != id.ToString() && !User.IsInRole("Admin"))
                return Forbid("You can only view your own profile");

            var user = await _context.Users
                .Include(u => u.Tasks)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);
                
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists) return BadRequest("Email already in use");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            var token = _jwtService.GenerateToken(user);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                Token = token
            });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst("userId")?.Value;
            
            if (userId != id.ToString() && !User.IsInRole("Admin"))
                return Forbid("You can only delete your own account");

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == hash;
        }
    }
}