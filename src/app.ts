/**
 * Audio Pro C20 Controller - Main Entry Point
 */

import { CONFIG, loadSpeakerConfig } from './config.js';
import { state } from './state.js';
import {
    sendCommand,
    setVolume,
    adjustVolume,
    toggleMute,
    setSource,
    setEq,
    playPreset,
    rebootDevice,
    refreshStatus
} from './controls.js';
import { updateVolumeDisplay } from './ui.js';

// =============================================================================
// Global Exports (for inline HTML event handlers)
// =============================================================================

declare global {
    interface Window {
        sendCommand: typeof sendCommand;
        setVolume: typeof setVolume;
        adjustVolume: typeof adjustVolume;
        updateVolumeDisplay: typeof updateVolumeDisplay;
        toggleMute: typeof toggleMute;
        setSource: typeof setSource;
        setEq: typeof setEq;
        playPreset: typeof playPreset;
        rebootDevice: typeof rebootDevice;
        refreshStatus: typeof refreshStatus;
    }
}

window.sendCommand = sendCommand;
window.setVolume = setVolume;
window.adjustVolume = adjustVolume;
window.updateVolumeDisplay = updateVolumeDisplay;
window.toggleMute = toggleMute;
window.setSource = setSource;
window.setEq = setEq;
window.playPreset = playPreset;
window.rebootDevice = rebootDevice;
window.refreshStatus = refreshStatus;

// =============================================================================
// Initialization
// =============================================================================

async function init(): Promise<void> {
    // Load speaker config and update UI
    try {
        const speaker = await loadSpeakerConfig();
        document.title = `${speaker.name} Controller`;
        const heading = document.querySelector('header h1');
        if (heading) {
            heading.textContent = speaker.name;
        }
    } catch (e) {
        console.error('Failed to load speaker config:', e);
    }

    refreshStatus();
    state.statusInterval = setInterval(refreshStatus, CONFIG.refreshInterval);
}

document.addEventListener('DOMContentLoaded', init);
