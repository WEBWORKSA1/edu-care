#!/usr/bin/env python3
"""Edu.Care self-updating content job.

Runs on GitHub Actions (see .github/workflows/update-content.yml).
Pulls public RSS/Atom feeds for education news and the latest videos from
education YouTube channels, then writes data/news.json and data/videos.json.
Standard library only, so it runs on the free GitHub runner with no installs.
"""
import json, re, datetime, html, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
UA = {"User-Agent": "Mozilla/5.0 (EduCareBot; +https://edu.care)"}

NEWS_FEEDS = [
    ("Google News", "https://news.google.com/rss/search?q=" + urllib.parse.quote("education students when:7d") + "&hl=en-US&gl=US&ceid=US:en"),
    ("Google News", "https://news.google.com/rss/search?q=" + urllib.parse.quote("scholarships OR \"financial aid\" when:7d") + "&hl=en-US&gl=US&ceid=US:en"),
    ("Google News", "https://news.google.com/rss/search?q=" + urllib.parse.quote("online learning OR edtech when:7d") + "&hl=en-US&gl=US&ceid=US:en"),
    ("Google News", "https://news.google.com/rss/search?q=" + urllib.parse.quote("parents school learning when:7d") + "&hl=en-US&gl=US&ceid=US:en"),
    ("The Hechinger Report", "https://hechingerreport.org/feed/"),
    ("The Conversation", "https://theconversation.com/us/education/articles.atom"),
    ("EdSurge", "https://www.edsurge.com/articles_rss"),
]

# (handle, fallback channel id, category)
CHANNELS = [
    ("@khanacademy", "UC4a-Gbdw7vOaccHmFo40b9g", "Academics"),
    ("@TEDEd", "UCsooa4yRKGN_zEE8iknghZA", "Big ideas"),
    ("@crashcourse", "UCX6b17PVsYBQ0ip5gyeme-Q", "Academics"),
    ("@kurzgesagt", "UCsXVk37bltHxD1rDPwtNM8Q", "Science"),
    ("@SciShow", "UCZYTClx2T1of7BRZ86-8fow", "Science"),
    ("@minutephysics", "UCUHW94eEFW7hkUMVaZz4eDg", "Science"),
    ("@Thomasfrank", "", "Study skills"),
    ("@AliAbdaal", "", "Study skills"),
]

NS = {"atom": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015", "media": "http://search.yahoo.com/mrss/"}


def get(url, timeout=20):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def clean(t):
    t = html.unescape(re.sub(r"<[^>]+>", "", t or "")).strip()
    return re.sub(r"\s+", " ", t)


def parse_date(s):
    if not s:
        return ""
    for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%SZ"):
        try:
            d = datetime.datetime.strptime(s.strip(), fmt)
            if d.tzinfo is None:
                d = d.replace(tzinfo=datetime.timezone.utc)
            return d.astimezone(datetime.timezone.utc).isoformat()
        except ValueError:
            pass
    try:
        return datetime.datetime.fromisoformat(s.strip().replace("Z", "+00:00")).isoformat()
    except ValueError:
        return ""


def news():
    items, seen = [], set()
    for name, url in NEWS_FEEDS:
        try:
            root = ET.fromstring(get(url))
        except Exception as e:  # noqa: BLE001
            print("news feed failed", url, e)
            continue
        for it in root.iter("item"):
            title = clean(it.findtext("title"))
            link = (it.findtext("link") or "").strip()
            src = it.find("source")
            source = clean(src.text) if src is not None and src.text else name
            if name == "Google News" and " - " in title:
                title = title.rsplit(" - ", 1)[0]
            pub = parse_date(it.findtext("pubDate"))
            key = title.lower()[:80]
            if title and link and key not in seen:
                seen.add(key)
                items.append({"title": title, "link": link, "source": source, "published": pub})
        for en in root.findall("atom:entry", NS):
            title = clean(en.findtext("atom:title", default="", namespaces=NS))
            ln = en.find("atom:link", NS)
            link = ln.get("href") if ln is not None else ""
            pub = parse_date(en.findtext("atom:published", default="", namespaces=NS) or en.findtext("atom:updated", default="", namespaces=NS))
            key = title.lower()[:80]
            if title and link and key not in seen:
                seen.add(key)
                items.append({"title": title, "link": link, "source": name, "published": pub})
    items.sort(key=lambda x: x["published"], reverse=True)
    return items[:60]


def resolve(handle, fallback):
    try:
        page = get("https://www.youtube.com/" + handle).decode("utf-8", "ignore")
        m = re.search(r'"(?:externalId|channelId)":"(UC[\w-]{22})"', page)
        if m:
            return m.group(1)
    except Exception as e:  # noqa: BLE001
        print("resolve failed", handle, e)
    return fallback


def videos():
    out = []
    for handle, fallback, cat in CHANNELS:
        cid = resolve(handle, fallback)
        if not cid:
            continue
        try:
            root = ET.fromstring(get("https://www.youtube.com/feeds/videos.xml?channel_id=" + cid))
        except Exception as e:  # noqa: BLE001
            print("video feed failed", handle, e)
            continue
        channel = clean(root.findtext("atom:title", default=handle, namespaces=NS))
        for en in root.findall("atom:entry", NS)[:6]:
            vid = en.findtext("yt:videoId", default="", namespaces=NS)
            link = en.find("atom:link", NS)
            href = link.get("href", "") if link is not None else ""
            if "/shorts/" in href or not vid:
                continue
            out.append({
                "id": vid,
                "title": clean(en.findtext("atom:title", default="", namespaces=NS)),
                "channel": channel,
                "category": cat,
                "published": parse_date(en.findtext("atom:published", default="", namespaces=NS)),
            })
    out.sort(key=lambda x: x["published"], reverse=True)
    return out[:48]


def keep_old(path, key, new):
    """Never overwrite good data with an empty result (e.g. a feed outage)."""
    if new:
        return new
    try:
        return json.loads(path.read_text()).get(key, [])
    except Exception:  # noqa: BLE001
        return []


def main():
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    n = keep_old(DATA / "news.json", "items", news())
    v = keep_old(DATA / "videos.json", "videos", videos())
    (DATA / "news.json").write_text(json.dumps({"updated": now, "items": n}, indent=1, ensure_ascii=False))
    (DATA / "videos.json").write_text(json.dumps({"updated": now, "videos": v}, indent=1, ensure_ascii=False))
    sm = ROOT / "sitemap.xml"
    if sm.exists():
        today = now[:10]
        txt = sm.read_text()
        for page in ("news.html", "videos.html"):
            txt = re.sub(r"(<loc>[^<]*/" + re.escape(page) + r"</loc>\s*<lastmod>)[^<]*", r"\g<1>" + today, txt)
        sm.write_text(txt)
    print(f"news={len(n)} videos={len(v)}")


if __name__ == "__main__":
    main()
