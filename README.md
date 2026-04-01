# Production Racing Visualizer

An interactive web application that visualizes production data as a racing bar chart. Watch countries compete year-by-year to see who produced the most of a selected commodity.

## 🎯 Features

- **Interactive Filters**: Select product and start year
- **Animated Racing Chart**: Smooth year-by-year transitions (0.5s per year)
- **Video Export**: Save the animation as 1080p MP4 video
- **Responsive Design**: Works on desktop and mobile browsers
- **Real-time Playback**: Watch the race unfold with Play/Pause controls

## 🏗️ Tech Stack

- **Frontend**: React 18, D3.js, Canvas API
- **Backend**: Node.js, Express.js, ffmpeg
- **Data**: JSON (structured as product → year → areas)

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- ffmpeg (for video encoding) - [Download](https://ffmpeg.org/download.html)

### Installing ffmpeg (Windows)

1. Download ffmpeg from https://ffmpeg.org/download.html
2. Extract to a directory (e.g., `C:\ffmpeg`)
3. Add to PATH environment variable OR specify in backend code

### Installing ffmpeg (Mac)

```bash
brew install ffmpeg
```

### Installing ffmpeg (Linux)

```bash
sudo apt-get install ffmpeg
```

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:5000`

### 2. Setup Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will open at `http://localhost:3000`

## 📊 Data Format

Your `data.json` should have the following structure:

```json
{
  "1": {
    "product": "Almonds",
    "year": 2000,
    "area": "United States",
    "value": 150000
  },
  "2": {
    "product": "Almonds",
    "year": 2000,
    "area": "Spain",
    "value": 85000
  },
  ...
}
```

**Required fields:**
- `product` or `name` or `item` - Product name
- `year` or `y` - Production year
- `area` or `country` or `region` - Geographic area
- `value` or `v` or `production` - Production quantity

## 🎮 Usage

1. **Select Product**: Choose from dropdown (auto-populated from data)
2. **Select Start Year**: Choose starting year for the race
3. **Play**: Watch the animation (0.5s per year)
4. **Export**: Click "Export Video" to save as MP4

## 📁 Project Structure

```
production-race-visualizer/
├── backend/
│   ├── index.js              # Express server
│   ├── package.json
│   └── utils/
│       ├── dataProcessor.js  # Parse and optimize data
│       └── videoEncoder.js   # ffmpeg video encoding
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── Filters.js       # Product & year selection
│   │   │   ├── RacingChart.js   # Canvas chart rendering
│   │   │   └── *.css
│   │   └── utils/
│   │       └── videoExport.js   # Frame capture & export
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## 🔧 Configuration

### Backend (backend/index.js)

- `PORT`: Default 5000
- `data.json` path: `../Years/data.json`
- Video exports: Saved to `backend/exports/`

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
```

## 🎬 Video Export Details

- **Resolution**: 1080p (1920x1080)
- **Codec**: H.264
- **Format**: MP4
- **Frame Rate**: 30 fps
- **Duration**: 0.5s per year (60 years ≈ 30 seconds)

## 🐛 Troubleshooting

### "Failed to load products"
- Ensure backend is running on port 5000
- Check data.json path in backend/index.js
- Verify data.json structure (see Data Format section)

### "ffmpeg not found"
- Install ffmpeg and add to PATH
- Or specify absolute ffmpeg path in backend/utils/videoEncoder.js

### Video export not working
- Check browser console for errors
- Ensure backend `/api/encode-video` endpoint is accessible
- Verify ffmpeg installation

### Canvas not displaying
- Check browser console for errors
- Ensure canvas dimensions are set (1920x1080)
- Verify year data is returning from API

## 📈 Performance Notes

- Data loading: ~2-5 seconds for 123MB+ JSON files
- Animation: Smooth at 30fps on modern browsers
- Video encoding: May take 30 seconds - 2+ minutes depending on year range
- Memory: Frontend uses ~100MB for full dataset

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Outputs to frontend/build/

# Backend
# Already production-ready with Node.js
```

### Docker (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/ .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 API Endpoints

### `/api/products` (GET)
Returns all unique product names

**Response:**
```json
["Almonds", "Wheat", "Rice", ...]
```

### `/api/data` (GET)
Get production data for a product

**Query params:**
- `product` (required): Product name
- `startYear` (optional): Start year
- `endYear` (optional): End year

**Response:**
```json
{
  "product": "Almonds",
  "startYear": 2000,
  "endYear": 2020,
  "data": {
    "2000": [
      { "area": "USA", "value": 150000 },
      ...
    ]
  }
}
```

### `/api/year-range/:product` (GET)
Get available year range for a product

### `/api/encode-video` (POST)
Submit frames for video encoding

### `/api/download-video/:filename` (GET)
Download encoded video file

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Please create an issue or pull request.

## 📞 Support

For issues or questions, check the troubleshooting section or refer to component comments in source code.

---

**Happy Racing! 🏁**
