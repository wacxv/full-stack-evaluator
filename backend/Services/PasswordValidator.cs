namespace TaskManager.Services
{
    public interface IPasswordValidator
    {
        (bool IsValid, string Error) ValidatePassword(string password);
    }

    public class PasswordValidator : IPasswordValidator
    {
        public (bool IsValid, string Error) ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (false, "Password is required");

            if (password.Length < 8)
                return (false, "Password must be at least 8 characters");

            if (password.Length > 128)
                return (false, "Password cannot exceed 128 characters");

            bool hasUpper = password.Any(char.IsUpper);
            bool hasLower = password.Any(char.IsLower);
            bool hasDigit = password.Any(char.IsDigit);
            bool hasSpecial = password.Any(c => !char.IsLetterOrDigit(c));

            if (!hasUpper || !hasLower || !hasDigit || !hasSpecial)
                return (false, "Password must contain uppercase, lowercase, digit, and special character");

            return (true, string.Empty);
        }
    }
}