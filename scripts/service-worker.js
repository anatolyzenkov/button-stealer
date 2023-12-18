chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set({
            buttons: [],
            maximum: 200,
            contentful: {
                contentManagementApiKey: '',
                spaceID: '',
                contentTypeId: ''
            }
        });
    }
});