/**
 * Control functions for Audio Pro C20
 */

import { CONFIG, MODE_MAP } from './config.js';
import { state } from './state.js';
import {
    sendPlayerCommand,
    setVolumeLevel,
    setMuteState,
    switchSource,
    triggerPreset,
    reboot,
    getPlayerStatus
} from './api.js';
import {
    showToast,
    updateConnectionStatus,
    updateVolumeDisplay,
    updateVolumeSlider,
    updateMuteButton,
    updatePlayPauseButton,
    updateTrackInfo,
    updateSourceDisplay,
    updateSourceButtons,
    getVolumeSlider
} from './ui.js';
import { decodeHex } from './utils.js';
import type { PlayerStatus } from './types.js';

// =============================================================================
// Playback Controls
// =============================================================================

export async function sendCommand(cmd: string): Promise<void> {
    try {
        await sendPlayerCommand(cmd);
        showToast(`Command: ${cmd}`);
        setTimeout(refreshStatus, CONFIG.commandDelay);
    } catch {
        // Error already shown
    }
}

// =============================================================================
// Volume Controls
// =============================================================================

export async function setVolume(value: number | string): Promise<void> {
    state.volume = typeof value === 'string' ? parseInt(value, 10) : value;
    updateVolumeDisplay(state.volume);
    try {
        await setVolumeLevel(state.volume);
    } catch {
        // Error already shown
    }
}

export function adjustVolume(delta: number): void {
    const newVolume = Math.max(0, Math.min(100, state.volume + delta));
    const slider = getVolumeSlider();
    if (slider) {
        slider.value = String(newVolume);
    }
    setVolume(newVolume);
}

// =============================================================================
// Mute Controls
// =============================================================================

export async function toggleMute(): Promise<void> {
    state.muted = !state.muted;
    try {
        await setMuteState(state.muted);
        updateMuteButton();
        showToast(state.muted ? 'Muted' : 'Unmuted');
    } catch {
        state.muted = !state.muted; // Revert on error
    }
}

// =============================================================================
// Source Selection
// =============================================================================

export async function setSource(source: string): Promise<void> {
    try {
        await switchSource(source);
        showToast(`Source: ${source}`);
        setTimeout(refreshStatus, CONFIG.sourceDelay);
    } catch {
        // Error already shown
    }
}

// =============================================================================
// Presets
// =============================================================================

export async function playPreset(num: number): Promise<void> {
    try {
        await triggerPreset(num);
        showToast(`Preset ${num}`);
        setTimeout(refreshStatus, CONFIG.sourceDelay);
    } catch {
        // Error already shown
    }
}

// =============================================================================
// Device Actions
// =============================================================================

export async function rebootDevice(): Promise<void> {
    if (confirm('Are you sure you want to reboot the speaker?')) {
        try {
            await reboot();
            showToast('Rebooting...');
            updateConnectionStatus(false);
        } catch {
            // Error already shown
        }
    }
}

// =============================================================================
// Status Updates
// =============================================================================

export async function refreshStatus(): Promise<void> {
    try {
        const status = await getPlayerStatus();
        updateConnectionStatus(true);

        if (status && typeof status === 'object') {
            processPlayerStatus(status);
        }
    } catch {
        // Connection error already shown
    }
}

function processPlayerStatus(status: PlayerStatus): void {
    // Update volume
    if (status.vol !== undefined) {
        state.volume = parseInt(status.vol, 10);
        updateVolumeSlider(state.volume);
        updateVolumeDisplay(state.volume);
    }

    // Update mute state
    if (status.mute !== undefined) {
        state.muted = status.mute === '1';
        updateMuteButton();
    }

    // Update play state
    if (status.status !== undefined) {
        state.playing = status.status === 'play';
        updatePlayPauseButton();
    }

    // Update track info (hex encoded)
    const title = status.Title ? decodeHex(status.Title) : '--';
    const artist = status.Artist ? decodeHex(status.Artist) : '--';
    updateTrackInfo(title, artist);

    // Update source
    if (status.mode !== undefined) {
        const source = MODE_MAP[status.mode] || status.mode;
        updateSourceDisplay(source);
        updateSourceButtons(source);
    }
}
