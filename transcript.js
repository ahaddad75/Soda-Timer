(function () {
    const urlInput = document.getElementById('url');
    const proxySelect = document.getElementById('proxy');
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

    async function proxiedFetch(targetUrl) {
        const proxy = proxySelect.value;
        const finalUrl = proxy + encodeURIComponent(targetUrl);
        const res = await fetch(finalUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${targetUrl}`);
        return res.text();
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
            const watchUrl = `https://www.youtube.com/watch?v=${videoId}&hl=en`;
            const html = await proxiedFetch(watchUrl);
            const player = findPlayerResponse(html);

            const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
            if (!tracks || !tracks.length) throw new Error('This video has no captions available.');

            const track = tracks.find(t => t.kind !== 'asr') || tracks[0];
            const title = player?.videoDetails?.title || videoId;
            const lang = track.languageCode || 'unknown';
            const kind = track.kind === 'asr' ? 'auto-generated' : 'manual';

            statusEl.textContent = `Fetching ${lang} (${kind}) captions...`;
            const xml = await proxiedFetch(track.baseUrl);
            const entries = parseTimedText(xml);
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
