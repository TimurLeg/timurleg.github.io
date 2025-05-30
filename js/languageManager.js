// js/languageManager.js
import { translations } from './config.js';
import { settingsPanelOverlay, body } from './uiElements.js';
import { updatePanelControlsState } from './settingsPanel.js';

// Глобальная ссылка на функцию обновления UI терминала, если она существует
let onLangChangeTerminalCallback = null;
export function setOnLangChangeTerminalCallback(callback) {
    onLangChangeTerminalCallback = callback;
}

export function switchLanguage(lang) {
    if (translations[lang]) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key]; // Используем innerHTML для поддержки <code> тегов
            }
        });
        const titleEl = document.querySelector('title');
        if (titleEl && translations[lang]['siteTitle']) {
            titleEl.textContent = translations[lang]['siteTitle'];
        }

        localStorage.setItem('language', lang);

        if (typeof onLangChangeTerminalCallback === 'function') {
            onLangChangeTerminalCallback(lang);
        }

        // Проверяем, что settingsPanelOverlay действительно существует и видим, прежде чем вызывать updatePanelControlsState
        if (settingsPanelOverlay && typeof settingsPanelOverlay.classList !== 'undefined' && settingsPanelOverlay.classList.contains('show')) {
            if (typeof updatePanelControlsState === 'function') {
                 updatePanelControlsState();
            }
        }
    } else {
        console.warn(`Переводы для языка "${lang}" не найдены.`);
    }
}

export function initLanguage() {
    console.log("DEBUG: initLanguage called"); 
    const savedLanguage = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];

    let langToSet = 'en'; // default lang

    if (savedLanguage && translations[savedLanguage]) {
        langToSet = savedLanguage;
    } else if (translations[browserLang]) {
        langToSet = browserLang;
    }
    switchLanguage(langToSet);
}