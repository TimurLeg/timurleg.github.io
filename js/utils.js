// js/utils.js
export function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

export function getCurrentLang() {
    return document.documentElement.lang || 'ru';
}