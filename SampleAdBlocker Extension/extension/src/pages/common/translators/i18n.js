// TODO convert to ts
import { browser } from 'webextension-polyfill-ts';

export const i18n = {
    getMessage: browser.i18n.getMessage,
    getUILanguage: browser.i18n.getUILanguage,
    getBaseMessage: (key) => key,
    getBaseUILanguage: () => 'en',
};
