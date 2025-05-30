import { useNavigate, Routes, Route } from 'react-router-dom';
import InventoryTracking from './InventoryTracking';
import InventorySummary from './InventorySummary';
import LogoutButton from './LogoutButton';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={styles.container}>
            <h2>Welcome, {user.role}</h2>
            <h1 style={styles.title}>Dashboard</h1>

            <div style={styles.links}>
              <button onClick={() => navigate('/products')} style={styles.button}>
                Inventory Tracking
              </button>
              <button onClick={() => navigate('/inventory')} style={styles.button}>
                Inventory Summary
              </button>
            </div>

            <LogoutButton onLogout={onLogout} />
          </div>
        }
      />
      <Route path="/products" element={<InventoryTracking />} />
      <Route path="/inventory" element={<InventorySummary />} />
    </Routes>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '80px auto',
    background: '#fff',
    padding: '50px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '28px',
    margin: '30px 0 20px',
    color: '#172a45',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '30px',
  },
  button: {
    padding: '14px 20px',
    fontSize: '16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0077ff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};