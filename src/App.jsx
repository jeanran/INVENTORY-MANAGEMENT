import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import LogoutButton from './components/LogoutButton';
import AuthForm from './components/Auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user on mount
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) console.error('Error fetching user:', error);
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <h1>Inventory Management</h1>
      {user ? (
        <>
          <h2>Welcome, {user.email}</h2>
          <LogoutButton onLogout={() => setUser(null)} />
          <InventoryForm />
        </>
      ) : (
        <AuthForm onAuth={setUser} />
      )}
    </div>
  );
}

export default App;