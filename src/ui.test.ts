import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up DOM before importing ui module
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <span id="statusDot"></span>
    <span id="statusText">Connecting...</span>
    <div id="trackTitle">--</div>
    <div id="trackArtist">--</div>
    <div id="currentSource">--</div>
    <button id="playPauseBtn">⏸</button>
    <input type="range" id="volumeSlider" value="50">
    <span id="volumeValue">50%</span>
    <button id="muteBtn">🔊</button>
    <div id="toast"></div>
    <button class="source-btn" data-source="wifi"></button>
    <button class="source-btn" data-source="bluetooth"></button>
</body>
</html>
`);

global.document = dom.window.document;

// Now import UI functions
import {
    getElement,
    updateConnectionStatus,
    updateVolumeDisplay,
    updateMuteButton,
    updatePlayPauseButton,
    updateSourceButtons,
    updateTrackInfo,
    updateSourceDisplay,
    updateVolumeSlider,
    showToast,
} from './ui.js';
import { state } from './state.js';

describe('UI Elements', () => {
    it('should get element by id', () => {
        const element = getElement('statusDot');
        expect(element).not.toBeNull();
    });

    it('should return null for non-existent element', () => {
        const element = getElement('nonexistent');
        expect(element).toBeNull();
    });
});

describe('updateConnectionStatus', () => {
    beforeEach(() => {
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        dot?.classList.remove('connected');
        if (text) text.textContent = 'Connecting...';
    });

    it('should show connected status', () => {
        updateConnectionStatus(true);
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        expect(dot?.classList.contains('connected')).toBe(true);
        expect(text?.textContent).toBe('Connected');
    });

    it('should show disconnected status', () => {
        updateConnectionStatus(false);
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        expect(dot?.classList.contains('connected')).toBe(false);
        expect(text?.textContent).toBe('Disconnected');
    });
});

describe('updateVolumeDisplay', () => {
    it('should update volume value text', () => {
        updateVolumeDisplay(75);
        const volumeValue = document.getElementById('volumeValue');
        expect(volumeValue?.textContent).toBe('75%');
    });

    it('should handle 0 volume', () => {
        updateVolumeDisplay(0);
        const volumeValue = document.getElementById('volumeValue');
        expect(volumeValue?.textContent).toBe('0%');
    });

    it('should handle 100 volume', () => {
        updateVolumeDisplay(100);
        const volumeValue = document.getElementById('volumeValue');
        expect(volumeValue?.textContent).toBe('100%');
    });
});

describe('updateMuteButton', () => {
    beforeEach(() => {
        state.muted = false;
    });

    it('should show unmuted icon when not muted', () => {
        state.muted = false;
        updateMuteButton();
        const btn = document.getElementById('muteBtn');
        expect(btn?.textContent).toBe('🔊');
        expect(btn?.classList.contains('muted')).toBe(false);
    });

    it('should show muted icon when muted', () => {
        state.muted = true;
        updateMuteButton();
        const btn = document.getElementById('muteBtn');
        expect(btn?.textContent).toBe('🔇');
        expect(btn?.classList.contains('muted')).toBe(true);
    });
});

describe('updatePlayPauseButton', () => {
    beforeEach(() => {
        state.playing = false;
    });

    it('should show play icon when not playing', () => {
        state.playing = false;
        updatePlayPauseButton();
        const btn = document.getElementById('playPauseBtn');
        expect(btn?.textContent).toBe('▶');
    });

    it('should show pause icon when playing', () => {
        state.playing = true;
        updatePlayPauseButton();
        const btn = document.getElementById('playPauseBtn');
        expect(btn?.textContent).toBe('⏸');
    });
});

describe('updateTrackInfo', () => {
    it('should update title and artist', () => {
        updateTrackInfo('Test Song', 'Test Artist');
        const title = document.getElementById('trackTitle');
        const artist = document.getElementById('trackArtist');
        expect(title?.textContent).toBe('Test Song');
        expect(artist?.textContent).toBe('Test Artist');
    });

    it('should show placeholder for empty values', () => {
        updateTrackInfo('', '');
        const title = document.getElementById('trackTitle');
        const artist = document.getElementById('trackArtist');
        expect(title?.textContent).toBe('--');
        expect(artist?.textContent).toBe('--');
    });
});

describe('updateSourceDisplay', () => {
    it('should update source text in uppercase', () => {
        updateSourceDisplay('wifi');
        const source = document.getElementById('currentSource');
        expect(source?.textContent).toBe('WIFI');
    });

    it('should handle bluetooth source', () => {
        updateSourceDisplay('bluetooth');
        const source = document.getElementById('currentSource');
        expect(source?.textContent).toBe('BLUETOOTH');
    });
});

describe('updateVolumeSlider', () => {
    it('should update slider value', () => {
        updateVolumeSlider(80);
        const slider = document.getElementById('volumeSlider') as HTMLInputElement;
        expect(slider?.value).toBe('80');
    });
});

describe('updateSourceButtons', () => {
    it('should activate matching source button', () => {
        updateSourceButtons('wifi');
        const wifiBtn = document.querySelector('[data-source="wifi"]');
        const btBtn = document.querySelector('[data-source="bluetooth"]');
        expect(wifiBtn?.classList.contains('active')).toBe(true);
        expect(btBtn?.classList.contains('active')).toBe(false);
    });

    it('should deactivate non-matching buttons', () => {
        updateSourceButtons('bluetooth');
        const wifiBtn = document.querySelector('[data-source="wifi"]');
        const btBtn = document.querySelector('[data-source="bluetooth"]');
        expect(wifiBtn?.classList.contains('active')).toBe(false);
        expect(btBtn?.classList.contains('active')).toBe(true);
    });
});

describe('showToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('should show toast with message', () => {
        showToast('Test message');
        const toast = document.getElementById('toast');
        expect(toast?.textContent).toBe('Test message');
        expect(toast?.classList.contains('show')).toBe(true);
    });

    it('should add error class for error toast', () => {
        showToast('Error message', true);
        const toast = document.getElementById('toast');
        expect(toast?.classList.contains('error')).toBe(true);
    });

    it('should hide toast after duration', () => {
        showToast('Test message');
        const toast = document.getElementById('toast');

        vi.advanceTimersByTime(2000);

        expect(toast?.classList.contains('show')).toBe(false);
    });
});
