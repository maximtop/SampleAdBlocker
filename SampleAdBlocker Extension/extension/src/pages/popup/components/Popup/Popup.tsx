import React from 'react';
import { browser } from 'webextension-polyfill-ts'

import { MessagesToBackgroundPage } from '../../../common/constants';

import './popup.pcss';

export const Popup = () => {
    const handleBlock = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const [currentTab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });

        await browser.runtime.sendMessage({
            type: MessagesToBackgroundPage.OpenAssistant,
            data: { tabId: currentTab.id },
        });

        window.close();
    };

    return (
        <div className="popup">
            <div>Popup</div>
            <a href="#" onClick={handleBlock}>Block ads on this website</a>
        </div>
    );
};
