// src/components/AuthForm.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AuthForm.css'; // Optional for styling

export default function AuthForm({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let authResult;
    if (isSignup) {
      authResult = await supabase.auth.signUp({ email, password });
    } else {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    }

    const { data, error } = authResult;
    if (error) {
      setError(error.message);
    } else {
      setError('');
      onAuth(data.user); // Notify App component
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>

        {error && <p className="error">{error}</p>}

        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
}
