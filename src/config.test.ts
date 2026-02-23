import { describe, it, expect } from 'vitest';
import { CONFIG, API_BASE, MODE_MAP, EQ_PRESETS, loadSpeakerConfig } from './config.js';

describe('CONFIG', () => {
    it('should have deviceIp as empty string (loaded from server)', () => {
        expect(CONFIG.deviceIp).toBe('');
    });

    it('should have valid refresh interval', () => {
        expect(CONFIG.refreshInterval).toBeGreaterThan(0);
        expect(CONFIG.refreshInterval).toBe(5000);
    });

    it('should have valid toast duration', () => {
        expect(CONFIG.toastDuration).toBeGreaterThan(0);
        expect(CONFIG.toastDuration).toBe(2000);
    });

    it('should have valid command delay', () => {
        expect(CONFIG.commandDelay).toBeGreaterThan(0);
        expect(CONFIG.commandDelay).toBe(500);
    });

    it('should have valid source delay', () => {
        expect(CONFIG.sourceDelay).toBeGreaterThan(0);
        expect(CONFIG.sourceDelay).toBe(1000);
    });
});

describe('API_BASE', () => {
    it('should use local proxy endpoint', () => {
        expect(API_BASE).toBe('/api');
    });

    it('should be a relative path for proxy', () => {
        expect(API_BASE).toMatch(/^\//);
    });
});

describe('MODE_MAP', () => {
    it('should map mode 10 to wifi', () => {
        expect(MODE_MAP['10']).toBe('wifi');
    });

    it('should map mode 31 to bluetooth', () => {
        expect(MODE_MAP['31']).toBe('bluetooth');
    });

    it('should map mode 40 to line-in', () => {
        expect(MODE_MAP['40']).toBe('line-in');
    });

    it('should map mode 41 to line-in', () => {
        expect(MODE_MAP['41']).toBe('line-in');
    });

    it('should map mode 43 to optical', () => {
        expect(MODE_MAP['43']).toBe('optical');
    });

    it('should map mode 11 to udisk', () => {
        expect(MODE_MAP['11']).toBe('udisk');
    });

    it('should map mode 99 to PCUSB', () => {
        expect(MODE_MAP['99']).toBe('PCUSB');
    });

    it('should have all expected modes', () => {
        const expectedModes = ['10', '31', '40', '41', '43', '11', '99'];
        expect(Object.keys(MODE_MAP)).toEqual(expect.arrayContaining(expectedModes));
    });
});

describe('EQ_PRESETS', () => {
    it('should have 25 presets', () => {
        expect(Object.keys(EQ_PRESETS)).toHaveLength(25);
    });

    it('should map preset 0 to Off', () => {
        expect(EQ_PRESETS['0']).toBe('Off');
    });

    it('should map preset 1 to Flat', () => {
        expect(EQ_PRESETS['1']).toBe('Flat');
    });

    it('should map preset 11 to Jazz', () => {
        expect(EQ_PRESETS['11']).toBe('Jazz');
    });

    it('should map preset 19 to Rock', () => {
        expect(EQ_PRESETS['19']).toBe('Rock');
    });

    it('should map preset 24 to Vocal Booster', () => {
        expect(EQ_PRESETS['24']).toBe('Vocal Booster');
    });

    it('should have all presets from 0 to 24', () => {
        for (let i = 0; i <= 24; i++) {
            expect(EQ_PRESETS[String(i)]).toBeDefined();
        }
    });
});
