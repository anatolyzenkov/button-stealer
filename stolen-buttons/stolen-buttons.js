const DELETE_MODE = 'delete-mode';
let fullRefresh = false;

const sendToBackground = (type, value) => {
    chrome.runtime.sendMessage({ type, value, target: 'background' });
}

const getButtons = async () => {
    const { buttons } = await chrome.storage.local.get('buttons');
    const add = [];
    if (fullRefresh) document.getElementById('buttons').innerHTML = '';
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        let div = fullRefresh ? null : document.querySelector(`[data-id="${button.id}"]`);
        if (div === null) {
            if (button.hidden) continue;
            div = document.createElement('div');
            div.classList.add('button');
            div.innerHTML = button.code;
            div.addEventListener('click', ()=> {
                if (document.body.classList.contains(DELETE_MODE)) {
                    document.getElementById('delete').removeAttribute('disabled');
                    div.classList.toggle('selected');
                }
            });
            div.dataset.id = button.id;
            div.dataset.name = button.name;
            div.dataset.stolenAt = button.stolenAt;
            add.push(div);
        } else {
            if (button.hidden) div.remove();
        }
    }
    document.getElementById('buttons').prepend(...add);
}

const deleteButtons = async () => {
    const value = Array.from(document.querySelectorAll("#buttons div.button.selected")).map(selected => {
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
    document.body.classList.add(DELETE_MODE);
});

document.getElementById('exit-mode').addEventListener('click', ()=> {
    document.querySelectorAll("#buttons div.button.selected").forEach(button => {
        button.classList.remove('selected');
    });
    document.getElementById('delete').setAttribute('disabled', true);
    document.body.classList.remove(DELETE_MODE);
});

document.getElementById('delete').addEventListener('click', ()=> {
    deleteButtons();
    document.getElementById('delete').setAttribute('disabled', true);
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