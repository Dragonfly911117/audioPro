/**
 * Configuration for Audio Pro C20 Controller
 */

import type { AppConfig } from './types.js';

export const CONFIG: AppConfig = {
    deviceIp: '', // Loaded from server
    refreshInterval: 5000,
    toastDuration: 2000,
    commandDelay: 500,
    sourceDelay: 1000
};

// Use local proxy to avoid CORS issues
export const API_BASE = '/api';

export const MODE_MAP: Record<string, string> = {
    '10': 'wifi',
    '31': 'bluetooth',
    '40': 'line-in',
    '41': 'line-in',
    '43': 'optical',
    '11': 'udisk',
    '99': 'PCUSB'
};

export const EQ_PRESETS: Record<string, string> = {
    '0': 'Off',
    '1': 'Flat',
    '2': 'Acoustic',
    '3': 'Bass Booster',
    '4': 'Bass Reducer',
    '5': 'Classical',
    '6': 'Dance',
    '7': 'Deep',
    '8': 'Electronic',
    '9': 'Game',
    '10': 'Hip-Hop',
    '11': 'Jazz',
    '12': 'Latin',
    '13': 'Loudness',
    '14': 'Lounge',
    '15': 'Movie',
    '16': 'Piano',
    '17': 'Pop',
    '18': 'R&B',
    '19': 'Rock',
    '20': 'Small Speakers',
    '21': 'Spoken Word',
    '22': 'Treble Booster',
    '23': 'Treble Reducer',
    '24': 'Vocal Booster'
};

export interface SpeakerConfig {
    name: string;
    ip: string;
    port: number;
}

export async function loadSpeakerConfig(): Promise<SpeakerConfig> {
    const response = await fetch('/config');
    return response.json();
}
