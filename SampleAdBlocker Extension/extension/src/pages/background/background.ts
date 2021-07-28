/* eslint-disable consistent-return */
import { browser } from 'webextension-polyfill-ts';

import { MessagesToBackgroundPage, MessagesToContentScript, MessagesToNativeApp } from '../common/constants';
import { logNative } from '../common/logNative';
import { log } from '../common/log';
// TODO remove content blocker if find that native app works faster
import { contentBlocker } from './content-blocker/contentBlocker';

interface Message {
    type: string,
    data: any,
}

const handleScriptsAndSelectorsGeneration = async (url: string) => {
    // If message is get rules we should initiate content blocker first
    try {
        const start = Date.now();
        await contentBlocker.init();
        logNative(`Time to init: ${Date.now() - start}`);
    } catch (e) {
        const errorMessage = `AG: An error occurred on content blocker init ${e}`;
        logNative(errorMessage);
        log.error(errorMessage);
        return null;
    }

    const start = Date.now();
    const data = await contentBlocker.getData(url);
    logNative(`Time to get data from blocker for url: ${url}: ${Date.now() - start}`);
    return data;
};

const handleMessages = () => {
    browser.runtime.onMessage.addListener(async (message: Message) => {
        console.log(message);
        // @ts-ignore
        const { type, data } = message;

        switch (type) {
            case MessagesToBackgroundPage.GetScriptsAndSelectors: {
                // return handleScriptsAndSelectorsGeneration(data.url);
                const start = Date.now();
                const response = await browser.runtime.sendNativeMessage('application_id', {
                    type: MessagesToNativeApp.GetBlockingData,
                    data: data.url,
                });
                logNative(`AG: Time to get blocking data from native host app: ${Date.now() - start} ms`);
                return response.data;
            }
            case MessagesToBackgroundPage.GetAdvancedJson: {
                const response = await browser.runtime.sendNativeMessage(
                    'application-id',
                    {
                        type: MessagesToNativeApp.GetJsonRules,
                        data: 'blabla', // FIXME fix types, to make this optional
                    },
                );
                return response;
            }
            case MessagesToBackgroundPage.AddRule: {
                await browser.runtime.sendNativeMessage('application_id', {
                    type: MessagesToNativeApp.AddToUserrules,
                    data: data.ruleText,
                });
                break;
            }
            case MessagesToBackgroundPage.OpenAssistant: {
                let { tabId } = data;

                if (!tabId) {
                    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
                    if (!tab.id) {
                        log.error('Was unable to get active tab');
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
    // logNative(`application started ${Date.now()}`);
    // Message listener should be on the upper level to wake up background page
    // when it is necessary
    handleMessages();
};
