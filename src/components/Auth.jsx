import { useState } from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';
import './Authform.css';

export default function Auth({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      // Sign up
      const hashed = await bcrypt.hash(password, 10);
      const { error: insertError } = await supabase.from('inventory_accounts').insert([
        {
          email,
          password: hashed,
          role: role.toLowerCase()
        }
      ]);

      if (insertError) {
        setError('Signup failed: ' + insertError.message);
        return;
      }

      alert('Account created! You can now log in.');
      setIsSignup(false);
      setEmail('');
      setPassword('');
    } else {
      // Login
      const { data, error: loginError } = await supabase
        .from('inventory_accounts')
        .select('*')
        .eq('email', email)
        .single();

      if (loginError || !data) {
        setError('Invalid email or password');
        return;
      }

      const match = await bcrypt.compare(password, data.password);
      if (!match) {
        setError('Invalid email or password');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      onAuth(data);
    }
  };

  return (
    <div className="auth-wrapper">
      <h1>Inventory Management</h1>
      <div className="auth-card">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {isSignup && (
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="toggle" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}