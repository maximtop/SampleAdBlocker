import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { browser } from 'webextension-polyfill-ts';

import { Action } from './Action';
import { translator } from '../../../common/translators/translator';
import { MessagesToBackgroundPage } from '../../../common/constants';
import { popupStore } from '../../stores/PopupStore';

/**
 * TODO
 *  - check if it is possible to get favicons
 *  - get current site domain
 *  - get current site status
 *  - add icon system
 *  - check if site has user rules
 *  - add actions to buttons
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const Actions = observer(() => {
    const store = useContext(popupStore);
    const hasUserRules = true;

    return (
        <>
            <Action
                icon="G"
                title={store.currentSiteDomain}
                description={store.currentSiteStatusMessage}
            />
            <Action
                icon="S"
                title={translator.getMessage('popup_action_safari_protection_title')}
                description={translator.getMessage('popup_action_safari_protection_description')}
            />
            <Action
                icon="B"
                title={translator.getMessage('popup_action_block_element')}
            />
            {hasUserRules && (
                <Action
                    icon="D"
                    title={translator.getMessage('popup_action_delete_user_rules')}
                />
            )}
        </>
    );
});
