import { browser } from '../background/browser';
import { Messages } from './constants';

export const logNative = async (message: string) => {
    await browser.runtime.sendNativeMessage(
        'application-id',
        {
            type: Messages.WriteInNativeLog,
            data: message,
        },
    );
};
