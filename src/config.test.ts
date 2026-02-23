import { describe, it, expect } from 'vitest';
import { CONFIG, API_BASE, MODE_MAP, loadSpeakerConfig } from './config.js';

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
