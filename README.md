# YouTube Interest Dashboard

Interactive web dashboard that analyzes your YouTube watch history from Google Takeout exports. Classifies videos into interest clusters, visualizes viewing trends over time, and generates cross-platform content recommendations.

**[Live Demo](https://dragonfly90.github.io/youtube-dashboard/)**

## Features

- **Overview** — Total videos, date range, daily average, unique channels
- **Timeline** — Monthly watch volume bar chart with yearly summaries
- **Clusters** — Doughnut + bar charts breaking down 14 interest categories
- **Channels** — Top 200 channels table, sortable and filterable by cluster
- **Trends** — Rising/fading/stable interest detection with sparklines (90-day vs all-time)
- **Recommendations** — Cross-platform suggestions across YouTube, Bilibili, Reddit, and Podcasts
- **Upload** — Drag-and-drop your own Takeout HTML for personalized analysis (parsed in-browser via Web Worker)
- **Dark/Light theme** toggle

## Interest Clusters

| Cluster | Emoji |
|---------|-------|
| Machine Learning / AI | 🤖 |
| Scientific Computing & Math | 🧮 |
| C++ & Systems Programming | ⚙️ |
| Rust | 🦀 |
| Python Tooling | 🐍 |
| Chinese Pop Music | 🎵 |
| Chinese Variety TV | 📺 |
| Chinese News & Commentary | 📰 |
| Finance & Markets | 📈 |
| Kids / Family | 👶 |
| Cooking | 🍳 |
| Fitness & Health | 💪 |
| Photography | 📷 |
| Travel / Documentaries | ✈️ |

## Tech Stack

- Vanilla JS + [Vite](https://vite.dev/)
- [Chart.js](https://www.chartjs.org/) for visualizations
- Web Workers for non-blocking HTML parsing
- CSS variables for dark/light theming
- Python for data preprocessing

## Getting Started

```bash
# Install dependencies
npm install

# (Optional) Re-generate preloaded data from your Takeout export
python3 scripts/preprocess.py

# Start dev server
npm run dev
```

## Using Your Own Data

1. Go to [Google Takeout](https://takeout.google.com/)
2. Select only **YouTube and YouTube Music** → **History** → **Watch history**
3. Export as HTML format
4. Either:
   - Drop the HTML file onto the upload zone in the dashboard, or
   - Run `python3 scripts/preprocess.py path/to/watch-history.html` to pre-process it

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```
