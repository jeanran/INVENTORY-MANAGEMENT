import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './InventorySummary.css';

const supabaseUrl = 'https://iradphcrwwokdrnhxpnd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const InventorySummary = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const fetchSummary = async () => {
    const { data, error } = await supabase
      .from('inventory_status')
      .select('product_id, name, quantity, stock_status');

    if (error) {
      console.error('Error fetching inventory summary:', error);
      return;
    }

    const totalProducts = data.length; // Unique product IDs in the view
    const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const lowStock = data.filter(item => item.stock_status === 'LOW_STOCK').length;
    const outOfStock = data.filter(item => item.stock_status === 'OUT_OF_STOCK').length;

    setSummary({ totalProducts, totalQuantity, lowStock, outOfStock });
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="inventory-summary">
      <h2>Inventory Summary</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Products in Stock</h3>
          <p>{summary.totalProducts}</p>
        </div>
        <div className="card">
          <h3>Total Stock Quantity</h3>
          <p>{summary.totalQuantity}</p>
        </div>
        <div className="card alert low-stock">
          <h3>Low Stock Alerts</h3>
          <p>{summary.lowStock}</p>
        </div>
        <div className="card alert out-of-stock">
          <h3>Out of Stock Alerts</h3>
          <p>{summary.outOfStock}</p>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
