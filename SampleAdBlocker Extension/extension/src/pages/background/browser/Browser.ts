import { browser } from 'webextension-polyfill-ts';

export class Browser {
    runtime = {
        sendNativeMessage: browser.runtime.sendNativeMessage,
        sendMessage: browser.runtime.sendMessage,
    };

    tabs = {
        query: browser.tabs.query,
    };
}
