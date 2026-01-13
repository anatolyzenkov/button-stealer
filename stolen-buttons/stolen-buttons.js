const DELETE_MODE = 'delete-mode';
let fullRefresh = false;

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
});

chrome.storage.onChanged.addListener((obj) => {
    if (obj.hasOwnProperty('buttons') || obj.hasOwnProperty('maximum')) {
        getButtons();
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
