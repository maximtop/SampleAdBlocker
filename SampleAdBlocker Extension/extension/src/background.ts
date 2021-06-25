/* eslint-disable no-console */
import { browser } from 'webextension-polyfill-ts';
import { Messages } from './common/constants';

const getSelectorsAndScriptsFromNativeApp = async (url: string) => {
    const response = await browser.runtime.sendNativeMessage(
        'application-id',
        {
            type: Messages.GetSelectorsAndScripts,
            data: { url },
        },
    );

    const { data } = response;
    return JSON.parse(data);
};

const main = async () => {
    browser.runtime.onMessage.addListener(async (message) => {
        const { type, data } = message;
        switch (type) {
            case Messages.GetSelectorsAndScripts: {
                const { url } = data;
                return getSelectorsAndScriptsFromNativeApp(url);
            }
            default:
                return true;
        }
    });
};

main();
