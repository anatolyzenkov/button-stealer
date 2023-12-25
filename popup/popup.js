const MAXIMUM = 'maximum';
const CNTFL_API_KEY = 'contentManagementApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';
const CONTENTFUL = 'contentful';
const maximumInput = document.getElementById(MAXIMUM);
const maximumValue = document.getElementById('maximumValue');
const apiKeyInput = document.getElementById(CNTFL_API_KEY);
const spaceIdInput = document.getElementById(CNTFL_SPACE_ID);
const typeIdInput = document.getElementById(CNTFL_TYPE_ID);
const form = document.getElementById('form');

const saveContentful = () => {
    const formData = new FormData(form);
    sendToBackground('update-contentful', JSON.stringify({
        contentManagementApiKey: formData.get(CNTFL_API_KEY),
        spaceId: formData.get(CNTFL_SPACE_ID),
        contentTypeId: formData.get(CNTFL_TYPE_ID),
    }));
}

const saveMaximum = () => {
    sendToBackground('update-maximum', maximumInput.value);
}

const updateMaximum = (maximum) => {
    maximumInput.value = maximum;
    maximumValue.innerText = maximum;
}

const updateContentful = (contentful) => {
    apiKeyInput.value = contentful.contentManagementApiKey;
    spaceIdInput.value = contentful.spaceId;
    typeIdInput.value = contentful.contentTypeId;
}

const getData = async () => {
    const { maximum, contentful } = await chrome.storage.local.get([MAXIMUM, CONTENTFUL]);
    updateMaximum(maximum);
    updateContentful(contentful);
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

maximumInput.addEventListener('input', () => {
    maximumValue.innerText = maximumInput.value;
    clearTimeout(maximumDelay);
    maximumDelay = setTimeout(saveMaximum, 500);
});

[apiKeyInput, spaceIdInput, typeIdInput].forEach(input => {
    input.addEventListener('input', () => {
        console.log('!!!');
        clearTimeout(contentfulDelay);
        contentfulDelay = setTimeout(saveContentful, 500);
    });
})

document.getElementById('remove-all').addEventListener('click', () => {
    if (confirm("Remove buttons?") == true) {
        chrome.runtime.sendMessage({
            type: 'remove-all',
            target: 'background'
        });
    }
});

getData();