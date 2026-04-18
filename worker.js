/*
 * Cloudflare Worker — YouTube transcript proxy for ahaddad75.github.io/Soda-Timer
 *
 * ── Deploy in 5 minutes (one time) ──────────────────────────────────────────
 * 1. Sign up (free): https://dash.cloudflare.com/sign-up
 * 2. In the dashboard, click "Workers & Pages" → "Create" → "Create Worker".
 * 3. Give it a name (e.g. "yt-transcript") and click "Deploy".
 * 4. Click "Edit code", delete the sample, paste THIS WHOLE FILE, click "Deploy".
 * 5. Copy the URL shown (e.g. https://yt-transcript.YOUR-NAME.workers.dev).
 *    Paste it into the transcript page's "Custom proxy URL" field — done.
 *
 * Free tier: 100,000 requests/day. Each transcript uses 2 requests.
 *
 * Security note: this worker only proxies requests to youtube.com domains,
 * so it can't be abused to scrape other sites.
 */

const ALLOWED_HOST = /^(www\.|m\.)?youtube\.com$/;

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
};

export default {
    async fetch(request) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const reqUrl = new URL(request.url);
        const target = reqUrl.searchParams.get('url');
        if (!target) {
            return new Response('Missing ?url= parameter', { status: 400, headers: CORS_HEADERS });
        }

        let targetUrl;
        try {
            targetUrl = new URL(target);
        } catch (_) {
            return new Response('Invalid URL', { status: 400, headers: CORS_HEADERS });
        }
        if (!ALLOWED_HOST.test(targetUrl.hostname)) {
            return new Response('Only youtube.com URLs are allowed', { status: 403, headers: CORS_HEADERS });
        }

        const init = {
            method: request.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        };
        if (request.method === 'POST') {
            init.headers['Content-Type'] = 'application/json';
            init.body = await request.text();
        }

        const upstream = await fetch(targetUrl.toString(), init);
        const body = await upstream.arrayBuffer();

        return new Response(body, {
            status: upstream.status,
            headers: {
                ...CORS_HEADERS,
                'Content-Type': upstream.headers.get('Content-Type') || 'application/octet-stream',
            },
        });
    },
};
