// js/themeManager.js
import { body, settingsPanelOverlay } from './uiElements.js'; // ИМПОРТИРУЕМ settingsPanelOverlay
import { updatePanelControlsState } from './settingsPanel.js';

// Глобальная ссылка на функцию обновления цветов анимации
let onThemeChangeCallback = null; 
export function setOnThemeChangeCallback(callback) {
    onThemeChangeCallback = callback;
}

export function setTheme(theme) {
    console.log("DEBUG: setTheme called with theme:", theme); 
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }

    if (typeof onThemeChangeCallback === 'function') {
        onThemeChangeCallback();
    }

    // Проверяем, что settingsPanelOverlay существует и видим, прежде чем вызывать updatePanelControlsState
    if (settingsPanelOverlay && typeof settingsPanelOverlay.classList !== 'undefined' && settingsPanelOverlay.classList.contains('show')) {
        if (typeof updatePanelControlsState === 'function') {
             updatePanelControlsState();
        } else {
            console.warn("DEBUG: updatePanelControlsState is not a function in themeManager");
        }
    } else {
        console.log("DEBUG: Settings panel overlay not shown or not defined, not updating panel controls from setTheme.");
    }
}

export function initTheme() {
    console.log("DEBUG: initTheme called");
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let themeToSet = 'light'; // default theme

    if (savedTheme) {
        themeToSet = savedTheme;
    } else if (prefersDark) {
        themeToSet = 'dark';
    }
    setTheme(themeToSet);
}