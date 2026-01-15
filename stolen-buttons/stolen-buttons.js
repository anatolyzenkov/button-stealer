const DELETE_MODE = 'delete-mode';
const THEME_MODE = 'themeMode';
let fullRefresh = false;
const THEME_ORDER = ['system', 'light', 'dark'];
const THEME_ICONS = {
    light: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="128" y1="40" x2="128" y2="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="64" x2="48" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="192" x2="48" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="192" y1="64" x2="208" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="192" y1="192" x2="208" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="40" y1="128" x2="16" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="216" x2="128" y2="240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="216" y1="128" x2="240" y2="128" fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="16"/></svg>',
    dark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" fill="none" stroke="currentColor" stroke-width="16"/></svg>',
    system: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M40,176V72A16,16,0,0,1,56,56H200a16,16,0,0,1,16,16V176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M24,176H232a0,0,0,0,1,0,0v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V176A0,0,0,0,1,24,176Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="144" y1="88" x2="112" y2="88" fill="none" stroke="currentColor" stroke-width="16"/></svg>'
};

const sendToBackground = (type, value) => {
    chrome.runtime.sendMessage({ type, value, target: 'background' });
}

const updateDeleteButtonState = () => {
    const selected = Array.from(document.querySelectorAll("#stolen-buttons div.stolen-button.selected")).length;
    const deleteButton = document.getElementById('delete');
    if (selected > 0) {
        deleteButton.classList.remove('disabled');
        deleteButton.innerText = `Remove (${selected})`;
    } else {
        deleteButton.classList.add('disabled');
        deleteButton.innerText = 'Remove';
    }
}

const formatSource = (source) => {
    try {
        const url = new URL(source);
        const host = url.hostname.startsWith('www.') ? url.hostname.slice(4) : url.hostname;
        return host;
    } catch {
        return source;
    }
}

const renderButton = (button, isDeleteMode) => {
    const div = document.createElement('div');
    div.classList.add('stolen-button');
    div.dataset.id = button.id;
    div.dataset.name = button.name;
    div.dataset.stolenAt = button.stolenAt;

    const preview = document.createElement('div');
    preview.classList.add('stolen-button-preview');
    preview.innerHTML = button.code;
    div.append(preview);

    if (isDeleteMode) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('stolen-button-checkbox');
        checkbox.addEventListener('click', (e) => e.stopPropagation());
        checkbox.addEventListener('change', () => {
            div.classList.toggle('selected', checkbox.checked);
            updateDeleteButtonState();
        });

        const url = document.createElement('a');
        url.classList.add('stolen-button-url');
        url.href = button.source;
        url.target = '_blank';
        url.rel = 'noreferrer';
        url.innerText = formatSource(button.source);
        url.addEventListener('click', (e) => e.stopPropagation());

        div.prepend(checkbox);
        div.append(url);

        div.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            div.classList.toggle('selected', checkbox.checked);
            updateDeleteButtonState();
        });
    } else {
        preview.addEventListener('click', () => {
            window.open(button.source, '_blank').focus();
        });
    }

    return div;
}

const getButtons = async () => {
    const { buttons } = await chrome.storage.local.get('buttons');
    const container = document.getElementById('stolen-buttons');
    const isDeleteMode = document.body.classList.contains(DELETE_MODE);
    const filtered = buttons.filter(button => !button.hidden);
    container.innerHTML = '';

    filtered.forEach((button, index) => {
        const item = renderButton(button, isDeleteMode);
        container.append(item);
        if (isDeleteMode && index < filtered.length - 1) {
            const divider = document.createElement('hr');
            container.append(divider);
        }
    });

    fullRefresh = false;
    updateDeleteButtonState();
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
    getButtons();
});

document.getElementById('exit-mode').addEventListener('click', ()=> {
    document.getElementById('title').innerText = 'Stolen Buttons';
    document.body.classList.remove(DELETE_MODE);
    getButtons();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
        const idx = THEME_ORDER.indexOf(mode);
        const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
        toggle.dataset.mode = mode;
        toggle.innerHTML = THEME_ICONS[mode] || THEME_ICONS.system;
        toggle.setAttribute('aria-label', `Theme mode: ${mode}`);
        toggle.setAttribute('title', `Switch to ${next} mode`);
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

const donateButton = document.getElementById('donate-button');
if (donateButton) {
    donateButton.addEventListener('click', () => {
        window.open('https://donate.stripe.com/dRmdRa833fou6nqgnP67S00', '_blank', 'noopener,noreferrer');
    });
}
