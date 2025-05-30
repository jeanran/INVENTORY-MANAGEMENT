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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');

  const fetchWarehouseInventory = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('warehouse_products')
      .select(`
        wh_id,
        product_id,
        warehouses (
          name,
          location
        ),
        products (
          name,
          stock_quantity
        )
      `)
      .order('wh_id', { ascending: true });

    if (error) {
      console.error('Error fetching warehouse inventory:', error);
      setLoading(false);
      return;
    }

    const grouped = {};
    data.forEach(item => {
      const warehouseName = item.warehouses?.name || 'N/A';
      const warehouseLocation = item.warehouses?.location || 'N/A';
      const productName = item.products?.name;
      const productId = item.product_id;
      const stockQuantity = item.products?.stock_quantity || 0;

      if (!grouped[warehouseName]) {
        grouped[warehouseName] = {
          name: warehouseName,
          location: warehouseLocation,
          products: [],
        };
      }

      if (productName && productId) {
        grouped[warehouseName].products.push({
          name: productName,
          id: productId,
          stock_quantity: stockQuantity,
        });
      }
    });

    setGroupedData(Object.values(grouped));
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouseInventory();
  }, []);

  const handleProductClick = (warehouseName, productId) => {
    const key = `${warehouseName}-${productId}`;
    setSelectedProduct(prev => (prev === key ? null : key));
  };

  const warehouseNames = ['All', ...new Set(groupedData.map(w => w.name))];

  return (
    <div className="warehouse-inventory">
      <h2>Warehouse Inventory</h2>

      {loading ? (
        <p>Loading...</p>
      ) : groupedData.length > 0 ? (
        <>
          <div className="filter-dropdown">
            <label htmlFor="warehouseFilter">Filter by Warehouse:</label>
            <select
              id="warehouseFilter"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              {warehouseNames.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="card-container">
            {groupedData
              .filter(w => selectedWarehouse === 'All' || w.name === selectedWarehouse)
              .map((warehouse, index) => (
                <div key={index} className="inventory-card">
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
                    <ul className="product-list">
                      {warehouse.products.map((product) => {
                        const key = `${warehouse.name}-${product.id}`;
                        return (
                          <li
                            key={key}
                            onClick={() => handleProductClick(warehouse.name, product.id)}
                            className={`product-item ${selectedProduct === key ? 'selected' : ''}`}
                          >
                            <span className="product-name">{product.name}</span>
                            {selectedProduct === key && (
                              <span className="product-quantity">
                                Stock: {product.stock_quantity}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p style={{ color: 'red' }}>🚫 No warehouse inventory data found.</p>
      )}
    </div>
  );
};

export default WarehouseInventory;
