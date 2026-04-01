import React from 'react';
import './Filters.css';

function Filters({
  products,
  selectedProduct,
  onProductChange,
  selectedStartYear,
  onStartYearChange,
  yearRange,
  loading
}) {
  const years = [];
  if (yearRange.min && yearRange.max) {
    for (let year = yearRange.min; year <= yearRange.max; year++) {
      years.push(year);
    }
  }

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="product-select">Product:</label>
        <select
          id="product-select"
          value={selectedProduct}
          onChange={(e) => onProductChange(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select Product --</option>
          {products.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="year-select">Start Year:</label>
        <select
          id="year-select"
          value={selectedStartYear}
          onChange={(e) => onStartYearChange(e.target.value)}
          disabled={loading || years.length === 0}
        >
          <option value="">-- Select Year --</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {yearRange.min && yearRange.max && (
        <div className="year-info">
          Available: {yearRange.min} - {yearRange.max}
          {selectedStartYear && ` (${yearRange.max - parseInt(selectedStartYear) + 1} years)`}
        </div>
      )}
    </div>
  );
}

export default Filters;
