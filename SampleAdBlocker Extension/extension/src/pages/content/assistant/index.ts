import { adguardAssistant, Assistant } from '@adguard/assistant';
import { browser } from 'webextension-polyfill-ts';
import { MessagesToContentScript } from '../../common/constants';

declare global {
    namespace NodeJS {
        interface Global {
            assistantStarted: boolean,
        }
    }
}

export const initAssistant = () => {
    console.log('assistantStarted', global.assistantStarted);
    if (global.assistantStarted) {
        return;
    }

    if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
        return;
    }

    let assistant: Assistant;

    // save right-clicked element for assistant
    let clickedEl: HTMLElement | null;
    document.addEventListener('mousedown', (event) => {
        if (event.button === 2) {
            clickedEl = event.target as HTMLElement;
        }
    });

    browser.runtime.onMessage.addListener((message) => {
        const { data, type } = message;

        switch (type) {
            case MessagesToContentScript.InitAssistant: {
                const { addRuleCallbackName, selectElement } = data;

                let selectedElement = null;

                if (clickedEl && selectElement) {
                    selectedElement = clickedEl;
                }

                if (!assistant) {
                    assistant = adguardAssistant();
                } else {
                    assistant.close();
                }

                assistant.start(selectedElement, async (rules) => {
                    console.log('send rules', rules);
                    try {
                        await browser.runtime.sendMessage({
                            type: addRuleCallbackName,
                            data: { ruleText: rules },
                        });
                    } catch (e) {
                        // TODO add logger
                        console.log(e);
                    }
                });
                break;
            }
            default:
                break;
        }
    });

    // do not start assistant twice
    global.assistantStarted = true;
};

export const assistant = {
    init: initAssistant,
};
