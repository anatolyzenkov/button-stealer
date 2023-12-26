(() => {
    const inheritable = [
        'font', 'font-family', 'font-size', 'font-style', 'font-weight', 'letter-spacing', 'line-height', 'cursor', 'azimuth', 'border-collapse',
        'border-spacing', 'caption-side', 'color', 'cursor', 'direction', 'elevation', 'empty-cells', 'font-family', 'font-size', 'font-style',
        'font-variant', 'font-weight', 'font', 'letter-spacing', 'line-height', 'list-style-image', 'list-style-position', 'list-style-type', 'list-style',
        'orphans', 'pitch-range', 'pitch', 'quotes', 'richness', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speak', 'speech-rate', 'stress',
        'text-align', 'text-indent', 'text-transform', 'visibility', 'voice-family', 'volume', 'white-space', 'widows', 'word-spacing', 'pointer-events'
    ];

    const animation = [
        'animation-range', 'animation-composition', 'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode',
        'animation-iteration-count', 'animation-name', 'animation-play-state', 'animation-range', 'animation-timing-function'
    ];

    const background = [
        'background-attachment', 'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin',
        'background-position', 'background-repeat'
    ];

    const mask = [
        'mask-clip', 'mask-composite', 'mask-image', 'mask-mode', 'mask-origin', 'mask-position', '-webkit-mask-position-x', '-webkit-mask-position-y',
        'mask-repeat', 'mask-type'
    ];

    const skip = [
        'app-region', 'backface-visibility', 'baseline-shift', 'block-size', 'border-block-end', 'border-block-start', 'caret-color', 'caption-side',
        'inline-size', 'perspective-origin', 'text-decoration-color', 'text-emphasis-color', '-webkit-text-fill-color', '-webkit-text-stroke-color',
        '-webkit-mask-box-image-source', '-webkit-mask-box-image-slice', '-webkit-mask-box-image-width', '-webkit-mask-box-image-outset',
        '-webkit-mask-box-image-repeat', '-webkit-locale', '-webkit-tap-highlight-color', 'tab-size', 'transition', 'transition-property', 'transition-duration',
        'transition-timing-function', 'transition-delay', 'transition-behavior', 'accent-color',
    ];

    const defaults = [
        'align-content: normal', 'justify-content: normal', 'align-items: normal', 'justify-items: normal', 'animation-range-start: normal',
        'animation-range-end: normal', 'backdrop-filter: none', 'background-attachment: scroll', 'background-blend-mode: normal',
        'background-clip: border-box', 'background-color: rgba(0, 0, 0, 0)', 'background-image: none', 'background-origin: padding-box',
        'background-position: 0% 0%', 'background-position-x: 0%', 'background-position-y: 0%', 'background-repeat: repeat', 'border-collapse: separate',
        'border-end-end-radius: 0px', 'border-end-start-radius: 0px', 'border-start-end-radius: 0px', 'border-start-start-radius: 0px',
        'border-top-left-radius: 0px', 'border-top-right-radius: 0px', 'border-bottom-right-radius: 0px', 'border-bottom-left-radius: 0px',
        'inset: 0px', 'box-shadow: none', 'box-sizing: content-box', 'clear: none', 'clip-path: none', 'clip-rule: nonzero', 'color: rgba(0, 0, 0, 0);',
        'color-interpolation: srgb', 'color-interpolation-filters: linearrgb', 'row-gap: normal', 'column-gap: normal', 'column-span: none',
        'content: normal', 'container: none', 'container-name: none', 'container-type: normal', 'contain-intrinsic-block-size: none',
        'contain-intrinsic-inline-size: none', 'contain-intrinsic-width: none', 'contain-intrinsic-height: none', 'cx: 0px', 'cy: 0px', 'd: none',
        'direction: ltr', 'empty-cells: show', 'fill: rgb(0, 0, 0)', 'fill-opacity: 1', 'fill-rule: nonzero', 'filter: none', 'flex-direction: row',
        'flex-wrap: nowrap', 'flex-grow: 0', 'flex-shrink: 1', 'float: none', 'flood-color: rgb(0, 0, 0)', 'flood-opacity: 1', 'font-palette: normal',
        'font-size: 12px', 'font-weight: 400', 'font-stretch: 100%', 'font-style: normal', 'font-variant: normal', 'font-variant-ligatures: normal',
        'font-variant-caps: normal', 'font-variant-numeric: normal', 'font-variant-east-asian: normal', 'font-variant-alternates: normal',
        'font-variant-position: normal', 'grid-auto-flow: row', 'grid-template-rows: none', 'grid-template-columns: none', 'grid-template-areas: none',
        'hyphens: manual', 'image-orientation: from-image', 'initial-letter: normal', 'inset-block-start: 0px', 'inset-block-end: 0px',
        'inset-inline-start: 0px', 'inset-inline-end: 0px', 'justify-content: space-between', 'top: 0px', 'right: 0px', 'bottom: 0px', 'left: 0px',
        'letter-spacing: normal', 'lighting-color: rgb(255, 255, 255)', 'list-style-position: outside', 'list-style-image: none', 'list-style-type: none',
        'list-style-type: disc', 'margin-block-start: 0px', 'margin-block-end: 0px', 'margin-top: 0px', 'margin-right: 0px', 'margin-bottom: 0px',
        'margin-left: 0px', 'margin-inline-start: 0px', 'margin-inline-end: 0px', 'marker: none', 'marker-start: none', 'marker-mid: none',
        'marker-end: none', 'math-depth: 0', 'math-shift: normal', 'math-style: normal', 'max-block-size: none', 'max-height: none',
        'max-inline-size: none', 'max-width: none', 'min-inline-size: 0px', 'min-width: auto', 'min-width: 0px', 'min-block-size: 0px', 'min-height: auto',
        'min-height: 0px', 'mix-blend-mode: normal', 'object-fit: fill', 'object-position: 50% 50%', 'object-view-box: none', 'offset-distance: 0px',
        'offset-path: none', 'offset-position: normal', 'offset-rotate: auto 0deg', 'opacity: 1', 'order: 0', 'overflow-clip-margin: 0px',
        'overflow-wrap: normal', 'overflow-wrap: break-word', 'overflow: visible', 'overflow-x: visible', 'overflow-y: visible',
        'scroll-margin-block-start: 0px', 'scroll-margin-block-end: 0px', 'scroll-margin-inline-start: 0px', 'scroll-margin-inline-end: 0px',
        'scroll-timeline-name: none', 'scroll-timeline-axis: block', 'shape-image-threshold: 0', 'stroke: none', 'stroke-dasharray: none',
        'stroke-dashoffset: 0px', 'stroke-linecap: butt', 'stroke-linejoin: miter', 'stroke-miterlimit: 4', 'stroke-opacity: 1', 'stroke-width: 1px',
        'speak: normal', 'padding-top: 0px', 'padding-right: 0px', 'padding-bottom: 0px', 'padding-left: 0px', 'paint-order: normal', 'perspective: none',
        'position: static', 'r: 0px', 'resize: none', 'rotate: none', 'ruby-position: over', 'scale: none', 'shape-margin: 0px', 'shape-outside: none',
        'stop-color: rgb(0, 0, 0)', 'stop-opacity: 1', 'tab-size: 8', 'text-anchor: start', 'text-decoration-line: none',
        'text-decoration-thickness: initial', 'text-decoration-style: solid', 'text-emphasis-style: none', 'text-emphasis-position: over',
        'text-overflow: clip', 'text-shadow: none', 'text-align: start', 'text-align: left', 'text-decoration-line: none',
        'text-decoration-thickness: initial', 'text-decoration-style: solid', 'text-size-adjust: 100%', 'text-indent: 0px', 'text-transform: none',
        'white-space-collapse: collapse', 'text-wrap: wrap', 'timeline-scope: none', 'transition-behavior: normal', 'transition-duration: 0s',
        'transition-timing-function: ease', 'transition-delay: 0s', 'transition-property: all', 'translate: none', 'unicode-bidi: normal',
        'user-select: none', 'vector-effect: none', 'vertical-align: baseline', 'view-timeline-axis: block', 'view-timeline-name: none',
        'view-transition-name: none', 'word-break: normal', 'word-break: break-word', 'writing-mode: horizontal-tb', 'x: 0px', 'y: 0px', 'z-index: 0',
        'zoom: 1', '-webkit-border-horizontal-spacing: 0px', '-webkit-border-vertical-spacing: 0px', '-webkit-border-image: none',
        '-webkit-box-align: stretch', '-webkit-box-decoration-break: slice', '-webkit-box-direction: normal', '-webkit-box-flex: 0',
        '-webkit-box-ordinal-group: 1', '-webkit-box-orient: horizontal', '-webkit-box-pack: start', '-webkit-font-smoothing: antialiased',
        '-webkit-print-color-adjust: economy', '-webkit-rtl-ordering: logical', '-webkit-tap-highlight-color: rgba(0, 0, 0, 0)',
        '-webkit-text-combine: none', '-webkit-text-decorations-in-effect: none', '-webkit-text-orientation: vertical-right',
        '-webkit-text-security: none', '-webkit-text-stroke-width: 0px', '-webkit-user-modify: read-only', '-webkit-writing-mode: horizontal-tb',
        'word-spacing: 0px', 'touch-action: manipulation', 'visibility: visible', 'widows: 2', 'orphans: 2', 'overlay: none'
    ];

    const nonButtonDefaults = [
        'padding-block-start: 0px',
        'padding-block-end: 0px',
        'padding-inline-start: 0px',
        'padding-inline-end: 0px',
    ];

    const stripCSS = (elem, ref, isChild, isSVGChild) => {
        const refCSS = window.getComputedStyle(ref);
        const refCSSOM = ref.computedStyleMap();
        const parentCSSOM = ref.parentNode.computedStyleMap();
        elem.removeAttribute('style');
        for (const [prop, val] of refCSSOM) {
            const property = prop;
            const value = val[0];
            if (isChild && inheritable.indexOf(property) !== -1) {
                if (!(ref.parentNode.tagName.toLowerCase() === 'a' && property === 'color')) {
                    if (parentCSSOM.get(property).toString() === value.toString()) continue;
                }
            }  //inheritable
            if (value.toString() === 'auto') continue;
            if (refCSS.getPropertyValue('border-top-width') === '0px'
                && ["border-top-color", "border-top-style"].indexOf(property) !== -1) continue; //border
            if (refCSS.getPropertyValue('border-bottom-width') === '0px'
                && ["border-bottom-color", "border-bottom-style"].indexOf(property) !== -1) continue; //border
            if (refCSS.getPropertyValue('border-left-width') === '0px'
                && ["border-left-color", "border-left-style"].indexOf(property) !== -1) continue; //border
            if (refCSS.getPropertyValue('border-right-width') === '0px'
                && ["border-right-color", "border-right-style"].indexOf(property) !== -1) continue; //border
            if (refCSS.getPropertyValue('animation-duration') === '0s'
                && animation.indexOf(property) !== -1) continue; //animation
            if (refCSS.getPropertyValue('mask-image') === 'none'
                && mask.indexOf(property) !== -1) continue; //mask
            if (elem.tagName.toLowerCase() !== 'button') {
                if (nonButtonDefaults.indexOf(`${property}: ${value}`) !== -1) continue; //defaults
                if (property === 'appearance') continue;
            }
            if (defaults.indexOf(`${property}: ${value}`) !== -1) continue; //button defaults
            if (refCSS.getPropertyValue('border-inline-end-width') === '0px'
                && ['border-inline-end-width', 'border-inline-end-style', 'border-inline-end-color'].indexOf(property) !== -1) continue; //border-inline-end
            if (refCSS.getPropertyValue('border-inline-start-width') === '0px'
                && ['border-inline-start-width', 'border-inline-start-style', 'border-inline-start-color'].indexOf(property) !== -1) continue; //border-inline-end
            if (refCSS.getPropertyValue('border-block-end-width') === '0px'
                && ['border-block-end-width', 'border-block-end-style', 'border-block-end-color'].indexOf(property) !== -1) continue; //border-block-end
            if (refCSS.getPropertyValue('border-block-start-width') === '0px'
                && ['border-block-start-width', 'border-block-start-style', 'border-block-start-color'].indexOf(property) !== -1) continue; //border-block-end
            if (refCSS.getPropertyValue('column-rule-width') === '0px'
                && ['column-rule-style', 'column-rule-color', 'contain-intrinsic-size', 'column-rule-width'].indexOf(property) !== -1) continue; //column-rule
            if (refCSS.getPropertyValue('border-image-source') === 'none'
                && ['border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat'].indexOf(property) !== -1) continue; //column-rule
            if (refCSS.getPropertyValue('outline-width') === '0px'
                && ['outline-color', 'outline-style', 'outline-width', 'outline-offset'].indexOf(property) !== -1) continue; //outline
            if (refCSS.getPropertyValue('transform') === 'none'
                && ['transform', 'transform-origin', 'transform-style'].indexOf(property) !== -1) continue; //transform
            if (!isChild && property === 'position') continue;
            if (property === 'd') continue;
            if (skip.indexOf(property) !== -1) continue; //skip
            if (property.indexOf('--')=== 0) continue; //skip vars
            elem.style.setProperty(property, value);
        };
        if (!isChild) {
            elem.style.setProperty('margin-block', '');
            elem.style.setProperty('margin-start', '');
            elem.style.setProperty('margin-end', '');
            elem.style.setProperty('margin', '');
            elem.style.setProperty('margin-bottom', '');
            elem.style.setProperty('margin-top', '');
            elem.style.setProperty('margin-left', '');
            elem.style.setProperty('margin-right', '');
            elem.style.setProperty('bottom', '');
            elem.style.setProperty('top', '');
            elem.style.setProperty('left', '');
            elem.style.setProperty('right', '');
            elem.style.setProperty('inset-block-end', '');
            elem.style.setProperty('inset-block-start', '');
            elem.style.setProperty('inset-inline-end', '');
            elem.style.setProperty('inset-inline-start', '');
            if (elem.tagName.toLowerCase() === 'button') {
                elem.style.setProperty('position', 'relative');
            }
        }    
        if (elem.style.borderRadius !== '') {
            elem.style.setProperty('border-end-end-radius', '');
            elem.style.setProperty('border-end-start-radius', '');
            elem.style.setProperty('border-start-end-radius', '');
            elem.style.setProperty('border-start-start-radius', '');
        }
        if (elem.style.marginInline !== '') {
            elem.style.setProperty('margin-left', '');
            elem.style.setProperty('margin-right', '');
        }
        if (elem.style.marginBlock !== '') {
            elem.style.setProperty('margin-bottom', '');
            elem.style.setProperty('margin-top', '');
        }
        if (elem.style.paddingInline !== '') {
            elem.style.setProperty('padding-left', '');
            elem.style.setProperty('padding-right', '');
        }
        if (elem.style.paddingBlock !== '') {
            elem.style.setProperty('padding-bottom', '');
            elem.style.setProperty('padding-top', '');
        }
        elem.style.setProperty('-webkit-mask-box-image-source', '');
        elem.style.setProperty('-webkit-mask-box-image-slice', '');
        elem.style.setProperty('-webkit-mask-box-image-width', '');
        elem.style.setProperty('-webkit-mask-box-image-outset', '');
        elem.style.setProperty('-webkit-mask-box-image-repeat', '');
        Array.from(elem.children).forEach((child, i) => {
            stripCSS(child, ref.children[i], true, elem.tagName.toLowerCase() === 'svg' || isSVGChild);
        });
        if (!isChild) {
            fFaces = elem.style.getPropertyValue('font-family').split(',');
            lastFF = fFaces[fFaces.length-1].trim();
            if (lastFF !== 'sans-serif') {
                fFaces.push('system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif');
                elem.style.setProperty('font-family', fFaces.join(', '));
            }
            if (elem.tagName.toLowerCase() === 'button') {
                if (elem.style.backgroundColor === '') {
                    elem.style.backgroundColor = 'transparent';
                }
            }
            // if (elem.style.backgroundColor === 'rgb(255, 255, 255)') {
                // if (elem.style.)
            // }
        }
        const names = elem.getAttributeNames();
        for (let key in names) {
            const attr = names[key];
            if (['id', 'class', 'target', 'alt'].indexOf(attr) !== -1
                || attr.indexOf('data-') === 0
                || attr.indexOf('aria-') === 0) {
                elem.removeAttribute(attr);
            }
        }
        elem.removeAttribute('id');
        elem.removeAttribute('target');
        elem.removeAttribute('alt');
        if (elem.hasAttribute('src')) {
            const rgExp = new RegExp("^(?:[a-z]+:)?//", "i");
            if (!rgExp.test(elem.getAttribute('src'))) {
                if (elem.getAttribute('src').charAt(0) === '/') {
                    elem.setAttribute('src', `${window.location.origin}${elem.getAttribute('src')}`);
                }
                if (elem.getAttribute('src').substr(0, 2) === './') {
                    elem.setAttribute('src', `${window.location.origin}${window.location.pathname}${elem.getAttribute('src').substr(1)}`);
                }
            }
        }
    }

    const isElementInViewport = (el) => {
        let top = el.offsetTop;
        let left = el.offsetLeft;
        let width = el.offsetWidth;
        let height = el.offsetHeight;
        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }
        return (
            top >= 0 &&
            left >= 0 &&
            (top + height) <= (document.documentElement.clientHeight) &&
            (left + width) <= (document.documentElement.clientWidth)
        );
    }

    const DEBUG = false;

    const getCode = (stolenButtons) => {
        const possibleButtons = [
            Array.from(document.getElementsByTagName('a')),
            Array.from(document.getElementsByTagName('button'))
        ]
        if (!DEBUG) {
            possibleButtons[0].sort(()=> {return Math.random() > .5 ? 1 : -1;})
            possibleButtons[1].sort(()=> {return Math.random() > .5 ? 1 : -1;})
        }
        for (let j = 0; j < possibleButtons.length; j++) {
            const buttons = possibleButtons[j];
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                if (button.querySelectorAll('[class*="material-icons"]').length > 0) continue;
                if (button.querySelectorAll('[class*="material-symbols"]').length > 0) continue;
                if (!DEBUG && stolenButtons.find((entry) => entry.text === button.innerText.trim())) continue;
                const elemCSS = window.getComputedStyle(button);
                if (elemCSS.getPropertyValue('transform') === 'matrix(0, 0, 0, 0, 0, 0)') continue;
                if (elemCSS.getPropertyValue('opacity') === '0') continue;
                if (i < 10) if (!isElementInViewport(button)) continue;
                if (button.innerText === undefined) continue;
                if (button.innerText.toLowerCase().split(' ').indexOf('skip') !== -1) continue;
                if (button.innerText.toLowerCase().split(' ').indexOf('jump') !== -1) continue;
                if (button.innerText.split(' ').join('').length < 2) continue;
                if (button.innerText.split(' ').join('').length > 32) continue;
                if (button.innerText.indexOf('\n') !== -1) continue;
                if (button.innerText.indexOf('\t') !== -1) continue;
                if (button.innerText.trim().toLowerCase() === 'ad') continue;
                const width = button.offsetWidth;
                const height = button.offsetHeight;
                if (width < 10) continue;
                if (height < 25) continue;
                if (width > 600) continue;
                if (height > 200) continue;
                if (height / width > 1.2) continue;
                if (width / height > 8) continue;
                if (elemCSS.getPropertyValue('background-color') === 'rgba(0, 0, 0, 0)') {
                    if (button.children.length > 0) {
                        const elemChildCSS = window.getComputedStyle(button.children[0]);
                        if (elemChildCSS.getPropertyValue('background-color') === 'rgba(0, 0, 0, 0)') {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
                const cloneButton = button.cloneNode(true);
                cloneButton.style.margin = '0';
                stripCSS(cloneButton, button);
                if (cloneButton.style.position === 'absolute') cloneButton.style.position = 'relative';
                if (j === 0) {
                    cloneButton.setAttribute('href', '#');
                } else {
                    cloneButton.removeAttribute('onclick');
                }
                return {
                    code: cloneButton.outerHTML
                        .replaceAll('rgb(255, 255, 255)', '#FFF')
                        .replaceAll('rgb(0, 0, 0)', '#000')
                        .replaceAll('rgba(0, 0, 0, 0)', 'transparent'),
                    text: button.innerText.trim()
                }
            }
        }
        return {
            code: undefined,
            text: undefined
        }
    }

    const stealButton = async () => {
        let { buttons, maximum, ignore } = await chrome.storage.local.get(['buttons', 'maximum', 'ignore']);
        
        for (let i = 0; i < ignore.length; i++) {
            const listed = ignore[i].split('.');
            const hostname = window.location.hostname.split('.');
            while (hostname.length < listed.length) {
                hostname.unshift('*');
            };
            let match = true;
            for (let j = hostname.length - 1; j > -1; j--) {
                if (hostname[j] !== listed[j]) {
                    if (listed[j] === '*') continue;
                    match = false;
                }
            }
            if (match) return;
        }

        const localButtons = [];
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const url = new URL(button.source);
            if (url.origin !== window.location.origin) continue;
            localButtons.push(button);
            if (localButtons.length === 1) {
                const m = Math.floor((new Date() - new Date(button.stolenAt))/1000/60);
                if (m < 5 && !DEBUG) return; //5 minute moratorium on button stealing from this website
            }
        }
        const { code, text } = getCode(localButtons);
        if (!code) return;
        const button = {
            name: `"${text}" from ${window.location.hostname}`,
            code: code,
            source: window.location.origin + window.location.pathname,
            text: text,
            stolenAt: (new Date()).toUTCString(),
        };
        buttons.unshift(button);
        while (buttons.length >= maximum) {
            buttons.pop();
        }
        const { upload } = await chrome.storage.local.get('upload');
        upload.unshift(button);
        chrome.storage.local.set({ 'buttons': buttons });
        chrome.storage.local.set({ 'upload': upload });
    }

    let timeoutId = -1;

    navigation.addEventListener('navigatesuccess', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(stealButton, 500);
    })

    timeoutId = setTimeout(stealButton, 500);
})();