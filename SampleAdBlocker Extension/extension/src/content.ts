/* eslint-disable no-console */
import { browser } from 'webextension-polyfill-ts';
import { Messages } from './common/constants';

const getSelectors = async () => {
    return browser.runtime.sendMessage({
        type: Messages.GetSelectorsAndScripts,
        data: {
            url: window.location.href,
        },
    });
};

const main = async () => {
    const selectors = await getSelectors();
    console.log({ selectors });
};

main();
