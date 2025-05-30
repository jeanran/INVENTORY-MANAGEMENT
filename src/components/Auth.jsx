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
      // ✅ Sign up: hash password and insert
      const hashed = await bcrypt.hash(password, 10);
      const { error: insertError } = await supabase.from('inventory_accounts').insert([
        {
          email,
          password: hashed,
          role: role.toUpperCase()
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
      // ✅ Login
      // Login
const { data, error: loginError } = await supabase
  .from('inventory_accounts')
  .select('*')
  .eq('email', email)
  .single();

console.log('🔎 Login fetched user:', data);
console.log('🔐 Entered password:', password);
console.log('💾 Stored hash:', data?.password);

if (loginError || !data) {
  console.log('❌ Login error:', loginError);
  setError('Invalid email or password');
  return;
}

const match = await bcrypt.compare(password, data.password);
console.log('✅ Password match result:', match);

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
          {isSignup && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
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