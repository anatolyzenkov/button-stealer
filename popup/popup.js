const MAXIMUM = 'maximum';
const CNTFL_API_KEY = 'contentManagementApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';
const CONTENTFUL = 'contentful';
const IGNORE = 'ignore';
const maximumInput = document.getElementById(MAXIMUM);
const maximumValue = document.getElementById('maximumValue');
const ignoreInput = document.getElementById(IGNORE);
const apiKeyInput = document.getElementById(CNTFL_API_KEY);
const spaceIdInput = document.getElementById(CNTFL_SPACE_ID);
const typeIdInput = document.getElementById(CNTFL_TYPE_ID);
const contentfulForm = document.getElementById(`${CONTENTFUL}-form`);

const saveContentful = () => {
    const formData = new FormData(contentfulForm);
    sendToBackground(`update-${CONTENTFUL}`, JSON.stringify({
        contentManagementApiKey: formData.get(CNTFL_API_KEY),
        spaceId: formData.get(CNTFL_SPACE_ID),
        contentTypeId: formData.get(CNTFL_TYPE_ID),
    }));
}

const updateContentful = (contentful) => {
    apiKeyInput.value = contentful.contentManagementApiKey;
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

const getData = async () => {
    const { maximum, contentful, ignore } = await chrome.storage.local.get([MAXIMUM, CONTENTFUL, IGNORE]);
    updateMaximum(maximum);
    updateContentful(contentful);
    updateIgnore(ignore);
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

[apiKeyInput, spaceIdInput, typeIdInput].forEach(input => {
    input.addEventListener('input', () => {
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

ignoreInput.addEventListener('input', ()=> {
    clearTimeout(ignoreDelay);
    contentfulDelay = setTimeout(saveIgnore, 500);
});

getData();