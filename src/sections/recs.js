import { getState, onStateChange } from '../main.js';
import { CLUSTER_MAP, CLUSTERS } from '../classifier.js';
import {
  YOUTUBE_RECS, BILIBILI_RECS, REDDIT_RECS,
  PODCAST_EN_RECS, PODCAST_ZH_RECS, GAP_CLUSTERS,
} from '../data/recommendations.js';

let activePlatform = 'youtube';

/* ---- URL helpers (deterministic, no LLM-generated URLs) ---- */
function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
function bilibiliSearchUrl(query) {
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
}
function redditUrl(sub) {
  // sub may be "r/Foo" or just "Foo"
  const clean = sub.replace(/^r\//, '');
  return `https://www.reddit.com/r/${encodeURIComponent(clean)}`;
}
function podcastSearchUrl(name) {
  return `https://podcasts.apple.com/search?term=${encodeURIComponent(name)}`;
}
function linkWrap(url, text) {
  return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
}

/** Resolve cluster metadata: prefer dynamic LLM meta, fall back to hardcoded */
function getMeta(id) {
  return getState().clusterMeta?.[id] || CLUSTER_MAP[id] || { id, label: id, emoji: '', color: '#94a3b8' };
}

/** Check if we have LLM-generated recommendations */
function hasLlmRecs() {
  return !!getState().llmRecommendations;
}

export function renderRecs(container) {
  container.innerHTML = `
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h2>Recommendations</h2>
        <p>Cross-platform content suggestions based on your interests</p>
      </div>
      <button class="btn" id="export-recs-btn">Export as Markdown</button>
    </div>
    <div id="llm-recs-badge"></div>
    <div class="platform-tabs" id="platform-tabs">
      <button class="platform-tab active" data-platform="youtube">YouTube</button>
      <button class="platform-tab" data-platform="bilibili">Bilibili</button>
      <button class="platform-tab" data-platform="reddit">Reddit</button>
      <button class="platform-tab" data-platform="podcasts">Podcasts</button>
    </div>
    <div id="recs-content"></div>
  `;

  document.querySelectorAll('.platform-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activePlatform = tab.dataset.platform;
      draw();
    });
  });

  document.getElementById('export-recs-btn').addEventListener('click', exportMarkdown);

  draw();
  onStateChange(draw);
}

function getActiveClusters() {
  const data = getState().data;
  if (!data?.clusters) return [];
  const total = data.totalVideos;
  const filter = getState().activeCluster;

  return data.clusters.filter(c => {
    if (c.id === 'other') return false;
    if (filter && c.id !== filter) return false;
    return c.count >= 20 || (c.count / total) >= 0.005;
  });
}

function getGapClusters() {
  // Only show gap clusters for hardcoded recs
  if (hasLlmRecs()) return [];
  const data = getState().data;
  if (!data?.clusters) return [];
  const active = new Set(getActiveClusters().map(c => c.id));
  return [...GAP_CLUSTERS].filter(id => !active.has(id));
}

function draw() {
  const content = document.getElementById('recs-content');
  const activeClusters = getActiveClusters();

  // Show/hide AI badge
  const badge = document.getElementById('llm-recs-badge');
  if (badge) {
    badge.innerHTML = hasLlmRecs()
      ? '<span class="ai-generated-badge">AI-generated personalized recommendations</span>'
      : '';
  }

  let html = '';

  if (hasLlmRecs()) {
    // Render LLM-generated recommendations
    html = renderLlmRecs(activeClusters);
  } else {
    // Render hardcoded recommendations
    if (activePlatform === 'youtube') {
      html = renderYouTube(activeClusters);
    } else if (activePlatform === 'bilibili') {
      html = renderBilibili(activeClusters);
    } else if (activePlatform === 'reddit') {
      html = renderReddit(activeClusters);
    } else if (activePlatform === 'podcasts') {
      html = renderPodcasts(activeClusters);
    }

    // Gap section
    const gaps = getGapClusters();
    if (gaps.length > 0) {
      html += renderGapSection(gaps);
    }
  }

  content.innerHTML = html;
}

// ============================================================
// LLM-generated recommendation rendering
// ============================================================

function renderLlmRecs(clusters) {
  const llm = getState().llmRecommendations;
  if (!llm) return '';

  if (activePlatform === 'youtube') {
    return clusters.map(c => {
      const recs = llm.youtube?.[c.id];
      if (!recs?.length) return '';
      const meta = getMeta(c.id);
      return `
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${meta.emoji || ''} ${c.label} <small style="color:var(--text-muted);font-weight:400">(${c.count.toLocaleString()} videos)</small></div>
          <div class="rec-grid">
            ${recs.map(r => {
              const name = r.topic || r.name || '';
              const query = r.topic || r.channels || name;
              return `
              <div class="card rec-card">
                <div class="rec-name">${linkWrap(youtubeSearchUrl(query), esc(name))}</div>
                <div class="rec-tagline">${esc(r.channels || r.tagline || '')}</div>
              </div>
            `;}).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  if (activePlatform === 'bilibili') {
    return clusters.map(c => {
      const recs = llm.bilibili?.[c.id];
      if (!recs) return '';
      const meta = getMeta(c.id);
      const crossovers = recs.crossover || [];
      const natives = recs.native || [];
      if (!crossovers.length && !natives.length) return '';
      return `
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${meta.emoji || ''} ${c.label}</div>
          <div class="rec-grid">
            ${crossovers.map(r => `
              <div class="card rec-card">
                <span class="crossover-badge">Crossover</span>
                <div class="rec-name">${linkWrap(bilibiliSearchUrl(r.search || r.name), esc(r.name))}</div>
                <div class="rec-tagline">${esc(r.tagline)}</div>
                ${r.search ? `<div class="rec-meta">Search: ${esc(r.search)}</div>` : ''}
              </div>
            `).join('')}
            ${natives.map(r => `
              <div class="card rec-card">
                <div class="rec-name">${linkWrap(bilibiliSearchUrl(r.search || r.name), esc(r.name))}</div>
                <div class="rec-tagline">${esc(r.tagline)}</div>
                ${r.search ? `<div class="rec-meta">Search: ${esc(r.search)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  if (activePlatform === 'reddit') {
    return clusters.map(c => {
      const recs = llm.reddit?.[c.id];
      if (!recs?.length) return '';
      const meta = getMeta(c.id);
      return `
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${meta.emoji || ''} ${c.label}</div>
          <div class="rec-grid">
            ${recs.map(r => `
              <div class="card rec-card">
                <div class="rec-name">${linkWrap(redditUrl(r.sub), esc(r.sub))}</div>
                <div class="rec-tagline">${esc(r.tagline)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  if (activePlatform === 'podcasts') {
    return clusters.map(c => {
      const en = llm.podcasts_en?.[c.id] || [];
      const zh = llm.podcasts_zh?.[c.id] || [];
      if (!en.length && !zh.length) return '';
      const meta = getMeta(c.id);
      return `
        <div class="rec-cluster-group">
          <div class="rec-cluster-title">${meta.emoji || ''} ${c.label}</div>
          <div class="rec-grid">
            ${en.map(r => `
              <div class="card rec-card">
                <div class="rec-name">${linkWrap(podcastSearchUrl(r.name), esc(r.name))}</div>
                <div class="rec-meta">${esc(r.host)}</div>
                <div class="rec-tagline">${esc(r.tagline)}</div>
              </div>
            `).join('')}
            ${zh.map(r => `
              <div class="card rec-card">
                <span class="crossover-badge" style="background:rgba(236,72,153,0.15);color:#ec4899">\u4E2D\u6587</span>
                <div class="rec-name">${linkWrap(podcastSearchUrl(r.name), esc(r.name))}</div>
                <div class="rec-meta">${esc(r.host)}</div>
                <div class="rec-tagline">${esc(r.tagline)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  return '';
}

// ============================================================
// Hardcoded recommendation rendering (unchanged)
// ============================================================

function renderYouTube(clusters) {
  return clusters.map(c => {
    const recs = YOUTUBE_RECS[c.id];
    if (!recs?.length) return '';
    const meta = getMeta(c.id);
    return `
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${meta.emoji || ''} ${c.label} <small style="color:var(--text-muted);font-weight:400">(${c.count.toLocaleString()} videos)</small></div>
        <div class="rec-grid">
          ${recs.map(r => `
            <div class="card rec-card">
              <div class="rec-name">${linkWrap(youtubeSearchUrl(r.topic), esc(r.topic))}</div>
              <div class="rec-tagline">${esc(r.channels)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderBilibili(clusters) {
  return clusters.map(c => {
    const recs = BILIBILI_RECS[c.id];
    if (!recs) return '';
    const meta = getMeta(c.id);
    const crossovers = recs.crossover || [];
    const natives = recs.native || [];
    const hints = recs.searchHints || [];

    if (!crossovers.length && !natives.length) return '';

    return `
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${meta.emoji || ''} ${c.label}</div>
        <div class="rec-grid">
          ${crossovers.map(r => `
            <div class="card rec-card">
              <span class="crossover-badge">Crossover</span>
              <div class="rec-name">${linkWrap(bilibiliSearchUrl(r.search || r.name), esc(r.name))}</div>
              <div class="rec-tagline">${esc(r.tagline)}</div>
              <div class="rec-meta">Search: ${esc(r.search)}</div>
            </div>
          `).join('')}
          ${natives.map(r => `
            <div class="card rec-card">
              <div class="rec-name">${linkWrap(bilibiliSearchUrl(r.search || r.name), esc(r.name))}</div>
              <div class="rec-tagline">${esc(r.tagline)}</div>
              <div class="rec-meta">Search: ${esc(r.search)}</div>
            </div>
          `).join('')}
        </div>
        ${hints.length ? `
          <div class="search-hints">
            ${hints.map(h => `<span class="search-hint">${esc(h)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderReddit(clusters) {
  return clusters.map(c => {
    const recs = REDDIT_RECS[c.id];
    if (!recs?.length) return '';
    const meta = getMeta(c.id);
    return `
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${meta.emoji || ''} ${c.label}</div>
        <div class="rec-grid">
          ${recs.map(r => `
            <div class="card rec-card">
              <div class="rec-name">${linkWrap(redditUrl(r.sub), esc(r.sub))}</div>
              <div class="rec-tagline">${esc(r.tagline)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderPodcasts(clusters) {
  return clusters.map(c => {
    const en = PODCAST_EN_RECS[c.id] || [];
    const zh = PODCAST_ZH_RECS[c.id] || [];
    if (!en.length && !zh.length) return '';
    const meta = getMeta(c.id);
    return `
      <div class="rec-cluster-group">
        <div class="rec-cluster-title">${meta.emoji || ''} ${c.label}</div>
        <div class="rec-grid">
          ${en.map(r => `
            <div class="card rec-card">
              <div class="rec-name">${linkWrap(podcastSearchUrl(r.name), esc(r.name))}</div>
              <div class="rec-meta">${esc(r.host)}</div>
              <div class="rec-tagline">${esc(r.tagline)}</div>
            </div>
          `).join('')}
          ${zh.map(r => `
            <div class="card rec-card">
              <span class="crossover-badge" style="background:rgba(236,72,153,0.15);color:#ec4899">\u4E2D\u6587</span>
              <div class="rec-name">${linkWrap(podcastSearchUrl(r.name), esc(r.name))}</div>
              <div class="rec-meta">${esc(r.host)}</div>
              <div class="rec-tagline">${esc(r.tagline)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderGapSection(gapIds) {
  const platforms = {
    youtube: YOUTUBE_RECS,
    bilibili: BILIBILI_RECS,
    reddit: REDDIT_RECS,
    podcasts: { ...PODCAST_EN_RECS },
  };

  const recsSource = platforms[activePlatform];
  const cards = gapIds.map(id => {
    const meta = getMeta(id);
    const recs = recsSource[id];
    if (!recs) return '';
    let items = '';
    if (activePlatform === 'bilibili') {
      items = [...(recs.crossover || []), ...(recs.native || [])].map(r =>
        `<div class="card rec-card"><div class="rec-name">${linkWrap(bilibiliSearchUrl(r.search || r.name), esc(r.name))}</div><div class="rec-tagline">${esc(r.tagline)}</div></div>`
      ).join('');
    } else if (activePlatform === 'reddit') {
      items = recs.map(r =>
        `<div class="card rec-card"><div class="rec-name">${linkWrap(redditUrl(r.sub), esc(r.sub))}</div><div class="rec-tagline">${esc(r.tagline)}</div></div>`
      ).join('');
    } else if (activePlatform === 'podcasts') {
      items = recs.map(r =>
        `<div class="card rec-card"><div class="rec-name">${linkWrap(podcastSearchUrl(r.name), esc(r.name))}</div><div class="rec-meta">${esc(r.host)}</div><div class="rec-tagline">${esc(r.tagline)}</div></div>`
      ).join('');
    } else {
      items = recs.map(r =>
        `<div class="card rec-card"><div class="rec-name">${linkWrap(youtubeSearchUrl(r.topic), esc(r.topic))}</div><div class="rec-tagline">${esc(r.channels)}</div></div>`
      ).join('');
    }

    if (!items) return '';
    return `
      <div class="rec-cluster-group">
        <div class="rec-cluster-title" style="color:var(--text-muted)">${meta.emoji || ''} ${meta.label || id} <small>(fresh direction)</small></div>
        <div class="rec-grid">${items}</div>
      </div>
    `;
  }).join('');

  if (!cards) return '';
  return `
    <div class="gap-section">
      <div class="gap-title">Fresh Directions (clusters with little history)</div>
      ${cards}
    </div>
  `;
}

function exportMarkdown() {
  const data = getState().data;
  if (!data) return;

  const activeClusters = getActiveClusters();
  let md = `# YouTube Interest Dashboard - Recommendations\n\n`;
  md += `Total videos: ${data.totalVideos.toLocaleString()}\n`;
  md += `Date range: ${data.dateRange.earliest} to ${data.dateRange.latest}\n\n`;

  if (hasLlmRecs()) {
    md += `> AI-generated personalized recommendations\n\n`;
    const llm = getState().llmRecommendations;

    md += `## YouTube Channels\n\n`;
    activeClusters.forEach(c => {
      const recs = llm.youtube?.[c.id];
      if (!recs?.length) return;
      md += `### ${c.label}\n`;
      recs.forEach(r => {
        const name = r.topic || r.name || '';
        const query = r.topic || r.channels || name;
        md += `- **[${name}](${youtubeSearchUrl(query)})**: ${r.channels || r.tagline || ''}\n`;
      });
      md += '\n';
    });

    md += `## Reddit Subreddits\n\n`;
    activeClusters.forEach(c => {
      const recs = llm.reddit?.[c.id];
      if (!recs?.length) return;
      md += `### ${c.label}\n`;
      recs.forEach(r => { md += `- **[${r.sub}](${redditUrl(r.sub)})**: ${r.tagline}\n`; });
      md += '\n';
    });

    md += `## Podcasts\n\n`;
    activeClusters.forEach(c => {
      const en = llm.podcasts_en?.[c.id] || [];
      const zh = llm.podcasts_zh?.[c.id] || [];
      if (!en.length && !zh.length) return;
      md += `### ${c.label}\n`;
      en.forEach(r => { md += `- **[${r.name}](${podcastSearchUrl(r.name)})** (${r.host}): ${r.tagline}\n`; });
      zh.forEach(r => { md += `- **[${r.name}](${podcastSearchUrl(r.name)})** (${r.host}): ${r.tagline}\n`; });
      md += '\n';
    });
  } else {
    // Hardcoded export
    md += `## YouTube Channels\n\n`;
    activeClusters.forEach(c => {
      const recs = YOUTUBE_RECS[c.id];
      if (!recs?.length) return;
      md += `### ${c.label}\n`;
      recs.forEach(r => { md += `- **[${r.topic}](${youtubeSearchUrl(r.topic)})**: ${r.channels}\n`; });
      md += '\n';
    });

    md += `## Bilibili UP\u4E3B\n\n`;
    activeClusters.forEach(c => {
      const recs = BILIBILI_RECS[c.id];
      if (!recs) return;
      md += `### ${c.label}\n`;
      [...(recs.crossover || []), ...(recs.native || [])].forEach(r => {
        md += `- **[${r.name}](${bilibiliSearchUrl(r.search || r.name)})**: ${r.tagline} (search: ${r.search})\n`;
      });
      md += '\n';
    });

    md += `## Reddit Subreddits\n\n`;
    activeClusters.forEach(c => {
      const recs = REDDIT_RECS[c.id];
      if (!recs?.length) return;
      md += `### ${c.label}\n`;
      recs.forEach(r => { md += `- **[${r.sub}](${redditUrl(r.sub)})**: ${r.tagline}\n`; });
      md += '\n';
    });

    md += `## Podcasts\n\n`;
    activeClusters.forEach(c => {
      const en = PODCAST_EN_RECS[c.id] || [];
      const zh = PODCAST_ZH_RECS[c.id] || [];
      if (!en.length && !zh.length) return;
      md += `### ${c.label}\n`;
      en.forEach(r => { md += `- **[${r.name}](${podcastSearchUrl(r.name)})** (${r.host}): ${r.tagline}\n`; });
      zh.forEach(r => { md += `- **[${r.name}](${podcastSearchUrl(r.name)})** (${r.host}): ${r.tagline}\n`; });
      md += '\n';
    });
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'youtube-recommendations.md';
  a.click();
  URL.revokeObjectURL(url);
}

function esc(s) {
  if (!s) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
