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

export interface SpeakerConfig {
    name: string;
    ip: string;
    port: number;
}

export async function loadSpeakerConfig(): Promise<SpeakerConfig> {
    const response = await fetch('/config');
    return response.json();
}
