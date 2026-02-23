/**
 * Type definitions for Audio Pro C20 Controller
 */

export interface PlayerStatus {
    type?: string;
    ch?: string;
    mode?: string;
    loop?: string;
    eq?: string;
    vendor?: string;
    status?: 'play' | 'pause' | 'stop';
    curpos?: string;
    offset_pts?: string;
    totlen?: string;
    Title?: string;
    Artist?: string;
    Album?: string;
    alarmflag?: string;
    plicount?: string;
    plicurr?: string;
    vol?: string;
    mute?: '0' | '1';
}

export interface AppState {
    volume: number;
    muted: boolean;
    playing: boolean;
    statusInterval: ReturnType<typeof setInterval> | null;
}

export interface AppConfig {
    deviceIp: string;
    refreshInterval: number;
    toastDuration: number;
    commandDelay: number;
    sourceDelay: number;
}

export type SourceMode = 'wifi' | 'bluetooth' | 'line-in' | 'optical' | 'udisk' | 'PCUSB';

export type PlaybackCommand = 'play' | 'pause' | 'stop' | 'prev' | 'next' | 'onepause' | 'resume';

export interface DOMElements {
    statusDot: HTMLElement | null;
    statusText: HTMLElement | null;
    trackTitle: HTMLElement | null;
    trackArtist: HTMLElement | null;
    currentSource: HTMLElement | null;
    playPauseBtn: HTMLElement | null;
    volumeSlider: HTMLInputElement | null;
    volumeValue: HTMLElement | null;
    muteBtn: HTMLElement | null;
    toast: HTMLElement | null;
}
