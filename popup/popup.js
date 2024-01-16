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

document.getElementById('switch').addEventListener('click', ()=> {
    document.body.classList.toggle('show-settings');
});

getData();