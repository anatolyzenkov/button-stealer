const MAXIMUM = 'maximum';
const CNTFL_MGMT_API_KEY = 'contentManagementApiKey';
const CNTFL_DLVR_API_KEY = 'contentDeliveryApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';
const CONTENTFUL = 'contentful';
const BUTTONS = 'buttons';
const IGNORE = 'ignore';
const maximumInput = document.getElementById(MAXIMUM);
const maximumValue = document.getElementById('maximumValue');
const ignoreInput = document.getElementById(IGNORE);
const mgmtApiKeyInput = document.getElementById(CNTFL_MGMT_API_KEY);
const dlvrApiKeyInput = document.getElementById(CNTFL_DLVR_API_KEY);
const spaceIdInput = document.getElementById(CNTFL_SPACE_ID);
const typeIdInput = document.getElementById(CNTFL_TYPE_ID);
const contentfulForm = document.getElementById(`${CONTENTFUL}-form`);

const saveContentful = () => {
    const formData = new FormData(contentfulForm);
    sendToBackground(`update-${CONTENTFUL}`, JSON.stringify({
        contentManagementApiKey: formData.get(CNTFL_MGMT_API_KEY),
        contentDeliveryApiKey: formData.get(CNTFL_DLVR_API_KEY),
        spaceId: formData.get(CNTFL_SPACE_ID),
        contentTypeId: formData.get(CNTFL_TYPE_ID),
    }));
}

const updateContentful = (contentful) => {
    mgmtApiKeyInput.value = contentful.contentManagementApiKey;
    dlvrApiKeyInput.value = contentful.contentDeliveryApiKey;
    spaceIdInput.value = contentful.spaceId;
    typeIdInput.value = contentful.contentTypeId;
}

const saveMaximum = () => {
    sendToBackground(`update-${MAXIMUM}`, maximumInput.value);
}

const updateMaximum = (maximum) => {
    maximumInput.value = maximum;
    maximumValue.innerText = maximum;
}

const saveIgnore = () => {
    sendToBackground(`update-${IGNORE}`, ignoreInput.value);
}

const updateIgnore = (ignore) => {
    ignoreInput.value = ignore.join(' ');
}

const updateButtons = (buttons) => {
    let stat;
    let length = 0;
    buttons.map(button => button.hidden ? length : length++);
    switch (true) {
        case length === 1:
            stat = "One button already stolen"
            break;
        case length > 1:
            stat = `${length} buttons stolen`
            break;
        default:
            stat = "No buttons stolen yet"
            break;
    }
    document.getElementById('stat').innerText = stat;
    document.getElementById('buttons').innerHTML = '';
    for (let i = 0; i < Math.min(50, buttons.length); i++) {
        const button = buttons[i];
        if (button.hidden) continue;
        const div = document.createElement('div');
        div.classList.add('button-wrapper');
        div.innerHTML = button.code;
        document.getElementById('buttons').append(div);
    }
}

const getData = async () => {
    const { maximum, contentful, ignore, buttons } = await chrome.storage.local.get([MAXIMUM, CONTENTFUL, IGNORE, BUTTONS]);
    updateMaximum(maximum);
    updateContentful(contentful);
    updateIgnore(ignore);
    updateButtons(buttons)
}

const sendToBackground = (type, value) => {
    chrome.runtime.sendMessage({
        type,
        value,
        target: 'background'
    });
}
let maximumDelay = -1;
let contentfulDelay = -1;
let ignoreDelay = -1;

maximumInput.addEventListener('input', () => {
    maximumValue.innerText = maximumInput.value;
    clearTimeout(maximumDelay);
    maximumDelay = setTimeout(saveMaximum, 500);
});

[mgmtApiKeyInput, dlvrApiKeyInput, spaceIdInput, typeIdInput].forEach(input => {
    input.addEventListener('input', () => {
        clearTimeout(contentfulDelay);
        contentfulDelay = setTimeout(saveContentful, 500);
    });
})

document.getElementById('remove-all').addEventListener('click', () => {
    if (window.confirm("Remove buttons?") == true) {
        chrome.runtime.sendMessage({
            type: 'remove-all',
            target: 'background'
        });
    }
});

ignoreInput.addEventListener('input', ()=> {
    clearTimeout(ignoreDelay);
    contentfulDelay = setTimeout(saveIgnore, 500);
});

const closeSlider = () => {
    document.body.classList.remove('slide-container')
}
const openSlider = (title, contentId) => {
    document.getElementById('slider-header').innerText = title;
    document.body.classList.add('slide-container');
    [...document.getElementById('slider-container').children].forEach(view => {
        if (view.id === contentId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    })
}

document.getElementById('switch').addEventListener('click', ()=> {
    if (document.body.classList.contains('slide-container')) {
        closeSlider();
    } else {
        openSlider('Settings', 'settings');
    }
});

document.getElementById('donation-link').addEventListener('click', ()=> {
    openSlider('Donate', 'donation');
});

{
    let emojiCounter = 0;
    const emoji = ['👍', '🦄', '😍', '🥷', '🙌', '🥹', '🌚', '🔥', '😇', '😻']
    const emojiPlaceHolder = document.getElementById('donate-emoji');
    window.setInterval(() => {
        emojiCounter = (emojiCounter + 1) % emoji.length;
        emojiPlaceHolder.innerText = emoji[emojiCounter]
    }, 1000);
}
[
    {
        title: 'Ethereum',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 26 26"><path fill="#fff" d="m12.96 15.63 4.38-2.59-4.38-7.28-4.4 7.28 4.4 2.6z" /><path fill="#fff" d="m12.96 20.65 4.39-6.18-4.4 2.6-4.38-2.6 4.39 6.18z" /></svg>',
        id: '',
        address: '',
        qr: ''
    },
    {
        title: 'USDT',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 26 26"><path fill="#fff" fill-rule="evenodd" d="M11.44 9.9H7.76V7.54h10.29v2.41h-3.68v1.39c2.93.17 5.1.82 5.1 1.6 0 .77-2.19 1.42-5.14 1.6v5h-2.89v-5c-3.01-.15-5.26-.82-5.26-1.6 0-.8 2.25-1.46 5.26-1.61V9.9Zm0 3.47h2.93V11.6c2.84.23 4.33 1.03 4.54 1.31-.24.34-2.2.84-6.1.84-3.85 0-5.84-.5-6.08-.84.2-.32 1.76-1.12 4.71-1.32v1.77Z" clip-rule="evenodd" /></svg>',
        id: '',
        address: '',
        qr: ''
    },
    {
        title: 'Bitcoin',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 26 26"><path fill="#fff" fill-rule="evenodd" d="M17.75 11.27c.21-1.4-.86-2.16-2.32-2.67l.47-1.9-1.16-.3-.46 1.86-.93-.22.46-1.87-1.16-.29-.47 1.91-.74-.17V7.6l-1.6-.4-.31 1.24s.86.2.84.21c.47.12.56.43.54.68l-.54 2.17.12.04-.12-.03-.76 3.04c-.06.14-.2.36-.53.28l-.85-.21-.57 1.33 1.5.37a51.93 51.93 0 0 1 .84.22l-.49 1.93 1.16.28.48-1.9.93.24-.48 1.9 1.16.29.48-1.93c1.98.37 3.47.22 4.1-1.57.5-1.44-.03-2.27-1.07-2.81.76-.18 1.33-.68 1.48-1.7ZM15.1 15c-.33 1.32-2.4.78-3.35.53l-.22-.06.63-2.56.29.07c.98.22 2.99.67 2.65 2.02Zm-2.45-3.2c.79.2 2.51.66 2.81-.54.3-1.23-1.37-1.6-2.19-1.78l-.24-.06-.57 2.32.19.05Z" clip-rule="evenodd"/></svg>',
        id: '',
        address: '',
        qr: ''
    }
].forEach(obj => {
    const btn = document.createElement('a');
    btn.setAttribute('role', 'button');
    btn.classList.add('button', 'vivid', 'label');
    const lbl = document.createElement('div');
    lbl.classList.add('lbl');
    lbl.innerHTML = obj.title;
    const icn = document.createElement('div');
    icn.classList.add('icon');
    icn.innerHTML = obj.icon;
    const arr = document.createElement('div');
    arr.classList.add('arrow');
    arr.innerHTML = '<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 15L8 8L1 0.999999" stroke="white" stroke-width="2"/></svg>';
    btn.append(icn, lbl, arr);
    document.getElementById('currency-selector').append(btn);
})

getData();