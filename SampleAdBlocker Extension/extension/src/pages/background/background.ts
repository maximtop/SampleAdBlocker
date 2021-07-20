/* eslint-disable no-console */
import { browser } from 'webextension-polyfill-ts';

import { Messages } from '../common/constants';
import { contentBlocker } from './content-blocker/contentBlocker';
import { logNative } from '../common/logNative';

interface Message {
    type: string,
    data: any,
}

const handleMessages = () => {
    browser.runtime.onMessage.addListener(async (message: Message) => {
        const { type, data } = message;

        // If message is get rules we should initiate content blocker first
        if (type === Messages.GetRules) {
            try {
                await contentBlocker.init();
            } catch (e) {
                const errorMessage = `AG: An error occurred on content blocker init ${e}`;
                await logNative(errorMessage);
                console.log(errorMessage);
                return null;
            }
        }

        switch (type) {
            case Messages.GetRules: {
                const { url } = data;
                return contentBlocker.getData(url);
            }
            default:
                return true;
        }
    });
};

export const background = () => {
    // Message listener should be on the upper level to wake up background page
    // when it is necessary
    handleMessages();
};
