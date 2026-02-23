import { describe, it, expect } from 'vitest';
import { decodeHex } from './utils.js';

describe('decodeHex', () => {
    it('should decode simple ASCII hex string', () => {
        // "Hello" in hex
        const hex = '48656c6c6f';
        expect(decodeHex(hex)).toBe('Hello');
    });

    it('should decode hex string with spaces', () => {
        // "Hi There" in hex
        const hex = '4869205468657265';
        expect(decodeHex(hex)).toBe('Hi There');
    });

    it('should return empty string for empty input', () => {
        expect(decodeHex('')).toBe('');
    });

    it('should return empty string for "0" input', () => {
        expect(decodeHex('0')).toBe('');
    });

    it('should handle UTF-8 encoded strings', () => {
        // "Café" in UTF-8 hex
        const hex = '436166c3a9';
        expect(decodeHex(hex)).toBe('Café');
    });

    it('should handle special characters', () => {
        // "Test!" in hex
        const hex = '5465737421';
        expect(decodeHex(hex)).toBe('Test!');
    });

    it('should handle invalid hex gracefully', () => {
        // Invalid hex - the function attempts to decode it
        // Even invalid hex gets processed (xyz -> 0x0y 0x0z)
        const invalidHex = 'xyz';
        const result = decodeHex(invalidHex);
        // Function doesn't throw, returns some decoded value
        expect(typeof result).toBe('string');
    });

    it('should decode track title from API response', () => {
        // "This Devastation" in hex (from actual API response)
        const hex = '54686973204465766173746174696f6e';
        expect(decodeHex(hex)).toBe('This Devastation');
    });

    it('should decode artist name with special characters', () => {
        // "Pedro Orduña" in UTF-8 hex
        const hex = '506564726f204f726475c3b161';
        expect(decodeHex(hex)).toBe('Pedro Orduña');
    });
});
