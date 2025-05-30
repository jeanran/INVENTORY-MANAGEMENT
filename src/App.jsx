import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProductsPage from './components/InventoryTracking';
import InventorySummary from './components/InventorySummary';
import './App.css'; // Make sure to import your CSS file

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
      <div className="app-container">
        {user ? (
          <>
            <aside className="sidebar">
              <nav className="nav-links">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Inventory Tracking
                </NavLink>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  Inventory Summary
                </NavLink>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </nav>
            </aside>

            <main className="main-content">
              <Routes>
                {/* Default route (dashboard) */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/inventory" element={<InventorySummary />} />
              </Routes>
            </main>
          </>
        ) : (
          <Auth onAuth={setUser} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
