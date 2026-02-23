/**
 * Utility functions for Audio Pro C20 Controller
 */

/**
 * Decode hex-encoded strings from LinkPlay API
 */
export function decodeHex(hex: string): string {
    if (!hex || hex === '0') return '';
    try {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return decodeURIComponent(escape(str));
    } catch {
        return hex;
    }
}
