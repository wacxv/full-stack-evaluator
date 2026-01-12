namespace TaskManager.Models
{
    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public bool IsDone { get; set; }
        public int UserId { get; set; }
    }
}