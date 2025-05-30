// js/terminal.js
import { terminalOutput, terminalInput } from './uiElements.js';
import { translations } from './config.js';
import { stripHtml, getCurrentLang } from './utils.js';
import { switchLanguage } from './languageManager.js'; // Для команды lang
import { setTheme } from './themeManager.js'; // Для команды theme
import { body } from './uiElements.js'; // Для проверки текущей темы

function appendToTerminal(text, type = 'output') {
    if (!terminalOutput) return;
    const p = document.createElement('p');
    if (type === 'input') {
        const currentLang = getCurrentLang();
        const user = translations[currentLang]?.terminalPromptUser || 'guest';
        const host = translations[currentLang]?.terminalPromptHost || 'timur-yakushev.dev';
        // Очищаем текст от HTML тегов перед вставкой в prompt
        const cleanText = stripHtml(text);
        p.innerHTML = `<span class="prompt"><span class="user">${user}</span>@<span class="host">${host}</span>:~$&nbsp;</span>${cleanText}`;
    } else {
        p.innerHTML = text; // Для вывода команд, где может быть HTML (например, <strong>)
    }
    if (type === 'command-output') {
        p.classList.add('command-output');
    }
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function printWelcomeMessage() {
    const currentLang = getCurrentLang();
    appendToTerminal(translations[currentLang]?.terminalWelcome || "Welcome! Type 'help'.");
}

function executeCommand(command) {
    appendToTerminal(command, 'input');
    const [cmd, ...args] = command.toLowerCase().split(' ');
    const currentLang = getCurrentLang();
    let output = '';

    switch (cmd) {
        case 'help':
            output = `<strong>${translations[currentLang]?.terminalHelpIntro || 'Available commands:'}</strong>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdHelp || 'help - Show this help'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdAbout || 'about - About me'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdProject || 'project - Key project info'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdServices || 'services - Services I offer'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdResume || 'resume - Career path'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdContacts || 'contacts - Contact info'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdTheme || 'theme - Toggle theme'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdLang || 'lang [ru|en|sr] - Change language'}</span>\n`;
            output += `<span class="help-command">${translations[currentLang]?.terminalCmdClear || 'clear - Clear terminal'}</span>`;
            break;
        case 'about':
            output = `<strong>${translations[currentLang]?.aboutTitle || 'My Expertise'}</strong>\n`;
            output += stripHtml(translations[currentLang]?.aboutP1 || '') + '\n';
            output += stripHtml(translations[currentLang]?.aboutP2 || '');
            break;
        case 'project':
            output = `<strong>${translations[currentLang]?.caseStudyTitle || 'Key Project'}</strong>\n`;
            output += `<strong>${translations[currentLang]?.caseStudyTaskLabel || 'Task:'}</strong> ${stripHtml(translations[currentLang]?.caseStudyTaskText || '')}\n`;
            // Для caseStudySolutionText, где есть <code>, нужно передать HTML как есть
            output += `<strong>${translations[currentLang]?.caseStudySolutionLabel || 'Solution:'}</strong> ${translations[currentLang]?.caseStudySolutionText || ''}\n`; 
            output += `<strong>${translations[currentLang]?.caseStudyResultsLabel || 'Results:'}</strong>\n`;
            output += `- ${stripHtml(translations[currentLang]?.caseStudyResult1 || '')}\n`;
            output += `- ${stripHtml(translations[currentLang]?.caseStudyResult2 || '')}\n`;
            output += `- ${stripHtml(translations[currentLang]?.caseStudyResult3 || '')}\n`;
            output += `- ${stripHtml(translations[currentLang]?.caseStudyResult4 || '')}`;
            break;
        case 'services':
            output = `<strong>${translations[currentLang]?.servicesTitle || 'Services'}</strong>\n`;
            output += stripHtml(translations[currentLang]?.servicesP1 || '');
            break;
        case 'resume':
            output = `<strong>${translations[currentLang]?.resumeTitle || 'Career Path'}</strong>\n`;
            output += stripHtml(translations[currentLang]?.resumeP1 || '') + '\n';
            output += `(${stripHtml(translations[currentLang]?.downloadResumeButton) || 'Download Full Resume (PDF)'})`;
            break;
        case 'contacts':
            output = `<strong>${translations[currentLang]?.contactsTitle || 'Contacts'}</strong>\n`;
            output += `${stripHtml(translations[currentLang]?.contactEmail) || 'Email'}: example@example.com\n`; // Замените на реальный email
            output += `${stripHtml(translations[currentLang]?.contactLinkedIn) || 'LinkedIn'}: [Your LinkedIn Link]\n`;
            output += `${stripHtml(translations[currentLang]?.contactGitHub) || 'GitHub'}: [Your GitHub Link]\n`;
            output += `${stripHtml(translations[currentLang]?.contactTelegram) || 'Telegram'}: [Your Telegram Link]`;
            break;
        case 'theme':
            setTheme(body.classList.contains('dark-theme') ? 'light' : 'dark');
            output = `Theme toggled.`;
            break;
        case 'lang':
            if (args[0] && translations[args[0]]) {
                switchLanguage(args[0]);
                // Приветственное сообщение обновится автоматически из-за вызова switchLanguage
                // который должен обновить весь UI, включая статичные тексты терминала если они есть
                // и затем мы перепечатываем welcome message
                output = `Language switched to ${args[0].toUpperCase()}.`;
                // Чтобы обновить уже выведенные строки, нужно их перерисовать или очистить терминал.
                // Проще всего очистить и показать новое приветствие.
                if(terminalOutput) terminalOutput.innerHTML = '';
                printWelcomeMessage();
            } else {
                output = `Usage: lang [ru|en|sr]`;
            }
            break;
        case 'clear':
            if (terminalOutput) terminalOutput.innerHTML = '';
            return; 
        default:
            output = `${translations[currentLang]?.terminalCmdNotFound || 'Command not found: '}${cmd}`;
    }
    if (output) {
        appendToTerminal(output, 'command-output');
    }
}

export function initTerminal() {
    console.log("DEBUG: Terminal called");

    if (!terminalInput || !terminalOutput) {
        console.error("Terminal elements not found!");
        return;
    }

    terminalInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = this.value.trim();
            if (command) {
                executeCommand(command);
                this.value = '';
            }
        }
    });
    printWelcomeMessage();
    // if (terminalInput) terminalInput.focus();
}

// Функция для обновления статичных текстов терминала при смене языка извне
export function updateTerminalOnLangChange(lang) {
    
    if (terminalOutput) {
        // Обновляем промпт в уже выведенных строках (это сложно, проще очистить или просто новое приветствие)
        // Пока просто перепечатаем приветствие, если терминал пуст или почти пуст
        // Или можно добавить логику обновления промпта в существующих строках, но это сложнее.
        // Для простоты - при смене языка извне терминала, старый вывод остается как есть,
        // только новые команды будут с новым языком промпта.
        // Либо, если команда 'lang' была вызвана из терминала, то он уже очищен.
    }
    // Обновляем data-lang-key для промпта
     const terminalPromptUserEl = document.querySelector('.terminal-input-line .prompt .user');
     const terminalPromptHostEl = document.querySelector('.terminal-input-line .prompt .host');
     if(terminalPromptUserEl && translations[lang]?.terminalPromptUser) terminalPromptUserEl.textContent = translations[lang].terminalPromptUser;
     if(terminalPromptHostEl && translations[lang]?.terminalPromptHost) terminalPromptHostEl.textContent = translations[lang].terminalPromptHost;
}