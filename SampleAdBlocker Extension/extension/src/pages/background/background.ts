/* eslint-disable consistent-return */
import { browser } from 'webextension-polyfill-ts';

import { MessagesToBackgroundPage, MessagesToContentScript } from '../common/constants';
import { contentBlocker } from './content-blocker/contentBlocker';
import { logNative } from '../common/logNative';

interface Message {
    type: string,
    data: any,
}

const handleScriptsAndSelectorsGeneration = async (url: string) => {
    // If message is get rules we should initiate content blocker first
    try {
        await contentBlocker.init();
    } catch (e) {
        const errorMessage = `AG: An error occurred on content blocker init ${e}`;
        await logNative(errorMessage);
        console.log(errorMessage);
        return null;
    }

    return contentBlocker.getData(url);
};

const handleMessages = () => {
    browser.runtime.onMessage.addListener(async (message: Message) => {
        const { type, data } = message;

        switch (type) {
            case MessagesToBackgroundPage.GetScriptsAndSelectors: {
                return handleScriptsAndSelectorsGeneration(data.url);
            }
            case MessagesToBackgroundPage.AddRule: {
                // TODO add user rule
                console.log('add user rule', data);
                break;
            }
            case MessagesToBackgroundPage.OpenAssistant: {
                let { tabId } = data;

                if (!tabId) {
                    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
                    if (!tab.id) {
                        // TODO add logger
                        console.error('Was unable to get active tab');
                        return;
                    }
                    tabId = tab.id;
                }

                await browser.tabs.executeScript(tabId, { file: 'assistant.js' });

                // init assistant
                await browser.tabs.sendMessage(tabId, {
                    type: MessagesToContentScript.InitAssistant,
                    data: { addRuleCallbackName: MessagesToBackgroundPage.AddRule },
                });
                break;
            }
            default:
                break;
        }
    });
};

export const background = () => {
    // Message listener should be on the upper level to wake up background page
    // when it is necessary
    handleMessages();
};
