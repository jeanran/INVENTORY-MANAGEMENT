import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './InventoryTracking.css';

const supabaseUrl = 'https://iradphcrwwokdrnhxpnd.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const InventoryTracking = () => {
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    product: '',
    warehouse: '',
    barcode: '',
    status: '',
  });

  const fetchInventory = async () => {
    let query = supabase
      .from('inventory')
      .select(`
        inventory_id,
        stock_quantity,
        barcode,
        status,
        last_updated,
        products ( name ),
        warehouses ( name )
      `)
      .order('last_updated', { ascending: false });

    // Apply filters dynamically
    if (filters.barcode) {
      query = query.eq('barcode', filters.barcode);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
    } else {
      let filteredData = data;

      // Filter by product name if provided
      if (filters.product) {
        filteredData = filteredData.filter(item =>
          item.products?.name?.toLowerCase().includes(filters.product.toLowerCase())
        );
      }

      // Filter by warehouse name if provided
      if (filters.warehouse) {
        filteredData = filteredData.filter(item =>
          item.warehouses?.name?.toLowerCase().includes(filters.warehouse.toLowerCase())
        );
      }

      setInventory(filteredData.map(item => ({
        inventory_id: item.inventory_id,
        product: item.products?.name ?? 'N/A',
        warehouse: item.warehouses?.name ?? 'N/A',
        quantity: item.stock_quantity,
        barcode: item.barcode,
        status: item.status,
        last_updated: item.last_updated,
      })));
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="inventory-tracking">
      <h2>Inventory Tracking</h2>
      <div className="filter-section">
        <div className="input-group">
          <input
            id="productInput"
            type="text"
            placeholder="Search by Product"
            value={filters.product}
            onChange={e => setFilters({ ...filters, product: e.target.value })}
          />
        </div>
        <div className="input-group">
          <input
            id="warehouseInput"
            type="text"
            placeholder="Search by Warehouse"
            value={filters.warehouse}
            onChange={e => setFilters({ ...filters, warehouse: e.target.value })}
          />
        </div>
        <div className="input-group">
          <input
            id="barcodeInput"
            type="text"
            placeholder="Search by Barcode"
            value={filters.barcode}
            onChange={e => setFilters({ ...filters, barcode: e.target.value })}
          />
        </div>
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="in_transit">In Transit</option>
          <option value="damaged">Damaged</option>
        </select>
        <button onClick={fetchInventory}>Apply Filters</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Barcode</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.inventory_id}>
              <td>{item.product}</td>
              <td>{item.warehouse}</td>
              <td>{item.quantity}</td>
              <td>{item.barcode}</td>
              <td>{item.status}</td>
              <td>{new Date(item.last_updated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTracking;
