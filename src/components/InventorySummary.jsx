import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Summary.css';

const InventorySummary = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('product_id, stock_quantity');

      if (error) throw error;
      if (!data) return;

      const totalProducts = new Set(data.map(item => item.product_id)).size;
      const totalQuantity = data.reduce((sum, item) => sum + (item.stock_quantity || 0), 0);
      const lowStock = data.filter(item => item.stock_quantity > 0 && item.stock_quantity <= 50).length;
      const outOfStock = data.filter(item => item.stock_quantity === 0).length;

      setSummary({ totalProducts, totalQuantity, lowStock, outOfStock });
    } catch (err) {
      console.error('Error fetching summary:', err.message);
    }
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
