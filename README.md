# Audio Pro Controller

> **Note:** This is an AI slop project, generated entirely by Claude.

Web controller for Audio Pro C20 (and other LinkPlay-based speakers) with a NieR: Automata inspired UI.

## Setup

1. Copy `speaker.example.json` to `speaker.json` and edit with your speaker's details:
   ```json
   {
       "name": "Audio Pro C20",
       "ip": "192.168.1.100",
       "port": 443
   }
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:8000

## Features

- Playback controls (play/pause, stop, prev, next)
- Volume control with mute
- Source selection (WiFi, Bluetooth, Line In, Optical, USB)
- 10 presets
- Auto-refreshing status

## Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Build and start server
- `npm start` - Start server
- `npm test` - Run tests

## Tech

- TypeScript
- Vitest (73 tests)
- YoRHA UI theme
- Node.js proxy server (handles CORS)

## Special Thanks

- [metakirby5/yorha](https://github.com/metakirby5/yorha) - YoRHA CSS design system
- [Arylic HTTP API Documentation](https://developer.arylic.com/httpapi/) - LinkPlay API reference
- [AndersFluur/LinkPlayApi](https://github.com/AndersFluur/LinkPlayApi) - LinkPlay API documentation
