import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './InventoryTracking.css';

const supabase = createClient(
  'https://iradphcrwwokdrnhxpnd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
);

const InventoryTracking = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    product: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data: productList, error } = await supabase.from('products').select('product_id, name');
    if (error) {
      console.error('Product fetch error:', error.message);
      return;
    }
    setProducts(productList || []);
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_full_view')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      let filtered = data;

      if (filters.product) {
        filtered = filtered.filter(item => item.product_name === filters.product);
      }

      if (filters.status) {
        filtered = filtered.filter(item => item.status === filters.status);
      }

      setInventory(filtered);
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchInventory();
  }, []);

  return (
    <div className="inventory-tracking">
      <h2>Inventory</h2>

      <div className="filter-section">
        <select
          value={filters.product}
          onChange={e => setFilters({ ...filters, product: e.target.value })}
        >
          <option value="">All Products</option>
          {products.map(p => (
            <option key={p.product_id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="in_transit">In Transit</option>
          <option value="damaged">Damaged</option>
          <option value="quarantined">Quarantined</option>
        </select>

        <button onClick={fetchInventory}>Apply Filters</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Batch ID</th>
              <th>Status</th>
              <th>Batch Quantity</th>
              <th>Inventory Stock</th>
              <th>Barcode</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map(item => (
                <tr key={`${item.inventory_id}-${item.batch_id}`}>
                  <td>{item.product_name}</td>
                  <td>{item.batch_id}</td>
                  <td>{item.status}</td>
                  <td>{item.batch_quantity}</td>
                  <td>{item.stock_quantity}</td>
                  <td>{item.barcode}</td>
                  <td>{new Date(item.last_updated).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>
                  🚫 No inventory data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryTracking;