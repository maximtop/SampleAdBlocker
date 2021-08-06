import { createContext } from 'react';
import { browser } from 'webextension-polyfill-ts';
import {
    action,
    configure,
    observable,
    runInAction,
    makeObservable, computed,
} from 'mobx';

import { getDomain } from '../../common/utils/url';
import { translator } from '../../common/translators/translator';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

enum PopupDataLoadingState {
    Idle = 'Idle',
    Loading = 'Loading',
    Done = 'Done',
}

enum SiteStatus {
    ProtectionStarting = 'ProtectionStarting',
    ProtectionEnabled = 'ProtectionEnabled',
    Allowlisted = 'Allowlisted',
    BasicOnly = 'BasicOnly',
}

const SiteStatusesMessages = {
    [SiteStatus.ProtectionStarting]: translator.getMessage('popup_action_current_site_desc_starting'),
    [SiteStatus.ProtectionEnabled]: translator.getMessage('popup_action_current_site_status_desc_enabled'),
    [SiteStatus.Allowlisted]: translator.getMessage('popup_action_current_site_desc_allowlisted'),
    [SiteStatus.BasicOnly]: translator.getMessage('popup_action_current_site_desc_basic_only'),
};

class PopupStore {
    @observable popupDataLoadingState = PopupDataLoadingState.Idle;

    @observable currentSiteStatus = SiteStatus.ProtectionEnabled;

    @observable currentSiteUrl: string | undefined;

    constructor() {
        makeObservable(this);
    }

    @action
    getPopupData = async () => {
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });

        const [currentTab] = tabs;
        console.log(currentTab);

        runInAction(() => {
            this.currentSiteUrl = currentTab.url;
            console.log(this.currentSiteUrl)
        });
    };

    @computed
    get currentSiteDomain(): string {
        if (!this.currentSiteUrl) {
            return '';
        }

        return getDomain(this.currentSiteUrl);
    }

    @computed
    get currentSiteStatusMessage(): string {
        return SiteStatusesMessages[this.currentSiteStatus];
    }
}

export const popupStore = createContext(new PopupStore());
