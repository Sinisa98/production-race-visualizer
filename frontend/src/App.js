import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Filters from './components/Filters';
import RacingChart from './components/RacingChart';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedStartYear, setSelectedStartYear] = useState('');
  const [yearRange, setYearRange] = useState({ min: null, max: null });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  // Fetch year range when product changes
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchYearRange = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/year-range/${encodeURIComponent(selectedProduct)}`
        );
        setYearRange({
          min: response.data.minYear,
          max: response.data.maxYear
        });
        setSelectedStartYear(response.data.minYear.toString());
      } catch (err) {
        console.error('Error fetching year range:', err);
        setError('Failed to load year range');
      }
    };
    fetchYearRange();
  }, [selectedProduct]);

  // Fetch data when product or start year changes
  useEffect(() => {
    if (!selectedProduct || !selectedStartYear || !yearRange.max) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_URL}/api/data`, {
          params: {
            product: selectedProduct,
            startYear: selectedStartYear,
            endYear: yearRange.max
          }
        });
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProduct, selectedStartYear, yearRange.max]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Production Racing Visualizer</h1>
        <p>Watch countries race for highest production year by year</p>
      </header>

      <main className="App-main">
        <Filters
          products={products}
          selectedProduct={selectedProduct}
          onProductChange={setSelectedProduct}
          selectedStartYear={selectedStartYear}
          onStartYearChange={setSelectedStartYear}
          yearRange={yearRange}
          loading={loading}
        />

        {error && <div className="error-message">{error}</div>}

        {data && (
          <RacingChart
            data={data}
            product={selectedProduct}
            startYear={parseInt(selectedStartYear)}
          />
        )}

        {loading && <div className="loading">Loading data...</div>}

        {!data && !loading && selectedProduct && (
          <div className="info">Select filters above to see the race</div>
        )}
      </main>
    </div>
  );
}

export default App;
