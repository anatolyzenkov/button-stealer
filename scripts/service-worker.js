chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set({
            buttons: [],
            maximum: 100,
            contentful: {
                contentManagementApiKey: '',
                spaceID: '',
                contentTypeId: ''
            }
        });
    }
});