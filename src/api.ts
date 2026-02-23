/**
 * API communication module for Audio Pro C20
 */

import { API_BASE } from './config.js';
import type { PlayerStatus } from './types.js';
import { showToast, updateConnectionStatus } from './ui.js';

export async function apiCall<T = string>(command: string): Promise<T> {
    try {
        const response = await fetch(`${API_BASE}?command=${encodeURIComponent(command)}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        try {
            return JSON.parse(text) as T;
        } catch {
            return text as T;
        }
    } catch (error) {
        console.error('API Error:', error);
        showToast('Connection error', true);
        updateConnectionStatus(false);
        throw error;
    }
}

export async function getPlayerStatus(): Promise<PlayerStatus> {
    return apiCall<PlayerStatus>('getPlayerStatus');
}

export async function sendPlayerCommand(cmd: string): Promise<string> {
    return apiCall(`setPlayerCmd:${cmd}`);
}

export async function setVolumeLevel(volume: number): Promise<string> {
    return apiCall(`setPlayerCmd:vol:${volume}`);
}

export async function setMuteState(muted: boolean): Promise<string> {
    return apiCall(`setPlayerCmd:mute:${muted ? 1 : 0}`);
}

export async function switchSource(source: string): Promise<string> {
    return apiCall(`setPlayerCmd:switchmode:${source}`);
}

export async function triggerPreset(num: number): Promise<string> {
    return apiCall(`MCUKeyShortClick:${num}`);
}

export async function reboot(): Promise<string> {
    return apiCall('reboot');
}
