# 🚀 QUICK START GUIDE - VANILLA HTML/CSS/JS

Your **Production Racing Visualizer** is ready! Much simpler now - uses your existing data.json file.

## Prerequisites

- ✅ Node.js (v14+) - [Download](https://nodejs.org/)
- ✅ ffmpeg - [Download](https://ffmpeg.org/download.html) (for video export)
  - Windows: Extract and add to PATH
  - Mac: `brew install ffmpeg`
  - Linux: `sudo apt-get install ffmpeg`

## Step 1: Backend Setup (One time)

```powershell
cd production-race-visualizer\backend
npm install
```

## Step 2: Start Backend (Terminal 1)

```powershell
cd production-race-visualizer\backend
npm start
```

You should see:
```
✅ Server running on http://localhost:5000
📂 Data file location: Instagram Page/Productions/Years/data.json
```

## Step 3: Start Frontend (Terminal 2)

```powershell
cd production-race-visualizer\frontend
npm start
```

You should see:
```
✅ Frontend server running on http://localhost:3000
```

**Open browser to:** http://localhost:3000

## Step 4: Use It!

1. **Select Product** - dropdown shows all products from data.json
2. **Select Start Year** - year range shows for that product
3. **Click Play** ▶ - watch animation (0.5s per year)
4. **Click Export Video** 💾 - downloads MP4

---

## 🎯 What's Simple Now

| Part | Status |
|------|--------|
| Data file | ✅ Uses your existing `data.json` |
| CSV files | ❌ Not needed |
| Data preparation | ✅ Auto-detected |
| Frontend setup | ✅ Single HTML file |
| Backend setup | ✅ `npm install` once |

---

## 🐛 Troubleshooting

### "Failed to load products"
1. Check backend is running (Terminal 1)
2. Open http://localhost:5000/api/health in browser
   - Should show: `{"status":"ok","timestamp":"..."}`
   
If it fails, backend isn't running.

### Backend says "Data file not found"
- Backend looks for: `Instagram Page/Productions/Years/data.json`
- Make sure your data.json is in that location
- Check exact path in error message

### "NetworkError when attempting to fetch"
- Backend not running on port 5000
- Browser network blocked (check F12 > Network tab)
- Check firewall/antivirus blocking localhost

### Video export fails
- Make sure ffmpeg is installed
- Try shorter year range first
- Check backend console for ffmpeg errors

---

## 📁 File Locations

```
c:\Users\Korisnik\Desktop\Projekti\Instagram Page\
├── Productions\
│   ├── Years\
│   │   └── data.json          ← Backend reads this
│   ├── 4_year_by_year.ipynb
│   └── production-race-visualizer\
│       ├── frontend\
│       │   ├── index.html
│       │   └── server.js
│       └── backend\
│           ├── index.js
│           └── utils\
```

---

## ⚙️ Customization

### Change animation speed (milliseconds per year):
Edit `frontend/index.html`, find line ~560:
```javascript
}, 500);  // 500 = 0.5 sec per year. Try 1000 for 1 second per year
```

### Change video resolution:
Find line ~470:
```javascript
canvas.width = 1920;   // 1280 for 720p
canvas.height = 1080;  // 720 for 720p
```

### Change backend API port:
Edit `backend/index.js`, line 13:
```javascript
const PORT = process.env.PORT || 5000;  // Change 5000 to something else
```

Then update `frontend/index.html` line 454:
```javascript
const API_URL = 'http://localhost:5000';  // Update to new port
```

---

## 🎯 Next Steps

1. ✅ Run backend: `npm start` (Terminal 1)
2. ✅ Run frontend: `npm start` (Terminal 2)
3. ✅ Open http://localhost:3000
4. ✅ Select product and watch the race!

---

**That's it! No CSV, no complexity.** 🏁

