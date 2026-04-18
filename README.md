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
- **AI-Powered Classification** — Optional local LLM integration (Gemma 4 via Ollama) discovers personalized interest clusters and generates tailored recommendations
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
- [Ollama](https://ollama.com/) + Gemma 4 for optional local LLM classification
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

## Local AI Setup (Optional)

When Ollama is running locally, the dashboard automatically detects it and offers AI-powered classification for uploaded data. This discovers personalized interest clusters (instead of the hardcoded 14) and generates tailored cross-platform recommendations.

1. Install [Ollama](https://ollama.com/)
2. Pull the Gemma 4 model:
   ```bash
   ollama pull gemma4
   ```
3. Make sure Ollama is running (it starts automatically after install)
4. Start the dashboard with `npm run dev` — you'll see a green "Local AI available" indicator
5. Upload your Takeout HTML — the AI will:
   - Discover 10-15 interest clusters from ~200 sample titles (~30-60s)
   - Classify all videos using those clusters (instant)
   - Generate personalized recommendations (~30-60s)

**Graceful degradation:** If Ollama is not running (or on GitHub Pages), the dashboard falls back to keyword-based classification with no errors.

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```
