// js/uiElements.js
export const body = document.body;
export const settingsTriggerButton = document.getElementById('settings-trigger');
export const settingsPanelOverlay = document.getElementById('settings-panel-overlay');
export const settingsPanel = document.getElementById('settings-panel');
export const closeSettingsPanelButton = document.getElementById('close-settings-panel');
export const panelLangButtons = settingsPanel.querySelectorAll('.lang-panel-button');
export const panelThemeButtons = settingsPanel.querySelectorAll('.theme-panel-button');

export const terminalOutput = document.getElementById('terminalOutput');
export const terminalInput = document.getElementById('terminalInput');
export const canvas = document.getElementById('interactive-background');
export const ctx = canvas ? canvas.getContext('2d') : null;
