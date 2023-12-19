chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set({
            buttons: [],
            maximum: 200,
            contentful: {
                contentManagementApiKey: '',
                spaceId: '',
                contentTypeId: ''
            }
        });
    }
});

chrome.storage.onChanged.addListener(async (obj) => {
    if (obj.hasOwnProperty('maximum')) {
        console.log('worker: maximum changed', obj.maximum.newValue);
        let { buttons } = await chrome.storage.local.get(['buttons']);
        while (buttons.length >= obj.maximum.newValue) {
            buttons.pop();
        }
        chrome.storage.local.set({ 'buttons': buttons });
    }
});

chrome.storage.onChanged.addListener(async (obj) => {
    if (obj.hasOwnProperty('buttons')) {
        console.log('worker: buttoms changed');
        // chrome.storage.local.set({ 'buttons': obj });
    }
});