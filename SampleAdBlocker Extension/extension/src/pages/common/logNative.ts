import { browser } from '../background/browser';
import { MessagesToNativeApp } from './constants';

export const logNative = async (message: string) => {
    await browser.runtime.sendNativeMessage(
        'application-id',
        {
            type: MessagesToNativeApp.WriteInNativeLog,
            data: message,
        },
    );
};
