const maximumInput = document.getElementById('maximum');
const apiKeyInput = document.getElementById('contentManagementApiKey');
const spaceIdInput = document.getElementById('spaceId');
const typeIdInput = document.getElementById('contentTypeId');

maximumInput.addEventListener('focusout', () => {
    chrome.storage.local.set({ 'maximum': parseInt(maximumInput.value) });
});

const getData = async () => {
    const { maximum, contentful } = await chrome.storage.local.get(['maximum', 'contentful']);
    updateMaximum(maximum);
    updateContentful(contentful)
}

chrome.storage.onChanged.addListener((obj) => {
    if (obj.hasOwnProperty('maximum')) {
        updateMaximum(obj.maximum.newValue);
    }
    if (obj.hasOwnProperty('contentful')) {
        updateContentful(obj.contentful.newValue);
    }
});

const updateMaximum = (maximum) => {
    maximumInput.value = maximum;
}

const updateContentful = (contentful) => {
    apiKeyInput.value = contentful.contentManagementApiKey;
    spaceIdInput.value = contentful.spaceId;
    typeIdInput.value = contentful.contentTypeId;
}

getData();