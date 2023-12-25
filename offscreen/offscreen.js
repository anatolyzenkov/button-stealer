const CNTFL_API_KEY = 'contentManagementApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';

const upload = async (button, contentful) => {
    const content_management_api_key = contentful[CNTFL_API_KEY];
    const space_id = contentful[CNTFL_SPACE_ID];
    const content_type_id = contentful[CNTFL_TYPE_ID];
    const environment_id = 'master';

    const client = createClient({
        accessToken: content_management_api_key
    });
    let error = false;
    await client.getSpace(space_id)
        .then((space) => space.getEnvironment(environment_id))
        .then((env) => env.createEntry(content_type_id, {
            fields: {
                name: { 'en-US': button.name },
                code: { 'en-US': button.code },
                source: { 'en-US': button.source },
                text: { 'en-US': button.text }
            }
        }))
        .then((entry) => entry.publish())
        .then((entry) => console.log(`Entry ${entry.sys.id} published.`))
        .catch(e => {
            console.log(e.message);
            error = true;
        })
        .finally((e) => {
            if (!error) {
                sendToBackground();
            }
        });
}


chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages (message) {
    if (message.target !== 'offscreen') return false;
    switch (message.type) {
        case 'upload-stolen-button':
            await upload(message.button, message.contentful);
            break;
        default:
            return false;
    }
}

function sendToBackground() {
    chrome.runtime.sendMessage({
        type: 'stolen-button-uploaded',
        target: 'background'
    });
}