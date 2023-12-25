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

maximumInput.addEventListener('input', () => {
    maximumValue.innerText = maximumInput.value;
});

maximumInput.addEventListener('focusout', () => {
    chrome.storage.local.set({ maximum: parseInt(maximumInput.value) });
});

[apiKeyInput, spaceIdInput, typeIdInput].forEach(input => {
    input.addEventListener('focusout', () => {
        const formData = new FormData(form);
        chrome.storage.local.set({
            'contentful': {
                contentManagementApiKey: formData.get(CNTFL_API_KEY),
                spaceId: formData.get(CNTFL_SPACE_ID),
                contentTypeId: formData.get(CNTFL_TYPE_ID),
            }
        });
    });
})

chrome.storage.onChanged.addListener((obj) => {
    switch (true) {
        case obj.hasOwnProperty(MAXIMUM):
            console.log('max')
            updateMaximum(obj.maximum.newValue);
            break;
        case obj.hasOwnProperty(CONTENTFUL):
            console.log('cont')
            updateContentful(obj.contentful.newValue);
            break;
        default:
            break;
    }
});

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
getData();