/* eslint-disable no-console */
import { browser } from 'webextension-polyfill-ts';
import { Messages } from './common/constants';

const main = async () => {
    browser.runtime.onMessage.addListener(async (message) => {
        console.log('Received message: ', message);
        const { type, data } = message;
        switch (type) {
            case Messages.GetSelectorsAndScripts: {
                console.log(data);
                return {
                    scripts: 'console.log(test)',
                    selectors: 'h1 { display: none!important }',
                };
            }
            default:
                return true;
        }
    });

    const response = await browser.runtime.sendNativeMessage('application-id', { message: 'Hello from background page' });
    console.log('Received sendNativeMessage response:', response);
};

main();
