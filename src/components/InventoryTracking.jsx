import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './InventoryTracking.css';

export default function InventoryTracking() {
  const [inventory, setInventory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // ✅ fetch inventory from Supabase
  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        inventory_id,
        stock_quantity,
        status,
        last_updated,
        products (name),
        product_batches (batch_number),
        serial_numbers (serial_number),
        warehouses (name)
      `);

    if (error) {
      console.error('❌ Supabase error:', error.message);
    } else {
      console.log('📦 Fetched inventory:', data); // ✅ dev log
      setInventory(data);
    }
  };

  // ✅ run on load + auto-refresh every 10s
  useEffect(() => {
    fetchInventory();
    const interval = setInterval(() => fetchInventory(), 10000);
    return () => clearInterval(interval); // cleanup
  }, []);

  const filtered = statusFilter === 'all'
    ? inventory
    : inventory.filter(item => item.status?.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="tracking-page">
      <h2>Inventory Tracking</h2>

      <div className="filters">
        <label>Status Filter:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="in_transit">In Transit</option>
          <option value="damaged">Damaged</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="no-data">🚫 No inventory data found for this filter.</div>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Batch</th>
              <th>Serial</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.inventory_id}>
                <td>{item.products?.name || '-'}</td>
                <td>{item.warehouses?.name || '-'}</td>
                <td>{item.product_batches?.batch_number || '-'}</td>
                <td>{item.serial_numbers?.serial_number || '-'}</td>
                <td>{item.stock_quantity}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(item.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}