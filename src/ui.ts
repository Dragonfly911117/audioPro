/**
 * UI update functions for Audio Pro C20 Controller
 */

import { CONFIG } from './config.js';
import { state } from './state.js';

// =============================================================================
// DOM Element Getters
// =============================================================================

export function getElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

export function getStatusDot(): HTMLElement | null {
    return getElement('statusDot');
}

export function getStatusText(): HTMLElement | null {
    return getElement('statusText');
}

export function getTrackTitle(): HTMLElement | null {
    return getElement('trackTitle');
}

export function getTrackArtist(): HTMLElement | null {
    return getElement('trackArtist');
}

export function getCurrentSource(): HTMLElement | null {
    return getElement('currentSource');
}

export function getPlayPauseBtn(): HTMLElement | null {
    return getElement('playPauseBtn');
}

export function getVolumeSlider(): HTMLInputElement | null {
    return getElement<HTMLInputElement>('volumeSlider');
}

export function getVolumeValue(): HTMLElement | null {
    return getElement('volumeValue');
}

export function getMuteBtn(): HTMLElement | null {
    return getElement('muteBtn');
}

export function getToast(): HTMLElement | null {
    return getElement('toast');
}

// =============================================================================
// UI Update Functions
// =============================================================================

export function updateConnectionStatus(connected: boolean): void {
    const dot = getStatusDot();
    const text = getStatusText();

    if (dot) {
        dot.classList.toggle('connected', connected);
    }
    if (text) {
        text.textContent = connected ? 'Connected' : 'Disconnected';
    }
}

export function updateVolumeDisplay(value: number): void {
    const volumeValue = getVolumeValue();
    if (volumeValue) {
        volumeValue.textContent = `${value}%`;
    }
}

export function updateMuteButton(): void {
    const btn = getMuteBtn();
    if (btn) {
        btn.textContent = state.muted ? '🔇' : '🔊';
        btn.classList.toggle('muted', state.muted);
    }
}

export function updatePlayPauseButton(): void {
    const btn = getPlayPauseBtn();
    if (btn) {
        btn.textContent = state.playing ? '⏸' : '▶';
    }
}

export function updateSourceButtons(currentSource: string): void {
    document.querySelectorAll<HTMLElement>('.source-btn').forEach(btn => {
        const btnSource = btn.dataset.source;
        btn.classList.toggle('active', btnSource === currentSource);
    });
}

export function updateTrackInfo(title: string, artist: string): void {
    const titleEl = getTrackTitle();
    const artistEl = getTrackArtist();

    if (titleEl) {
        titleEl.textContent = title || '--';
    }
    if (artistEl) {
        artistEl.textContent = artist || '--';
    }
}

export function updateSourceDisplay(source: string): void {
    const sourceEl = getCurrentSource();
    if (sourceEl) {
        sourceEl.textContent = source.toUpperCase();
    }
}

export function updateVolumeSlider(volume: number): void {
    const slider = getVolumeSlider();
    if (slider) {
        slider.value = String(volume);
    }
}

// =============================================================================
// Toast Notifications
// =============================================================================

export function showToast(message: string, isError: boolean = false): void {
    const toast = getToast();
    if (toast) {
        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), CONFIG.toastDuration);
    }
}
