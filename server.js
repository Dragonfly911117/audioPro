/**
 * Proxy server for Audio Pro C20 Controller
 * Handles CORS and forwards requests to the speaker
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load speaker configuration
const speaker = JSON.parse(fs.readFileSync(path.join(__dirname, 'speaker.json'), 'utf-8'));

const CONFIG = {
    port: 8000,
    speakerIp: speaker.ip,
    speakerPort: speaker.port,
    speakerName: speaker.name,
};

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// Serve static files
function serveStatic(req, res) {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Proxy requests to the speaker
function proxyToSpeaker(req, res, command) {
    const options = {
        hostname: CONFIG.speakerIp,
        port: CONFIG.speakerPort,
        path: `/httpapi.asp?command=${encodeURIComponent(command)}`,
        method: 'GET',
        rejectUnauthorized: false, // Accept self-signed certificate
    };

    const proxyReq = https.request(options, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            // Add CORS headers
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end(data);
        });
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.writeHead(502, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ error: 'Failed to connect to speaker' }));
    });

    proxyReq.end();
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
    }

    // Serve speaker config
    if (url.pathname === '/config') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify(speaker));
        return;
    }

    // Proxy API requests
    if (url.pathname === '/api') {
        const command = url.searchParams.get('command');
        if (command) {
            proxyToSpeaker(req, res, command);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing command parameter' }));
        }
        return;
    }

    // Serve static files
    serveStatic(req, res);
});

server.listen(CONFIG.port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              Speaker Controller Server                         ║
╠════════════════════════════════════════════════════════════════╣
║  Server:  http://localhost:${CONFIG.port}                             ║
║  Speaker: ${CONFIG.speakerName.padEnd(20)} @ ${CONFIG.speakerIp}        ║
╚════════════════════════════════════════════════════════════════╝
`);
});
