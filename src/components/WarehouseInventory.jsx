import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './WarehouseInventory.css';

const supabase = createClient(
  'https://iradphcrwwokdrnhxpnd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
);

const WarehouseInventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWarehouseInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('warehouse_products')
      .select(`
        wh_id,
        warehouses (
          name,
          location
        ),
        products (
          name
        )
      `)
      .order('wh_id', { ascending: true });

    if (error) {
      console.error('Error fetching warehouse inventory:', error);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouseInventory();
  }, []);

  return (
    <div className="warehouse-inventory">
  <h2>Warehouse Inventory</h2>
  {loading ? (
    <p>Loading...</p>
  ) : data.length > 0 ? (
    <div className="card-container">
      {data.map(item => (
        <div key={item.wh_id} className="inventory-card">
          <div className="card-section">
            <span className="card-label">Warehouse</span>
            <span className="card-value">{item.warehouses?.name || 'N/A'}</span>
          </div>
          <div className="card-section">
            <span className="card-label">Location</span>
            <span className="card-value">{item.warehouses?.location || 'N/A'}</span>
          </div>
          <div className="card-section">
            <span className="card-label">Product</span>
            <span className="card-value">{item.products?.name || 'N/A'}</span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p style={{ color: 'red' }}>🚫 No warehouse inventory data found.</p>
  )}
</div>
  );
};

export default WarehouseInventory;
