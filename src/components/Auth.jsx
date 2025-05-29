import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AuthForm.css';

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

      const { data: userData, error: signupError } = authResult;
      if (signupError) {
        setError(signupError.message);
        return;
      }

      const { user } = userData;
      await supabase.from('inventory_accounts').insert([
        {
          user_id: user.id,
          email: user.email,
        }
      ]);

      onAuth(user);
    } else {
      authResult = await supabase.auth.signInWithPassword({ email, password });
      const { data, error } = authResult;
      if (error) {
        setError(error.message);
      } else {
        setError('');
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