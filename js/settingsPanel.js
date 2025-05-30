// js/settingsPanel.js
import { 
    settingsTriggerButton, 
    settingsPanelOverlay, 
    settingsPanel, 
    closeSettingsPanelButton,
    panelLangButtons,
    panelThemeButtons,
    body 
} from './uiElements.js';
import { switchLanguage } from './languageManager.js';
import { setTheme } from './themeManager.js';

export function updatePanelControlsState() {
    const currentLang = localStorage.getItem('language') || document.documentElement.lang || 'ru';
    panelLangButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    const currentTheme = localStorage.getItem('theme') || (body.classList.contains('dark-theme') ? 'dark' : 'light');
    panelThemeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeTarget === currentTheme);
    });
}


function openSettingsPanel() {
    settingsPanelOverlay.classList.add('show');
    updatePanelControlsState();
}

function closeSettingsPanel() {
    settingsPanelOverlay.classList.remove('show');
}

export function initSettingsPanel() {
    console.log("DEBUG: SettingsPanel called");

    if (!settingsTriggerButton || !settingsPanelOverlay || !settingsPanel || !closeSettingsPanelButton) {
        console.error("Settings panel elements not found!");
        return;
    }

    settingsTriggerButton.addEventListener('click', openSettingsPanel);
    closeSettingsPanelButton.addEventListener('click', closeSettingsPanel);
    
    settingsPanelOverlay.addEventListener('click', (event) => {
        if (event.target === settingsPanelOverlay) {
            closeSettingsPanel();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && settingsPanelOverlay.classList.contains('show')) {
            closeSettingsPanel();
        }
    });

    panelLangButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            switchLanguage(e.target.dataset.lang);
        });
    });

    panelThemeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            setTheme(e.target.dataset.themeTarget);
        });
    });
}