import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/users/register', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('email', res.data.email);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="register-container">
        <div className="register-grid">
            <div className="register-card">
            <h1>Register</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleRegister} className="register-form">
                <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>

                <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Min 8 chars: uppercase, lowercase, digit, special"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <small className="password-hint">
                    Password must contain: uppercase, lowercase, number, special character
                </small>
                </div>

                <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                </div>

                <button type="submit" disabled={loading} className="btn-register">
                {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <div className="auth-link">
                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
            </div>
        </div>
        </div>
    </>
  );
}