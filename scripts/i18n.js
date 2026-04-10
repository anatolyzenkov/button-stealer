(() => {
    const t = (key, substitutions) => chrome.i18n.getMessage(key, substitutions) || '';

    const apply = (root = document) => {
        root.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const value = t(key);
            if (value) element.textContent = value;
        });

        root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = t(key);
            if (value) element.setAttribute('placeholder', value);
        });

        root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
            const key = element.getAttribute('data-i18n-aria-label');
            const value = t(key);
            if (value) element.setAttribute('aria-label', value);
        });

        root.querySelectorAll('[data-i18n-title]').forEach((element) => {
            const key = element.getAttribute('data-i18n-title');
            const value = t(key);
            if (value) element.setAttribute('title', value);
        });

        const titleKey = document.documentElement.getAttribute('data-i18n-title');
        const titleValue = titleKey ? t(titleKey) : '';
        if (titleValue) document.title = titleValue;

        const language = chrome.i18n.getUILanguage();
        document.documentElement.lang = language;
        document.documentElement.dir = language.startsWith('ar') ? 'rtl' : 'ltr';
    };

    window.ButtonStealerI18n = { t, apply };
})();
