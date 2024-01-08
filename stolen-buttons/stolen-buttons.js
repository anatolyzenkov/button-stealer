const DELETE_MODE = 'delete-mode';
let fullRefresh = false;

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
});

chrome.storage.onChanged.addListener((obj) => {
    if (obj.hasOwnProperty('buttons') || obj.hasOwnProperty('maximum')) {
        getButtons();
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