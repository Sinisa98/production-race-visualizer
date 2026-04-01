import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Process data.json into optimized format for API queries
 * 
 * Assumes data.json has structure:
 * {
 *   "1": { product: "...", year: ..., area: "...", value: ... },
 *   "2": { ... }
 * }
 */

export async function processData(jsonPath) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Loading data from: ${jsonPath}`);
      
      const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      
      console.log(`Parsed JSON, processing ${Object.keys(rawData).length} entries...`);
      
      const products = new Set();
      const yearsByProduct = {};
      const dataByProductYear = {};
      
      // Process each entry
      for (const [id, entry] of Object.entries(rawData)) {
        if (!entry || typeof entry !== 'object') continue;
        
        // Handle different field names
        const product = entry.product || entry.Item || entry.item || entry.name;
        const year = entry.year || entry.Year || entry.y;
        const area = entry.area || entry.Area || entry.country || entry.region;
        let value = entry.value || entry.Value || entry.v || entry.production;
        
        if (!product || !year || !area || value === null || value === undefined) continue;
        
        value = parseFloat(value);
        if (isNaN(value)) continue;
        
        products.add(product);
        
        // Initialize structures
        if (!yearsByProduct[product]) {
          yearsByProduct[product] = new Set();
        }
        if (!dataByProductYear[product]) {
          dataByProductYear[product] = {};
        }
        
        yearsByProduct[product].add(year);
        
        // Store data point
        if (!dataByProductYear[product][year]) {
          dataByProductYear[product][year] = [];
        }
        
        dataByProductYear[product][year].push({
          area,
          value
        });
      }
      
      console.log('Organizing data...');
      
      // Sort years and get top 10 per year
      const processed = {
        products: Array.from(products).sort(),
        yearsByProduct: {},
        dataByProductYear: {}
      };
      
      for (const product of Object.keys(yearsByProduct)) {
        processed.yearsByProduct[product] = Array.from(yearsByProduct[product])
          .sort((a, b) => a - b);
        
        processed.dataByProductYear[product] = {};
        for (const year of processed.yearsByProduct[product]) {
          // Sort by value and get top 10
          let yearData = dataByProductYear[product][year]
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
          
          processed.dataByProductYear[product][year] = yearData;
        }
      }
      
      console.log(`✅ Processed ${processed.products.length} unique products`);
      if (processed.products.length > 0) {
        console.log(`   Sample: ${processed.products.slice(0, 5).join(', ')}`);
      }
      
      resolve(processed);
    } catch (error) {
      console.error('Error processing data:', error);
      reject(error);
    }
  });
}
