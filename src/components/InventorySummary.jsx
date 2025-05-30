import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Summary.css';

const InventorySummary = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [chartData, setChartData] = useState([]);

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

      // Generate random chart data for the last 7 days
      const today = new Date();
      const generated = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));

        return {
          date: date.toLocaleDateString('en-US'),
          totalProducts: Math.floor(Math.random() * 50 + 20),
          totalQuantity: Math.floor(Math.random() * 1000 + 500),
          lowStock: Math.floor(Math.random() * 10),
          outOfStock: Math.floor(Math.random() * 5),
        };
      });

      setChartData(generated);
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

      {/* Line Chart with Random Data */}
      <div className="chart-container">
        <h3>Inventory Trends </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalProducts" stroke="#4caf50" name="Total Products" />
            <Line type="monotone" dataKey="totalQuantity" stroke="#007bff" name="Total Quantity" />
            <Line type="monotone" dataKey="lowStock" stroke="#ffc107" name="Low Stock" />
            <Line type="monotone" dataKey="outOfStock" stroke="#dc3545" name="Out of Stock" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventorySummary;
