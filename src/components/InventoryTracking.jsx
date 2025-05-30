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
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({
    product: '',
    warehouse: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch filter options
  const fetchFilters = async () => {
    const { data: productList } = await supabase.from('products').select('product_id, name');
    const { data: warehouseList } = await supabase.from('warehouses').select('warehouse_id, name, location');
    setProducts(productList || []);
    setWarehouses(warehouseList || []);
  };

  // Fetch inventory with filters
  const fetchInventory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('inventory')
        .select(`
          inventory_id,
          stock_quantity,
          barcode,
          status,
          last_updated,
          products:product_id (name),
          warehouses:warehouse_id (name, location)
        `)
        .order('last_updated', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data;

      if (filters.product) {
        filtered = filtered.filter(item => item.products?.name === filters.product);
      }
      if (filters.warehouse) {
        filtered = filtered.filter(item => item.warehouses?.name === filters.warehouse);
      }

      setInventory(
        filtered.map(item => ({
          id: item.inventory_id,
          product: item.products?.name || 'N/A',
          warehouse: item.warehouses?.name || 'N/A',
          location: item.warehouses?.location || 'N/A',
          quantity: item.stock_quantity,
          barcode: item.barcode,
          status: item.status,
          lastUpdated: new Date(item.last_updated).toLocaleString()
        }))
      );
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
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
          value={filters.warehouse}
          onChange={e => setFilters({ ...filters, warehouse: e.target.value })}
        >
          <option value="">All Warehouses</option>
          {warehouses.map(w => (
            <option key={w.warehouse_id} value={w.name}>
              {w.name} ({w.location})
            </option>
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
              <th>Warehouse</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Barcode</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.product}</td>
                  <td>{item.warehouse}</td>
                  <td>{item.location}</td>
                  <td>{item.quantity}</td>
                  <td>{item.barcode}</td>
                  <td>{item.status}</td>
                  <td>{item.lastUpdated}</td>
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
