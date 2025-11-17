const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Simple CORS and preflight handling
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // Proxy API to N8N: /api/chat
    if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const workflowType = data.workflowType || 'code';

                // Map workflow to N8N webhook
                const n8nBase = 'http://localhost:5678';
                const webhooks = {
                    code: `${n8nBase}/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`,
                    quick: `${n8nBase}/webhook/1e50cbd3-cc31-4ab8-80c4-aa4aadf1e5fc`,
                    plan: `${n8nBase}/webhook/f27ab7f0-1c71-4929-8163-24d372a8761b`
                };
                const targetUrl = webhooks[workflowType] || webhooks.code;

                // Forward to N8N
                const isHttps = targetUrl.startsWith('https://');
                const urlObj = new URL(targetUrl);
                const options = {
                    hostname: urlObj.hostname,
                    port: urlObj.port || (isHttps ? 443 : 80),
                    path: urlObj.pathname + (urlObj.search || ''),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
                const client = isHttps ? https : http;
                const forwardReq = client.request(options, forwardRes => {
                    let resp = '';
                    forwardRes.on('data', chunk => { resp += chunk; });
                    forwardRes.on('end', () => {
                        const status = forwardRes.statusCode || 500;
                        // Try to relay JSON; fall back to text
                        res.statusCode = status;
                        const contentType = forwardRes.headers['content-type'] || 'application/json; charset=utf-8';
                        res.setHeader('Content-Type', contentType);
                        res.end(resp);
                    });
                });
                forwardReq.on('error', err => {
                    res.writeHead(502, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Proxy error', error: String(err) }));
                });
                forwardReq.write(JSON.stringify(data));
                forwardReq.end();
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid JSON', error: String(e) }));
            }
        });
        return;
    }

    // Static files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './戴煦个人网站.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
});
