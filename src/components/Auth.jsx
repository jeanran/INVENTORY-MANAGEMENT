import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AuthForm.css';

export default function AuthForm({ onAuth }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSignup) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // 🕒 Wait a moment to make sure Supabase backend finishes auth
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();

    if (sessionError || !sessionData.user) {
      setError('Could not fetch new user session');
      return;
    }

    const user = sessionData.user;

    // ✅ Insert into your custom table
    const { error: insertError } = await supabase.from('inventory_accounts').insert([
      {
        user_id: user.id,
        email: user.email,
        role: role.toLowerCase()
      }
    ]);

    if (insertError) {
      console.error('Insert error:', insertError);
      setError('Database error saving new user');
      return;
    }

    onAuth(user);
  } else {
    // login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      onAuth(data.user);
    }
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {isSignup && (
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          </select>
        )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
          {error && <p className="error">{error}</p>}
        </form>

        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>

      </div>
    </div>
  );
}