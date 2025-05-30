import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

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
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route path="/*" element={<Dashboard user={user} onLogout={handleLogout} />} />
        </Routes>
      ) : (
        <Auth onAuth={setUser} />
      )}
    </BrowserRouter>
  );
}

export default App;