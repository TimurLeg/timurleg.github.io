// js/main.js
import { initTheme, setOnThemeChangeCallback } from './themeManager.js';
import { initLanguage, switchLanguage, setOnLangChangeTerminalCallback } from './languageManager.js';
import { initSettingsPanel } from './settingsPanel.js';
import { initParticleAnimation } from './particleAnimation.js';
import { initTerminal, updateTerminalOnLangChange } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOMContentLoaded - main.js is running!");
    initLanguage();
    initTheme();
    
    // Инициализируем анимацию частиц и передаем колбэк для обновления цветов
    const updateAnimationColorsCallback = initParticleAnimation();
    setOnThemeChangeCallback(updateAnimationColorsCallback); // Связываем смену темы с обновлением цветов анимации

    initSettingsPanel();

    initTerminal();
    setOnLangChangeTerminalCallback(updateTerminalOnLangChange); // Связываем смену языка с обновлением терминала


    // Принудительно обновляем язык после инициализации всех компонентов,
    // чтобы тексты в динамически созданных или обновляемых элементах (как DOS панель)
    // сразу отобразились на нужном языке.
    const currentLang = localStorage.getItem('language') || navigator.language.split('-')[0] || 'ru';
    switchLanguage(currentLang); 
});