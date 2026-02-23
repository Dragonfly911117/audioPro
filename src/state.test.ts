import { describe, it, expect, beforeEach } from 'vitest';
import { state } from './state.js';

describe('state', () => {
    beforeEach(() => {
        // Reset state before each test
        state.volume = 50;
        state.muted = false;
        state.playing = false;
        state.eq = '0';
        state.statusInterval = null;
    });

    it('should have default volume of 50', () => {
        expect(state.volume).toBe(50);
    });

    it('should have default muted state of false', () => {
        expect(state.muted).toBe(false);
    });

    it('should have default playing state of false', () => {
        expect(state.playing).toBe(false);
    });

    it('should have default statusInterval of null', () => {
        expect(state.statusInterval).toBeNull();
    });

    it('should have default eq of 0 (Off)', () => {
        expect(state.eq).toBe('0');
    });

    it('should allow volume to be updated', () => {
        state.volume = 75;
        expect(state.volume).toBe(75);
    });

    it('should allow muted state to be toggled', () => {
        state.muted = true;
        expect(state.muted).toBe(true);
    });

    it('should allow playing state to be toggled', () => {
        state.playing = true;
        expect(state.playing).toBe(true);
    });

    it('should allow statusInterval to be set', () => {
        const interval = setInterval(() => {}, 1000);
        state.statusInterval = interval;
        expect(state.statusInterval).toBe(interval);
        clearInterval(interval);
    });

    it('should allow eq preset to be updated', () => {
        state.eq = '11';
        expect(state.eq).toBe('11');
    });

    it('should accept volume values from 0 to 100', () => {
        state.volume = 0;
        expect(state.volume).toBe(0);

        state.volume = 100;
        expect(state.volume).toBe(100);
    });
});
