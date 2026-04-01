import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { processData } from './utils/dataProcessor.js';
import { encodeVideo } from './utils/videoEncoder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
console.log(`Using PORT: ${PORT}`);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// In-memory cache for processed data
let dataCache = null;
let dataCacheTimestamp = null;

// Helper: Get or load data
async function getData() {
  // JSON file location - points to your existing data.json
  const jsonPath = path.join(__dirname, '..', '..', 'Years', 'data.json');
  
  // Return cached data if available
  if (dataCache) {
    console.log('Using cached data');
    return dataCache;
  }
  
  // Check if file exists
  if (!fs.existsSync(jsonPath)) {
    console.error(`Data file not found at: ${jsonPath}`);
    throw new Error(`Data file not found: ${jsonPath}\n\nExpected location: Instagram Page/Productions/Years/data.json`);
  }
  
  console.log(`Loading data from ${jsonPath}...`);
  dataCache = await processData(jsonPath);
  dataCacheTimestamp = Date.now();
  console.log('Data loaded and cached');
  return dataCache;
}

// API Routes

// Get all unique products
app.get('/api/products', async (req, res) => {
  try {
    const data = await getData();
    res.json(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products: ' + error.message });
  }
});

// Get filtered data for a specific product and year range
app.get('/api/data', async (req, res) => {
  try {
    const { product, startYear, endYear } = req.query;
    
    if (!product) {
      return res.status(400).json({ error: 'Product parameter required' });
    }
    
    const data = await getData();
    
    // Get years available for this product
    const years = data.yearsByProduct[product] || [];
    
    if (years.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const start = startYear ? parseInt(startYear) : Math.min(...years);
    const end = endYear ? parseInt(endYear) : Math.max(...years);
    
    // Get top 10 for each year
    const result = {};
    for (let year = start; year <= end; year++) {
      if (data.dataByProductYear[product] && data.dataByProductYear[product][year]) {
        result[year] = data.dataByProductYear[product][year];
      }
    }
    
    res.json({
      product,
      startYear: start,
      endYear: end,
      availableYears: years,
      data: result
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data: ' + error.message });
  }
});

// Get year range for a product
app.get('/api/year-range/:product', async (req, res) => {
  try {
    const { product } = req.params;
    const data = await getData();
    
    const years = data.yearsByProduct[product] || [];
    if (years.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      product,
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
      yearsAvailable: years.length
    });
  } catch (error) {
    console.error('Error fetching year range:', error);
    res.status(500).json({ error: 'Failed to fetch year range: ' + error.message });
  }
});

// POST: Submit canvas frames for video encoding
app.post('/api/encode-video', async (req, res) => {
  try {
    const { frames, fps = 30, product, startYear } = req.body;
    
    if (!frames || frames.length === 0) {
      return res.status(400).json({ error: 'No frames provided' });
    }
    
    const outputFilename = `race_${product.replace(/\s+/g, '_')}_${startYear}_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'exports', outputFilename);
    
    // Create exports directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'exports'))) {
      fs.mkdirSync(path.join(__dirname, 'exports'), { recursive: true });
    }
    
    // Encode video
    await encodeVideo(frames, outputPath, fps);
    
    res.json({
      success: true,
      filename: outputFilename,
      downloadUrl: `/api/download-video/${outputFilename}`
    });
  } catch (error) {
    console.error('Error encoding video:', error);
    res.status(500).json({ error: 'Failed to encode video: ' + error.message });
  }
});

// GET: Download encoded video
app.get('/api/download-video/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'exports', filename);
    
    // Security: Prevent path traversal
    if (!filepath.startsWith(path.join(__dirname, 'exports'))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(filepath, filename, (err) => {
      if (err) console.error('Download error:', err);
      // Optionally delete file after download
      // fs.unlink(filepath, () => {});
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📂 Data file location: Instagram Page/Productions/Years/data.json`);
  console.log('');
});

