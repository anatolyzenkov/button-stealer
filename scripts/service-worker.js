const MAXIMUM = 'maximum';
const CNTFL_API_KEY = 'contentManagementApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';
const CONTENTFUL = 'contentful';
const IGNORE = 'ignore';
const BUTTONS = 'buttons';
const UPLOAD = 'upload';
const OFFSCREEN_DOCUMENT_PATH = '/offscreen/offscreen.html';

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    switch (reason) {
        case 'install':
            chrome.storage.local.set({
                buttons: [],
                upload: [],
                ignore: [],
                maximum: 200,
                contentful: {
                    contentManagementApiKey: '',
                    spaceId: '',
                    contentTypeId: ''
                }
            });
            break;
        case 'update':
            const { buttons } = await chrome.storage.local.get(BUTTONS);
            if (buttons.length === 0) break;
            let counter = buttons.length - 1;
            buttons.map(button => button.id = counter--);
            chrome.storage.local.set({ buttons: buttons });
            break;
        default:
            break;
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
            uploadOffscreen();
            break;
        case obj.hasOwnProperty(CONTENTFUL):
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
            upload.pop();
            chrome.storage.local.set({ 'upload': upload });
            break;
        case 'update-maximum':
            chrome.storage.local.set({ maximum: parseInt(message.value) });
            break;
        case 'update-contentful':
            chrome.storage.local.set({ contentful: JSON.parse(message.value) });
            break;
        case 'update-ignore':
            chrome.storage.local.set({ ignore: message.value.split(' ') });
            break;
        case 'remove-all':
            chrome.storage.local.set({ buttons: [], upload: [] })
            break;
        case 'remove-buttons':
            const selected = JSON.parse(message.value);
            const { buttons } = await chrome.storage.local.get('buttons');
            selected.forEach(s => {
                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];
                    if (button.stolenAt === s.stolenAt) {
                        if (button.name === s.name) {
                            button.hidden = true;
                            break;
                        }
                    }
                }
            });
            chrome.storage.local.set({ buttons: buttons });
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