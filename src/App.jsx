import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import LogoutButton from './components/LogoutButton';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.email}</h1>
          <p>Role: {user.role}</p>
          <LogoutButton onLogout={handleLogout} />
        </>
      ) : (
        <Auth onAuth={setUser} />
      )}
    </div>
  );
}

export default App;