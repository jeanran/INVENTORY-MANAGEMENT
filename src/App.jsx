import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import InventoryTracking from './components/InventoryTracking';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <Dashboard user={user} onLogout={handleLogout} />
          <InventoryTracking />
        </>
      ) : (
        <Auth onAuth={setUser} />
      )}
    </div>
  );
}

export default App;