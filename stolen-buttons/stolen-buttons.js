const DELETE_MODE = 'delete-mode';
const THEME_MODE = 'themeMode';
let fullRefresh = false;
const THEME_ORDER = ['system', 'light', 'dark'];
const THEME_ICONS = {
    light: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="128" y1="40" x2="128" y2="16" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" stroke-width="16"/><line x1="64" y1="64" x2="48" y2="48" fill="none" stroke="currentColor" stroke-width="16"/><line x1="64" y1="192" x2="48" y2="208" fill="none" stroke="currentColor" stroke-width="16"/><line x1="192" y1="64" x2="208" y2="48" fill="none" stroke="currentColor" stroke-width="16"/><line x1="192" y1="192" x2="208" y2="208" fill="none" stroke="currentColor" stroke-width="16"/><line x1="40" y1="128" x2="16" y2="128" fill="none" stroke="currentColor" stroke-width="16"/><line x1="128" y1="216" x2="128" y2="240" fill="none" stroke="currentColor" stroke-width="16"/><line x1="216" y1="128" x2="240" y2="128" fill="none" stroke="currentColor" stroke-width="16"/></svg>',
    dark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" fill="none" stroke="currentColor" stroke-width="16"/></svg>',
    system: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-width="16"/><line x1="128" y1="32" x2="128" y2="224" fill="none" stroke="currentColor" stroke-width="16"/><line x1="192" y1="56.45" x2="192" y2="199.55" fill="none" stroke="currentColor" stroke-width="16"/><line x1="160" y1="37.47" x2="160" y2="218.53" fill="none" stroke="currentColor" stroke-width="16"/></svg>'
};

const sendToBackground = (type, value) => {
    chrome.runtime.sendMessage({ type, value, target: 'background' });
}

const getButtons = async () => {
    const { buttons } = await chrome.storage.local.get('buttons');
    const add = [];
    if (fullRefresh) document.getElementById('stolen-buttons').innerHTML = '';
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        let div = fullRefresh ? null : document.querySelector(`[data-id="${button.id}"]`);
        if (div === null) {
            if (button.hidden) continue;
            div = document.createElement('div');
            div.classList.add('stolen-button');
            div.innerHTML = button.code;
            div.addEventListener('click', ()=> {
                if (document.body.classList.contains(DELETE_MODE)) {
                    div.classList.toggle('selected');
                    if (Array.from(document.querySelectorAll("#stolen-buttons div.stolen-button.selected")).length > 0) {
                        document.getElementById('delete').classList.remove('disabled');
                    } else {
                        document.getElementById('delete').classList.add('disabled');
                    }
                }
            });
            div.children[0].addEventListener('click', ()=>{
                window.open(button.source, '_blank').focus();
            });
            div.dataset.id = button.id;
            div.dataset.name = button.name;
            div.dataset.stolenAt = button.stolenAt;
            add.push(div);
        } else {
            if (button.hidden) div.remove();
        }
    }
    document.getElementById('stolen-buttons').prepend(...add);
}

const deleteButtons = async () => {
    const value = Array.from(document.querySelectorAll("#stolen-buttons div.stolen-button.selected")).map(selected => {
        return {
            stolenAt: selected.dataset.stolenAt,
            name: selected.dataset.name,
        }
    });
    sendToBackground('remove-buttons', JSON.stringify(value));
}

document.addEventListener('DOMContentLoaded', () => {
    getButtons();
    initThemeMode();
});

chrome.storage.onChanged.addListener((obj) => {
    if (obj.hasOwnProperty('buttons') || obj.hasOwnProperty('maximum')) {
        getButtons();
    }
    if (obj.hasOwnProperty(THEME_MODE)) {
        applyThemeMode(obj[THEME_MODE].newValue || 'system');
    }
});

document.getElementById('delete-mode').addEventListener('click', ()=> {
    document.getElementById('title').innerText = 'Edit';
    document.body.classList.add(DELETE_MODE);
});

document.getElementById('exit-mode').addEventListener('click', ()=> {
    document.querySelectorAll("#stolen-buttons div.stolen-button.selected").forEach(button => {
        button.classList.remove('selected');
    });
    document.getElementById('delete').classList.add('disabled');
    document.getElementById('title').innerText = 'Stolen Buttons';
    document.body.classList.remove(DELETE_MODE);
});

document.getElementById('delete').addEventListener('click', ()=> {
    deleteButtons();
    document.getElementById('delete').classList.add('disabled');
});

const handleMessages = async (message) => {
    if (message.target !== 'stolen-buttons') return false;
    switch (message.type) {
        case 'full-refresh':
            fullRefresh = true;
            break;
        default:
            return false;
    }
}

chrome.runtime.onMessage.addListener(handleMessages);

const applyThemeMode = (mode) => {
    if (mode === 'dark' || mode === 'light') {
        document.documentElement.setAttribute('data-theme', mode);
    } else {
        document.documentElement.removeAttribute('data-theme');
        mode = 'system';
    }
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.dataset.mode = mode;
        toggle.innerHTML = THEME_ICONS[mode] || THEME_ICONS.system;
        toggle.setAttribute('aria-label', `Theme mode: ${mode}`);
    }
}

const initThemeMode = async () => {
    const stored = await chrome.storage.local.get(THEME_MODE);
    const mode = ['system', 'light', 'dark'].includes(stored[THEME_MODE]) ? stored[THEME_MODE] : 'system';
    applyThemeMode(mode);
}

document.querySelectorAll('.mode-button').forEach(button => {
    if (button.id !== 'theme-toggle') return;
    button.addEventListener('click', () => {
        const current = button.dataset.mode || 'system';
        const idx = THEME_ORDER.indexOf(current);
        const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
        chrome.storage.local.set({ [THEME_MODE]: next });
        applyThemeMode(next);
    });
});
