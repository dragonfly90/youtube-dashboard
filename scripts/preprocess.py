#!/usr/bin/env python3
"""
Pre-process Google Takeout YouTube watch history HTML into JSON for the dashboard.

Usage:
    python3 scripts/preprocess.py [path-to-watch-history.html]

If no path is given, searches common Takeout locations automatically.
Outputs: src/data/preloaded.json
"""
import json
import os
import re
import sys
import html as html_mod
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# Locate the Takeout HTML
# ---------------------------------------------------------------------------
ALL_PATHS = [
    os.path.expanduser("~/Downloads/Takeout 3/YouTube 和 YouTube Music/历史记录/观看记录.html"),
    os.path.expanduser("~/Downloads/Takeout 2/YouTube 和 YouTube Music/历史记录/观看记录.html"),
    os.path.expanduser("~/Downloads/Takeout/YouTube 和 YouTube Music/历史记录/观看记录.html"),
    os.path.expanduser("~/Downloads/Takeout 2/我的活动/YouTube/我的活动记录.html"),
    os.path.expanduser("~/Downloads/Takeout/我的活动/YouTube/我的活动记录.html"),
    os.path.expanduser("~/Downloads/Takeout 3/我的活动/YouTube/我的活动记录.html"),
]

# ---------------------------------------------------------------------------
# HTML parser regexes
# ---------------------------------------------------------------------------
OUTER_BLOCK_RE = re.compile(
    r'<div class="outer-cell.*?</div></div></div>', re.DOTALL
)
BODY_RE = re.compile(r'mdl-typography--body-1">(.*?)</div>', re.DOTALL)
WATCHED_WITH_CHANNEL_RE = re.compile(
    r'Watched[\s\u00a0]+'
    r'<a href="(https?://(?:www\.|music\.)?youtube\.com/[^"]+)">(.*?)</a><br>'
    r'<a href="https?://www\.youtube\.com/channel/[^"]+">(.*?)</a><br>'
    r'(\d{4}年\d{1,2}月\d{1,2}日[^<]*?)<br>',
    re.DOTALL,
)
WATCHED_NO_CHANNEL_RE = re.compile(
    r'Watched[\s\u00a0]+'
    r'<a href="(https?://(?:www\.|music\.)?youtube\.com/[^"]+)">(.*?)</a><br>'
    r'(\d{4}年\d{1,2}月\d{1,2}日[^<]*?)<br>',
    re.DOTALL,
)
DATE_RE = re.compile(
    r'(\d{4})年(\d{1,2})月(\d{1,2})日[\s\u00a0]+'
    r'(\d{1,2}):(\d{2}):(\d{2})'
)

# ---------------------------------------------------------------------------
# Clusters (same as classifier.js)
# ---------------------------------------------------------------------------
CLUSTERS = [
    ("ml_ai", [
        "karpathy", "stanford online", "deepmind", "openai", "huggingface",
        "transformer", "llm", "gpt", "neural", "diffusion", "rlhf",
        "fine-tun", "fine tun", "pytorch", "jax", "tensorflow", "cs231",
        "cs224", "cs25", "yannic", "two minute papers", "ai explained",
        "andrew ng", "jeremy howard", "fast.ai", "tri dao", "flash attention",
        "mlsys", "deep learning",
    ]),
    ("scientific_computing", [
        "steve brunton", "3blue1brown", "numerical", "scipy", "sympy",
        "dynamical system", "kalman", "fourier", "linear algebra",
        "differential equation",
    ]),
    ("cpp_systems", [
        "mike shah", "cppcon", "c++", "cpp", "cmake", "llvm",
        "compiler explorer", "godbolt", "template metaprogramming",
        "modern c++",
    ]),
    ("rust", [" rust ", "rustlang", "crust of rust", "jon gjengset"]),
    ("python_tools", [
        "real python", "mcoding", "arjancodes", "corey schafer", "talk python",
    ]),
    ("chinese_pop_music", [
        "zhang bichen", "jay chou", "周杰伦", "张碧晨", "邓紫棋", "g.e.m",
        "jj lin", "林俊杰", "孙燕姿", "stefanie sun", "sun yanzi",
        "hebe tien", "田馥甄", "mayday", "五月天", "faye wong", "王菲",
        "eason chan", "陈奕迅", "tanya chua", "蔡健雅", "华语", "topic",
        "official mv", "官方mv", "live版",
    ]),
    ("chinese_variety_tv", [
        "浙江卫视", "湖南卫视", "综艺", "奔跑吧", "向往的生活", "乘风破浪",
        "中国好声音", "声生不息", "披荆斩棘", "天赐的声音",
    ]),
    ("chinese_news_commentary", [
        "王志安", "美投侃", "ic实验室", "袁腾飞", "文昭", "观雨",
        "老高与小茉", "小Lin说", "小林", "新闻", "时事", "评论",
        "政经", "财经", "看中国",
    ]),
    ("finance_markets", [
        "bloomberg", "cnbc", "patrick boyle", "plain bagel", "ben felix",
        "meet kevin", "stock", "options trading", "federal reserve",
        "yield curve", "macro", "recession",
    ]),
    ("kids_family", [
        "like nastya", "cocomelon", "baby shark", "peppa pig", "kids",
        "nursery rhyme", "pinkfong", "小猪佩奇",
    ]),
    ("cooking", [
        "babish", "joshua weissman", "kenji", "bon appetit", "recipe",
        "cooking", "chef", "食谱", "美食",
    ]),
    ("fitness_health", [
        "athlean", "jeff nippard", "jeremy ethier", "workout", "gym",
        "hypertrophy", "squat", "deadlift", "calisthenics", "yoga",
        "healthy", "nutrition",
    ]),
    ("photography", [
        "peter mckinnon", "tony northrup", "dpreview", "lightroom",
        "photoshop tutorial", "mirrorless", "sony a7", "fujifilm",
    ]),
    ("travel_docs", [
        "drew binsky", "yes theory", "kara and nate", "travel vlog",
        "documentary", "national geographic", "nat geo",
    ]),
]

CLUSTER_LABELS = {
    "ml_ai": "Machine Learning / AI",
    "scientific_computing": "Scientific Computing & Math",
    "cpp_systems": "C++ & Systems Programming",
    "rust": "Rust",
    "python_tools": "Python Tooling",
    "chinese_pop_music": "Chinese Pop Music",
    "chinese_variety_tv": "Chinese Variety TV",
    "chinese_news_commentary": "Chinese News & Commentary",
    "finance_markets": "Finance & Markets",
    "kids_family": "Kids / Family",
    "cooking": "Cooking",
    "fitness_health": "Fitness & Health",
    "photography": "Photography",
    "travel_docs": "Travel / Documentaries",
    "other": "Other / Uncategorized",
}


def _clean(s):
    s = html_mod.unescape(s)
    s = re.sub(r'<[^>]+>', '', s)
    return s.strip()


def classify(title, channel):
    text = (title + " " + channel).lower()
    for cluster_id, keywords in CLUSTERS:
        for kw in keywords:
            if kw in text:
                return cluster_id
    return "other"


def parse_history(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    videos = []
    for block in OUTER_BLOCK_RE.findall(content):
        body_match = BODY_RE.search(block)
        if not body_match:
            continue
        body = body_match.group(1).strip()
        if not body.startswith('Watched'):
            continue
        m = WATCHED_WITH_CHANNEL_RE.match(body)
        if m:
            url, title, channel, date_str = m.groups()
        else:
            m2 = WATCHED_NO_CHANNEL_RE.match(body)
            if not m2:
                continue
            url, title, date_str = m2.groups()
            channel = "(no channel)"
        dm = DATE_RE.search(date_str)
        if not dm:
            continue
        dt = datetime(
            int(dm.group(1)), int(dm.group(2)), int(dm.group(3)),
            int(dm.group(4)), int(dm.group(5)), int(dm.group(6)),
        )
        videos.append({
            "dt": dt,
            "title": _clean(title),
            "channel": _clean(channel),
            "url": url,
        })
    return videos


def build_json(videos):
    if not videos:
        return {}

    dates = [v["dt"] for v in videos]
    earliest = min(dates)
    latest = max(dates)
    ninety_days_ago = latest - timedelta(days=90)

    channels = set()
    monthly = Counter()
    cluster_counts = Counter()
    cluster_recent = Counter()
    cluster_channels = defaultdict(Counter)
    cluster_monthly = defaultdict(Counter)
    overall_channels = Counter()

    for v in videos:
        dt = v["dt"]
        ch = v["channel"]
        cid = classify(v["title"], ch)
        month_key = dt.strftime("%Y-%m")

        channels.add(ch)
        monthly[month_key] += 1
        cluster_counts[cid] += 1
        cluster_channels[cid][ch] += 1
        cluster_monthly[cid][month_key] += 1
        overall_channels[ch] += 1
        if dt >= ninety_days_ago:
            cluster_recent[cid] += 1

    # Build monthly array (sorted)
    all_months = sorted(monthly.keys())
    monthly_arr = [{"month": m, "count": monthly[m]} for m in all_months]

    # Build clusters array (sorted by count desc)
    clusters_arr = []
    for cid in sorted(cluster_counts, key=lambda c: -cluster_counts[c]):
        # Build per-cluster monthly sparkline data
        sparkline = [{"month": m, "count": cluster_monthly[cid].get(m, 0)} for m in all_months]
        clusters_arr.append({
            "id": cid,
            "label": CLUSTER_LABELS.get(cid, cid),
            "count": cluster_counts[cid],
            "recent90d": cluster_recent.get(cid, 0),
            "monthly": sparkline,
        })

    # Top channels by cluster (top 10 each)
    top_by_cluster = {}
    for cid, ch_counter in cluster_channels.items():
        top_by_cluster[cid] = [
            {"name": name, "count": cnt}
            for name, cnt in ch_counter.most_common(10)
        ]

    # Top channels overall (top 30)
    top_overall = [
        {"name": name, "count": cnt, "cluster": classify("", name)}
        for name, cnt in overall_channels.most_common(30)
    ]
    # Re-classify top channels using their video titles for accuracy
    channel_cluster_votes = defaultdict(Counter)
    for v in videos:
        cid = classify(v["title"], v["channel"])
        channel_cluster_votes[v["channel"]][cid] += 1
    for entry in top_overall:
        votes = channel_cluster_votes.get(entry["name"], {})
        if votes:
            entry["cluster"] = votes.most_common(1)[0][0]

    # Also build a full channels list (top 200) with recent90d
    channel_recent = Counter()
    for v in videos:
        if v["dt"] >= ninety_days_ago:
            channel_recent[v["channel"]] += 1

    all_channels = []
    for name, cnt in overall_channels.most_common(200):
        votes = channel_cluster_votes.get(name, {})
        cid = votes.most_common(1)[0][0] if votes else "other"
        all_channels.append({
            "name": name,
            "count": cnt,
            "recent90d": channel_recent.get(name, 0),
            "cluster": cid,
        })

    total_days = (latest - earliest).days or 1

    return {
        "totalVideos": len(videos),
        "dateRange": {
            "earliest": earliest.strftime("%Y-%m-%d"),
            "latest": latest.strftime("%Y-%m-%d"),
        },
        "totalDays": total_days,
        "avgPerDay": round(len(videos) / total_days, 1),
        "uniqueChannels": len(channels),
        "monthly": monthly_arr,
        "clusters": clusters_arr,
        "topChannelsByCluster": top_by_cluster,
        "topChannelsOverall": top_overall,
        "allChannels": all_channels,
    }


def find_html_files():
    """Return list of all Takeout HTML files to merge, or CLI-specified files."""
    if len(sys.argv) > 1:
        paths = []
        for path in sys.argv[1:]:
            if os.path.isfile(path):
                paths.append(path)
            else:
                print(f"Warning: file not found: {path}")
        if paths:
            return paths
        sys.exit(1)
    found = [p for p in ALL_PATHS if os.path.isfile(p)]
    if not found:
        print("Error: Could not find any Takeout watch history HTML.")
        print("Searched:", "\n  ".join(ALL_PATHS))
        print("\nUsage: python3 scripts/preprocess.py [path-to-watch-history.html ...]")
        sys.exit(1)
    return found


def main():
    html_paths = find_html_files()
    print(f"Found {len(html_paths)} Takeout file(s) to merge:")

    all_videos = []
    seen_keys = set()  # (url, timestamp) for dedup
    for html_path in html_paths:
        print(f"  Parsing: {html_path}")
        print(f"    File size: {os.path.getsize(html_path) / 1024 / 1024:.1f} MB")
        videos = parse_history(html_path)
        new_count = 0
        for v in videos:
            key = (v["url"], v["dt"].isoformat())
            if key not in seen_keys:
                seen_keys.add(key)
                all_videos.append(v)
                new_count += 1
        print(f"    Entries: {len(videos):,} ({new_count:,} new after dedup)")

    videos = all_videos
    print(f"\n  Total unique videos: {len(videos):,}")

    data = build_json(videos)

    out_dir = Path(__file__).resolve().parent.parent / "src" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "preloaded.json"

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"\nWrote {out_path} ({size_kb:.0f} KB)")
    print(f"  Total videos: {data['totalVideos']:,}")
    print(f"  Date range: {data['dateRange']['earliest']} to {data['dateRange']['latest']}")
    print(f"  Unique channels: {data['uniqueChannels']:,}")
    print(f"  Clusters: {len(data['clusters'])}")


if __name__ == "__main__":
    main()
