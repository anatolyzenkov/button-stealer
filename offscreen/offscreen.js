const CNTFL_MGMT_API_KEY = 'contentManagementApiKey';
const CNTFL_DLVR_API_KEY = 'contentDeliveryApiKey';
const CNTFL_SPACE_ID = 'spaceId';
const CNTFL_TYPE_ID = 'contentTypeId';

const upload = async (button, contentful) => {
    const content_management_api_key = contentful[CNTFL_MGMT_API_KEY];
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

const find = async (name, cntfl) => {
    const content_delivery_api_key = cntfl[CNTFL_DLVR_API_KEY];
    const space_id = cntfl[CNTFL_SPACE_ID];
    const content_type_id = cntfl[CNTFL_TYPE_ID];
    const client = contentful.createClient({
        accessToken: content_delivery_api_key,
        space: space_id
    });
    const entries = await client.getEntries({
        content_type: content_type_id,
        select: 'sys.createdAt',
        order: '-sys.createdAt',
        locale: 'en-US',
        'fields.name[match]': name
    })
    return entries.items.map(entry => entry.sys.id);
}

const remove = async (button, contentful) => {
    const ids = await find(button.name, contentful);
    if (ids.length === 0) {
        sendToBackground();
        return;
    }
    const content_management_api_key = contentful[CNTFL_MGMT_API_KEY];
    const space_id = contentful[CNTFL_SPACE_ID];
    const environment_id = 'master';
    const client = createClient({
        accessToken: content_management_api_key,
    });

    let error = false;
    await client.getSpace(space_id)
        .then((space) => space.getEnvironment(environment_id))
        .then((env) => env.getEntry(ids[0]))
        .then((entry) => entry.unpublish())
        .then((entry) => entry.delete())
        .then(() => console.log('Entry deleted.'))
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

const sync = async (cntfl) => {
    const content_delivery_api_key = cntfl[CNTFL_DLVR_API_KEY];
    const space_id = cntfl[CNTFL_SPACE_ID];
    const content_type_id = cntfl[CNTFL_TYPE_ID];
    const client = contentful.createClient({
        accessToken: content_delivery_api_key,
        space: space_id
    });
    const buttons = [];
    let skip = 0;
    let total = Infinity;
    while (skip < total) {
        const entries = await client.getEntries({
            content_type: content_type_id,
            locale: 'en-US',
            order: '-sys.createdAt',
            select: 'fields, sys.createdAt',
            skip: skip
        });
        total = entries.total;
        skip += entries.limit;
        buttons.push(...entries.items);
    }
    const value = buttons.map((button, i) => {
        return {
            id: buttons.length - i - 1,
            name: button.fields.name,
            code: button.fields.code,
            source: button.fields.source,
            text: button.fields.text,
            stolenAt: button.sys.createdAt,
        }
    });
    chrome.runtime.sendMessage({
        type: 'contentful-syncronized',
        target: 'background',
        value: JSON.stringify(value)
    });
}

const handleMessages = async (message) => {
    if (message.target !== 'offscreen') return false;
    switch (message.type) {
        case 'upload-stolen-button':
            await upload(message.button, message.contentful);
            break;
        case 'remove-stolen-button':
            await remove(message.button, message.contentful);
            break;
        case 'full-sync':
            await sync(message.contentful);
            break;
        default:
            return false;
    }
}

const sendToBackground = () => {
    chrome.runtime.sendMessage({
        type: 'stolen-button-uploaded',
        target: 'background'
    });
}

chrome.runtime.onMessage.addListener(handleMessages);