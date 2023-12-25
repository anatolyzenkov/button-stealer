const getButtons = async () => {
    const { buttons } = await chrome.storage.local.get('buttons');
    const target = document.getElementById('target');
    target.innerHTML = '';
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const div = document.createElement('div');
        div.classList.add('wrapper');
        div.innerHTML = button.code;
        div.append(button.source)
        target.append(div);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getButtons();
});

chrome.storage.onChanged.addListener((obj) => {
    if (obj.hasOwnProperty('buttons') || obj.hasOwnProperty('maximum')) {
        getButtons();
    }
});