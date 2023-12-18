const getCode = (buttons) => {
    return {
        code: `<button>${buttons.length} ${window.location.hostname}</button>`,
        text: `${buttons.length}`
    }
}

const stealButton = async () => {
    let { buttons, maximum } = await chrome.storage.local.get(['buttons', 'maximum']);
    const {code, text} = getCode(buttons);
    buttons.push({
        name: `"${text}" from ${window.location.hostname}`,
        code: code,
        source: window.location.origin + window.location.pathname,
        text: text,
        stolen: new Date(),
        stored: false
    });
    while (buttons.length >= maximum) {
        buttons.shift();
    }
    chrome.storage.local.set({'buttons': buttons });
}

stealButton();

navigation.addEventListener('navigatesuccess', ()=> {
    stealButton();
})