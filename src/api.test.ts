import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up minimal DOM for UI functions
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
    <span id="statusDot"></span>
    <span id="statusText"></span>
    <div id="toast"></div>
</body>
</html>
`);
global.document = dom.window.document;

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

import {
    apiCall,
    getPlayerStatus,
    sendPlayerCommand,
    setVolumeLevel,
    setMuteState,
    switchSource,
    triggerPreset,
    reboot,
    getEqualizer,
    setEqualizer,
} from './api.js';

describe('apiCall', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should make GET request to correct URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await apiCall('testCommand');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('command=testCommand')
        );
    });

    it('should parse JSON response', async () => {
        const mockResponse = { status: 'play', vol: '50' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockResponse)),
        });

        const result = await apiCall('getPlayerStatus');

        expect(result).toEqual(mockResponse);
    });

    it('should return text for non-JSON response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        const result = await apiCall('testCommand');

        expect(result).toBe('OK');
    });

    it('should encode command in URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await apiCall('setPlayerCmd:vol:50');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Avol%3A50')
        );
    });

    it('should throw on network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(apiCall('testCommand')).rejects.toThrow('Network error');
    });
});

describe('getPlayerStatus', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should call getPlayerStatus command', async () => {
        const mockStatus = {
            status: 'play',
            vol: '50',
            mute: '0',
            mode: '31',
        };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockStatus)),
        });

        const result = await getPlayerStatus();

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('getPlayerStatus')
        );
        expect(result).toEqual(mockStatus);
    });
});

describe('sendPlayerCommand', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should send play command', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await sendPlayerCommand('play');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Aplay')
        );
    });

    it('should send pause command', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await sendPlayerCommand('pause');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Apause')
        );
    });

    it('should send next command', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await sendPlayerCommand('next');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Anext')
        );
    });
});

describe('setVolumeLevel', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should set volume to specified level', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setVolumeLevel(75);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Avol%3A75')
        );
    });

    it('should handle 0 volume', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setVolumeLevel(0);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Avol%3A0')
        );
    });

    it('should handle 100 volume', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setVolumeLevel(100);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Avol%3A100')
        );
    });
});

describe('setMuteState', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should mute when true', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setMuteState(true);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Amute%3A1')
        );
    });

    it('should unmute when false', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setMuteState(false);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Amute%3A0')
        );
    });
});

describe('switchSource', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should switch to wifi', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await switchSource('wifi');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Aswitchmode%3Awifi')
        );
    });

    it('should switch to bluetooth', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await switchSource('bluetooth');

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Aswitchmode%3Abluetooth')
        );
    });
});

describe('triggerPreset', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should trigger preset 1', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await triggerPreset(1);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('MCUKeyShortClick%3A1')
        );
    });

    it('should trigger preset 10', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await triggerPreset(10);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('MCUKeyShortClick%3A10')
        );
    });
});

describe('reboot', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should send reboot command', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await reboot();

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('reboot')
        );
    });
});

describe('getEqualizer', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should call getEqualizer command', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('5'),
        });

        const result = await getEqualizer();

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('getEqualizer')
        );
        // API returns number when response is valid JSON number
        expect(result).toBe(5);
    });
});

describe('setEqualizer', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should set equalizer to Off (0)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setEqualizer(0);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Aequalizer%3A0')
        );
    });

    it('should set equalizer to Rock (19)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setEqualizer(19);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Aequalizer%3A19')
        );
    });

    it('should set equalizer to Jazz (11)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('OK'),
        });

        await setEqualizer(11);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('setPlayerCmd%3Aequalizer%3A11')
        );
    });
});
