/**
 * Web Worker: parses Instagram data export HTML files,
 * anonymizes all usernames, and aggregates interaction stats.
 *
 * Expects: { files: [{ name, html }] }
 * Posts:   { type: 'progress', pct, msg }
 *          { type: 'done', result }
 *          { type: 'error', msg }
 */

// ── Anonymization ──────────────────────────────────────────────
const anonMap = new Map();
let anonCounter = 0;

function anonLabel(n) {
  // 0→A, 1→B, ..., 25→Z, 26→AA, 27→AB, ...
  let label = '';
  let i = n;
  do {
    label = String.fromCharCode(65 + (i % 26)) + label;
    i = Math.floor(i / 26) - 1;
  } while (i >= 0);
  return 'Account ' + label;
}

function anonymize(username) {
  if (!username) return null;
  const key = username.trim().toLowerCase();
  if (!key) return null;
  if (!anonMap.has(key)) {
    anonMap.set(key, anonLabel(anonCounter++));
  }
  return anonMap.get(key);
}

// ── HTML helpers ───────────────────────────────────────────────
function cleanHtml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// ── Date parsing ───────────────────────────────────────────────
// Instagram exports use format like "Month DD, YYYY H:MM am/pm" (12-hour)
// e.g. "Jun 20, 2024 3:45 pm" or "Dec 1, 2016 12:00 am"
const MONTH_MAP = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const IG_DATE_RE = /([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(am|pm)/i;

function parseDate(dateStr) {
  const m = IG_DATE_RE.exec(dateStr);
  if (!m) return null;
  let h = parseInt(m[4], 10);
  const ampm = m[6].toLowerCase();
  if (ampm === 'pm' && h !== 12) h += 12;
  if (ampm === 'am' && h === 12) h = 0;
  return new Date(+m[3], MONTH_MAP[m[1]] ?? 0, +m[2], h, +m[5]);
}

// ── File type detection ────────────────────────────────────────
const FILE_TYPES = {
  'liked_posts':      { label: 'Liked Posts',      key: 'like' },
  'story_likes':      { label: 'Story Likes',      key: 'story_like' },
  'stories':          { label: 'Stories Viewed',    key: 'story_view' },
  'posts_viewed':     { label: 'Posts Viewed',      key: 'post_view' },
  'videos_watched':   { label: 'Videos Watched',   key: 'video_watch' },
  'reels':            { label: 'Reels',             key: 'reel' },
  'comments':         { label: 'Comments',          key: 'comment' },
  'your_posts':       { label: 'Your Posts',        key: 'your_post' },
  'threads':          { label: 'Threads Viewed',    key: 'thread_view' },
  'followers':        { label: 'Followers',         key: 'follower' },
  'following':        { label: 'Following',         key: 'following' },
};

function detectFileType(html) {
  // Try <title> tag first
  const titleMatch = /<title>(.*?)<\/title>/i.exec(html);
  const title = titleMatch ? titleMatch[1].toLowerCase() : '';

  if (title.includes('liked posts') || title.includes('liked_posts')) return 'liked_posts';
  if (title.includes('story likes') || title.includes('story_likes')) return 'story_likes';
  if (title.includes('stories') && !title.includes('likes')) return 'stories';
  if (title.includes('posts viewed') || title.includes('posts_viewed')) return 'posts_viewed';
  if (title.includes('videos watched') || title.includes('videos_watched')) return 'videos_watched';
  if (title.includes('reels')) return 'reels';
  if (title.includes('comments') || title.includes('comment')) return 'comments';
  if (title.includes('your posts') || title.includes('your_posts')) return 'your_posts';
  if (title.includes('threads')) return 'threads';
  if (title.includes('followers') && !title.includes('following')) return 'followers';
  if (title.includes('following')) return 'following';

  // Fallback: check filename-like patterns in the HTML or guess from content
  const lowerHtml = html.substring(0, 2000).toLowerCase();
  if (lowerHtml.includes('liked posts')) return 'liked_posts';
  if (lowerHtml.includes('story likes')) return 'story_likes';
  if (lowerHtml.includes('stories')) return 'stories';
  if (lowerHtml.includes('reels')) return 'reels';
  if (lowerHtml.includes('threads')) return 'threads';
  if (lowerHtml.includes('followers')) return 'followers';
  if (lowerHtml.includes('following')) return 'following';
  if (lowerHtml.includes('comments')) return 'comments';

  return null;
}

// ── Entry parsing ──────────────────────────────────────────────
// Instagram HTML export entries are separated by divs with specific classes.
// Each entry block uses class="pam _3-95 _2ph- _a6-g uiBoxWhite noborder"
const ENTRY_SPLITTER = 'pam _3-95 _2ph- _a6-g uiBoxWhite noborder';

// Owner/username extraction from table rows
// <td class="_a6_q">Username</td><td class="_2piu _a6_r">VALUE</td>
const USERNAME_RE = /<td[^>]*class="[^"]*_a6_q[^"]*"[^>]*>\s*(?:Username|Account)\s*<\/td>\s*<td[^>]*class="[^"]*_a6_r[^"]*"[^>]*>(.*?)<\/td>/gi;

// Timestamp: class="_3-94 _a6-o">DATETIME</div>
const TIMESTAMP_RE = /<div[^>]*class="[^"]*_3-94 _a6-o[^"]*"[^>]*>(.*?)<\/div>/gi;

// URLs (to strip — could identify accounts)
const IG_URL_RE = /https?:\/\/(?:www\.)?instagram\.com\/[^\s<"']*/g;

function parseEntries(html, fileType) {
  const entries = [];

  // Split on entry boundaries
  const parts = html.split(ENTRY_SPLITTER);
  // First part is header/preamble, skip it
  for (let i = 1; i < parts.length; i++) {
    const block = parts[i];

    // Extract timestamp
    TIMESTAMP_RE.lastIndex = 0;
    const tsMatch = TIMESTAMP_RE.exec(block);
    const dateStr = tsMatch ? cleanHtml(tsMatch[1]) : null;
    const dt = dateStr ? parseDate(dateStr) : null;

    // Extract username(s)
    USERNAME_RE.lastIndex = 0;
    let usernameMatch;
    const usernames = [];
    while ((usernameMatch = USERNAME_RE.exec(block)) !== null) {
      const raw = cleanHtml(usernameMatch[1]);
      if (raw) usernames.push(raw);
    }

    // For follower/following lists, the username might just be the text content
    if (usernames.length === 0 && (fileType === 'followers' || fileType === 'following')) {
      // Try to extract from plain link or text
      const linkMatch = /<a[^>]*>(.*?)<\/a>/i.exec(block);
      if (linkMatch) {
        const raw = cleanHtml(linkMatch[1]);
        if (raw) usernames.push(raw);
      }
    }

    entries.push({
      dt: dt ? dt.getTime() : null,
      usernames,
      type: fileType,
    });
  }

  return entries;
}

// ── Main handler ───────────────────────────────────────────────
self.onmessage = function (e) {
  try {
    const { files } = e.data;
    if (!files || files.length === 0) {
      self.postMessage({ type: 'error', msg: 'No files provided.' });
      return;
    }

    // Reset anonymization state for each run
    anonMap.clear();
    anonCounter = 0;

    self.postMessage({ type: 'progress', pct: 0, msg: 'Reading Instagram files...' });

    const allEntries = [];
    let followerCount = 0;
    let followingCount = 0;
    const typeCounts = {};

    for (let fi = 0; fi < files.length; fi++) {
      const file = files[fi];
      const pct = Math.round(((fi + 1) / files.length) * 50);
      self.postMessage({
        type: 'progress',
        pct,
        msg: `Parsing file ${fi + 1} of ${files.length}: ${file.name}`,
      });

      const fileType = detectFileType(file.html);
      if (!fileType) continue; // Unknown file type, skip

      if (fileType === 'followers' || fileType === 'following') {
        // Count entries for follower/following
        const entries = parseEntries(file.html, fileType);
        if (fileType === 'followers') followerCount = entries.length;
        else followingCount = entries.length;

        // Also anonymize and store the usernames
        for (const entry of entries) {
          for (const u of entry.usernames) {
            anonymize(u);
          }
        }
        continue;
      }

      const entries = parseEntries(file.html, fileType);
      const typeInfo = FILE_TYPES[fileType];
      const key = typeInfo ? typeInfo.key : fileType;
      typeCounts[key] = (typeCounts[key] || 0) + entries.length;

      for (const entry of entries) {
        // Anonymize usernames
        const anonNames = entry.usernames.map(u => anonymize(u)).filter(Boolean);
        allEntries.push({
          dt: entry.dt,
          anonUsernames: anonNames,
          type: key,
        });
      }
    }

    self.postMessage({ type: 'progress', pct: 60, msg: 'Aggregating statistics...' });

    // Filter entries with valid dates for timeline
    const dated = allEntries.filter(e => e.dt !== null);
    dated.sort((a, b) => a.dt - b.dt);

    const totalInteractions = allEntries.length;

    // Date range
    let dateRange = { earliest: 'N/A', latest: 'N/A' };
    let totalDays = 0;
    if (dated.length > 0) {
      const earliest = new Date(dated[0].dt);
      const latest = new Date(dated[dated.length - 1].dt);
      dateRange = {
        earliest: earliest.toISOString().slice(0, 10),
        latest: latest.toISOString().slice(0, 10),
      };
      totalDays = Math.max(1, Math.round((latest - earliest) / 86400000));
    }

    // Unique accounts
    const accountInteractions = {};
    const accountTypes = {};
    for (const entry of allEntries) {
      for (const name of entry.anonUsernames) {
        accountInteractions[name] = (accountInteractions[name] || 0) + 1;
        if (!accountTypes[name]) accountTypes[name] = {};
        accountTypes[name][entry.type] = (accountTypes[name][entry.type] || 0) + 1;
      }
    }
    const uniqueAccounts = Object.keys(accountInteractions).length;

    // Monthly timeline
    self.postMessage({ type: 'progress', pct: 75, msg: 'Building timeline...' });
    const monthlyMap = {};
    for (const entry of dated) {
      const d = new Date(entry.dt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + 1;
    }
    const monthly = Object.keys(monthlyMap)
      .sort()
      .map(m => ({ month: m, count: monthlyMap[m] }));

    // By type
    const byType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => {
        const info = Object.values(FILE_TYPES).find(ft => ft.key === type);
        return { type, label: info ? info.label : type, count };
      });

    // Top accounts (sorted by interaction count)
    self.postMessage({ type: 'progress', pct: 90, msg: 'Ranking accounts...' });
    const topAccounts = Object.entries(accountInteractions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([name, count]) => ({
        name,
        count,
        types: accountTypes[name] || {},
      }));

    const avgPerDay = totalDays > 0
      ? Math.round((totalInteractions / totalDays) * 10) / 10
      : 0;

    const result = {
      totalInteractions,
      dateRange,
      totalDays,
      avgPerDay,
      uniqueAccounts,
      monthly,
      byType,
      topAccounts,
      followers: followerCount,
      following: followingCount,
    };

    self.postMessage({ type: 'progress', pct: 100, msg: 'Done!' });
    self.postMessage({ type: 'done', result });
  } catch (err) {
    self.postMessage({ type: 'error', msg: err.message });
  }
};
