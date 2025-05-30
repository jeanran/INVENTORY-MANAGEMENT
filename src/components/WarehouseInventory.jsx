import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './WarehouseInventory.css';

// Initialize Supabase client
const supabase = createClient(
  'https://iradphcrwwokdrnhxpnd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWRwaGNyd3dva2Rybmh4cG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI5ODEsImV4cCI6MjA2MjI4ODk4MX0.X1okOgCMPHNh_vufxDnSlENTO99tMDjkSOXMeWawNrU'
);

const WarehouseInventory = () => {
  const [groupedData, setGroupedData] = useState([]);
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
      setLoading(false);
      return;
    }

    console.log('Raw data from Supabase:', data); // Debug: check if data is coming

    // Group data by warehouse ID
    const grouped = {};
    data.forEach(item => {
      const wh_id = item.wh_id;
      const warehouseName = item.warehouses?.name || 'N/A';
      const warehouseLocation = item.warehouses?.location || 'N/A';
      const productName = item.products?.name;

      if (!grouped[wh_id]) {
        grouped[wh_id] = {
          wh_id,
          name: warehouseName,
          location: warehouseLocation,
          products: [],
        };
      }

      if (productName) {
        grouped[wh_id].products.push(productName);
      }
    });

    console.log('Grouped data:', grouped); // Debug: check grouped structure
    setGroupedData(Object.values(grouped));
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
      ) : groupedData.length > 0 ? (
        <div className="card-container">
          {groupedData.map(warehouse => (
            <div key={warehouse.wh_id} className="inventory-card">
              <div className="card-section">
                <span className="card-label">Warehouse</span>
                <span className="card-value">{warehouse.name}</span>
              </div>
              <div className="card-section">
                <span className="card-label">Location</span>
                <span className="card-value">{warehouse.location}</span>
              </div>
              <div className="card-section">
                <span className="card-label">Products</span>
                <ul className="card-value">
                  {warehouse.products.map((product, index) => (
                    <li key={index}>{product}</li>
                  ))}
                </ul>
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