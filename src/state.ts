/**
 * Application state management
 */

import type { AppState } from './types.js';

export const state: AppState = {
    volume: 50,
    muted: false,
    playing: false,
    statusInterval: null
};
