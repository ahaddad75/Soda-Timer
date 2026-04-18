(function () {
    const urlInput = document.getElementById('url');
    const proxySelect = document.getElementById('proxy');
    const customProxyInput = document.getElementById('customProxy');

    const STORAGE_KEY = 'yt-transcript-custom-proxy';
    customProxyInput.value = localStorage.getItem(STORAGE_KEY) || '';
    customProxyInput.addEventListener('change', () => {
        const v = customProxyInput.value.trim();
        if (v) localStorage.setItem(STORAGE_KEY, v);
        else localStorage.removeItem(STORAGE_KEY);
    });

    function customProxy() {
        const v = customProxyInput.value.trim();
        if (!v) return null;
        const base = v.replace(/\/$/, '');
        return {
            name: 'custom',
            build: u => `${base}/?url=${encodeURIComponent(u)}`,
            post: true,
        };
    }
    const fetchBtn = document.getElementById('fetchBtn');
    const txtBtn = document.getElementById('txtBtn');
    const jsonBtn = document.getElementById('jsonBtn');
    const statusEl = document.getElementById('status');
    const metaEl = document.getElementById('meta');
    const previewEl = document.getElementById('preview');

    let lastTxt = '';
    let lastJson = null;
    let lastVideoId = '';

    function extractVideoId(input) {
        const s = input.trim();
        if (/^[\w-]{11}$/.test(s)) return s;
        try {
            const u = new URL(s);
            if (u.hostname === 'youtu.be') return u.pathname.slice(1);
            const v = u.searchParams.get('v');
            if (v) return v;
            const parts = u.pathname.split('/');
            const i = parts.findIndex(p => p === 'shorts' || p === 'embed' || p === 'live');
            if (i >= 0 && parts[i + 1]) return parts[i + 1];
        } catch (_) { /* not a URL */ }
        const m = s.match(/[\w-]{11}/);
        return m ? m[0] : null;
    }

    const PROXIES = [
        { name: 'corsproxy.io',    build: u => 'https://corsproxy.io/?' + encodeURIComponent(u), post: true },
        { name: 'allorigins.win',  build: u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u), post: false },
        { name: 'codetabs.com',    build: u => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u), post: true },
        { name: 'cors.lol',        build: u => 'https://api.cors.lol/?url=' + encodeURIComponent(u), post: true },
        { name: 'thingproxy',      build: u => 'https://thingproxy.freeboard.io/fetch/' + u, post: true },
    ];

    function orderedProxies(filter) {
        const preferred = proxySelect.value;
        const all = filter ? PROXIES.filter(filter) : PROXIES;
        const list = preferred === 'auto'
            ? all
            : (() => { const h = all.find(p => p.name === preferred); return h ? [h, ...all.filter(p => p.name !== preferred)] : all; })();
        const custom = customProxy();
        return custom ? [custom, ...list] : list;
    }

    async function proxiedFetch(targetUrl) {
        const failures = [];
        for (const proxy of orderedProxies()) {
            try {
                statusEl.textContent = `Trying ${proxy.name}...`;
                const res = await fetch(proxy.build(targetUrl));
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.text();
            } catch (err) {
                failures.push(`${proxy.name}: ${err.message}`);
            }
        }
        throw new Error(`All proxies failed — ${failures.join(' | ')}`);
    }

    async function proxiedPostJson(targetUrl, payload) {
        const failures = [];
        for (const proxy of orderedProxies(p => p.post)) {
            try {
                statusEl.textContent = `Calling InnerTube via ${proxy.name}...`;
                const res = await fetch(proxy.build(targetUrl), {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                return JSON.parse(text);
            } catch (err) {
                failures.push(`${proxy.name}: ${err.message}`);
            }
        }
        throw new Error(`InnerTube POST failed — ${failures.join(' | ')}`);
    }

    function findPlayerResponse(html) {
        const marker = 'ytInitialPlayerResponse';
        const idx = html.indexOf(marker);
        if (idx < 0) throw new Error('Could not find player data in page.');
        const eqIdx = html.indexOf('=', idx);
        let i = eqIdx + 1;
        while (i < html.length && html[i] !== '{') i++;
        if (i >= html.length) throw new Error('Malformed player data.');
        let depth = 0, inStr = false, esc = false;
        const start = i;
        for (; i < html.length; i++) {
            const c = html[i];
            if (inStr) {
                if (esc) esc = false;
                else if (c === '\\') esc = true;
                else if (c === '"') inStr = false;
            } else {
                if (c === '"') inStr = true;
                else if (c === '{') depth++;
                else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
            }
        }
        return JSON.parse(html.slice(start, i));
    }

    function parseCaptions(text) {
        const trimmed = text.trimStart();
        if (trimmed.startsWith('{')) return parseJson3(text);
        return parseTimedText(text);
    }

    function parseJson3(text) {
        const data = JSON.parse(text);
        const entries = [];
        for (const ev of data.events || []) {
            if (!ev.segs) continue;
            const start = (ev.tStartMs || 0) / 1000;
            const dur = (ev.dDurationMs || 0) / 1000;
            const txt = ev.segs.map(s => s.utf8 || '').join('').replace(/\s+/g, ' ').trim();
            if (txt) entries.push({ start, duration: dur, text: txt });
        }
        return entries;
    }

    function parseTimedText(xml) {
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        const nodes = doc.getElementsByTagName('text');
        const entries = [];
        for (const n of nodes) {
            const start = parseFloat(n.getAttribute('start') || '0');
            const dur = parseFloat(n.getAttribute('dur') || '0');
            const raw = n.textContent || '';
            const decoded = new DOMParser()
                .parseFromString(raw, 'text/html')
                .documentElement.textContent
                .replace(/\s+/g, ' ')
                .trim();
            if (decoded) entries.push({ start, duration: dur, text: decoded });
        }
        return entries;
    }

    function formatTimestamp(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const pad = n => String(n).padStart(2, '0');
        return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    }

    function download(filename, content, mime) {
        const blob = new Blob([content], { type: mime });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    async function loadPlayerData(videoId) {
        const innertubeUrl = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
        const clients = [
            { clientName: 'WEB', clientVersion: '2.20240115.05.00' },
            { clientName: 'MWEB', clientVersion: '2.20240115.05.00' },
            { clientName: 'IOS', clientVersion: '19.09.3', deviceModel: 'iPhone14,3' },
            { clientName: 'ANDROID', clientVersion: '19.09.37', androidSdkVersion: 30 },
        ];

        const failures = [];
        for (const client of clients) {
            const payload = {
                context: { client: { ...client, hl: 'en', gl: 'US' } },
                videoId,
            };
            try {
                const data = await proxiedPostJson(innertubeUrl, payload);
                const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
                if (tracks && tracks.length) return data;
                failures.push(`${client.clientName}: no caption tracks (status: ${data?.playabilityStatus?.status || 'unknown'})`);
            } catch (err) {
                failures.push(`${client.clientName}: ${err.message}`);
            }
        }

        const variants = [
            `https://www.youtube.com/watch?v=${videoId}&hl=en&gl=US&bpctr=9999999999&has_verified=1&persist_hl=1`,
            `https://www.youtube.com/watch?v=${videoId}&hl=en`,
        ];
        for (const url of variants) {
            try {
                const html = await proxiedFetch(url);
                if (!html.includes('ytInitialPlayerResponse') && !html.includes('"captionTracks"')) {
                    failures.push(`${new URL(url).hostname}: no player data (${html.length} bytes)`);
                    continue;
                }
                return findPlayerResponse(html);
            } catch (err) {
                failures.push(`${new URL(url).hostname}: ${err.message}`);
            }
        }
        throw new Error(`Could not load player data — ${failures.join(' | ')}`);
    }

    async function fetchTranscript() {
        lastTxt = ''; lastJson = null;
        txtBtn.disabled = true; jsonBtn.disabled = true;
        metaEl.textContent = '';
        previewEl.textContent = '';

        const videoId = extractVideoId(urlInput.value);
        if (!videoId) { statusEl.textContent = 'Could not read a video ID from that input.'; return; }
        lastVideoId = videoId;

        fetchBtn.disabled = true;
        statusEl.textContent = 'Loading video page...';
        try {
            const player = await loadPlayerData(videoId);

            const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
            if (!tracks || !tracks.length) throw new Error('This video has no captions available.');

            const track = tracks.find(t => t.kind !== 'asr') || tracks[0];
            const title = player?.videoDetails?.title || videoId;
            const lang = track.languageCode || 'unknown';
            const kind = track.kind === 'asr' ? 'auto-generated' : 'manual';

            statusEl.textContent = `Fetching ${lang} (${kind}) captions...`;
            const captionUrl = track.baseUrl.includes('fmt=') ? track.baseUrl : track.baseUrl + '&fmt=json3';
            const captionResp = await proxiedFetch(captionUrl);
            const entries = parseCaptions(captionResp);
            if (!entries.length) throw new Error('Caption track was empty.');

            lastTxt = entries.map(e => e.text).join('\n');
            lastJson = { videoId, title, language: lang, kind, entries };

            metaEl.textContent = `"${title}" — ${lang} (${kind}), ${entries.length} lines`;
            previewEl.textContent = entries
                .slice(0, 40)
                .map(e => `[${formatTimestamp(e.start)}] ${e.text}`)
                .join('\n') + (entries.length > 40 ? `\n... (${entries.length - 40} more)` : '');

            statusEl.textContent = 'Done. Use the download buttons.';
            txtBtn.disabled = false;
            jsonBtn.disabled = false;
        } catch (err) {
            statusEl.textContent = `Error: ${err.message}`;
        } finally {
            fetchBtn.disabled = false;
        }
    }

    fetchBtn.addEventListener('click', fetchTranscript);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchTranscript(); });
    txtBtn.addEventListener('click', () => {
        if (lastTxt) download(`${lastVideoId}.txt`, lastTxt, 'text/plain;charset=utf-8');
    });
    jsonBtn.addEventListener('click', () => {
        if (lastJson) download(`${lastVideoId}.json`, JSON.stringify(lastJson, null, 2), 'application/json');
    });
})();
