import { browser } from 'webextension-polyfill-ts';

export class Browser {
    runtime = {
        sendNativeMessage: browser.runtime.sendNativeMessage,
    };
}
