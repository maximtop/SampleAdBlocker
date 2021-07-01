/* eslint-disable no-console */
import { browser } from 'webextension-polyfill-ts';

import { Messages } from '../common/constants';
import { contentBlocker } from './content-blocker/contentBlocker';

const handleMessages = () => {
    browser.runtime.onMessage.addListener(async (message) => {
        const { type, data } = message;
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
    handleMessages();
};
