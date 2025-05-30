import { useNavigate, Routes, Route } from 'react-router-dom';
import InventoryTracking from './InventoryTracking';
import InventorySummary from './InventorySummary';
import LogoutButton from './LogoutButton';
import WarehouseInventory from './WarehouseInventory';
import './Dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  // Capitalize first letter of role
  const capitalizedRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : '';

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="dashboard-container">
            <h2 className="welcome">Welcome, {capitalizedRole}</h2>
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="dashboard-links">
              <button onClick={() => navigate('/products')} className="dashboard-button">
                Inventory Tracking
              </button>
              <button onClick={() => navigate('/inventory')} className="dashboard-button">
                Inventory Summary
              </button>
              <button onClick={() => navigate('/warehouse-inventory')} className="dashboard-button">
                Warehouse Inventory
              </button>
            </div>

            <LogoutButton onLogout={onLogout} />
          </div>
        }
      />
      <Route path="/products" element={<InventoryTracking />} />
      <Route path="/inventory" element={<InventorySummary />} />
      <Route path="/warehouse-inventory" element={<WarehouseInventory />} />
    </Routes>
  );
}