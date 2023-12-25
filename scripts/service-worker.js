const MAXIMUM = 'maximum';
const CNTFL_API_KEY = 'contentManagementApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';
const CONTENTFUL = 'contentful';
const BUTTONS = 'buttons';
const UPLOAD = 'upload';
const OFFSCREEN_DOCUMENT_PATH = '/offscreen/offscreen.html';

chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set({
            buttons: [],
            upload: [],
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
    switch (true) {
        case obj.hasOwnProperty(MAXIMUM):
            const { buttons } = await chrome.storage.local.get(BUTTONS);
            while (buttons.length >= obj.maximum.newValue) buttons.pop();
            chrome.storage.local.set({ 'buttons': buttons });
            break;
        case obj.hasOwnProperty(UPLOAD):
            console.log('Worker: Upload are changed');
            uploadOffscreen();
            break;
        case obj.hasOwnProperty(CONTENTFUL):
            console.log('Worker: Contentful is changed');
            uploadOffscreen();
            break;
        default:
            break;
    }
});

const uploadOffscreen = async () => {
    const { upload, contentful } = await chrome.storage.local.get([UPLOAD, CONTENTFUL]);
    if (upload.length === 0) {
        closeOffscreenDocument();
        return;
    }
    if (!(contentful[CNTFL_API_KEY] && contentful[CNTFL_SPACE_ID] && contentful[CNTFL_TYPE_ID])) return;
    if (!(await hasDocument())) {
        await chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: [chrome.offscreen.Reason.DOM_PARSER],
            justification: 'Parse DOM'
        });
    }
    const button = upload[upload.length - 1];
    chrome.runtime.sendMessage({
        type: 'upload-stolen-button',
        target: 'offscreen',
        button: button,
        contentful: contentful
    });
}

const handleMessages = async (message) => {
    if (message.target !== 'background') return;
    switch (message.type) {
        case 'stolen-button-uploaded':
            const { upload } = await chrome.storage.local.get(UPLOAD);
            upload.pop()
            chrome.storage.local.set({ 'upload': upload });
            break;
        default:
            break;
    }
}

chrome.runtime.onMessage.addListener(handleMessages);

const closeOffscreenDocument = async () => {
    if (!(await hasDocument())) {
        return;
    }
    await chrome.offscreen.closeDocument();
}

const hasDocument = async () => {
    const matchedClients = await clients.matchAll();
    for (const client of matchedClients) {
        if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
            return true;
        }
    }
    return false;
}