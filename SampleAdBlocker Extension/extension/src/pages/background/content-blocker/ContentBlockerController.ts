import { log } from '../../common/log';
import { ContentBlockerContainer } from './ContentBlockerContainer';
import { BlockerData } from './BlockerData';
import { Messages } from '../../common/constants';
import { browser } from '../browser';

export class ContentBlockerController {
    private contentBlockerContainer: ContentBlockerContainer;

    private blockerDataCache: Map<string, string>;

    private initiated: boolean = false;

    constructor() {
        this.contentBlockerContainer = new ContentBlockerContainer();
        this.blockerDataCache = new Map();
    }

    /**
     * Downloads and sets up json from shared resources
     * @private
     */
    private async getAndSetRulesFromNativeApp() {
        const response = await browser.runtime.sendNativeMessage(
            'application-id',
            {
                type: Messages.GetRules,
            },
        );
        this.contentBlockerContainer.setJson(response.data);
    }

    /**
     * Checks if rules are persisted in the storage
     */
    hasRulesInStorage() {
        return this.contentBlockerContainer.hasRulesInStorage();
    }

    /**
     * Recovers rules from storage
     */
    getAndSetRulesFromStorage() {
        return this.contentBlockerContainer.getAndSetRulesFromStorage();
    }

    /**
     * Downloads and sets up json from shared resources
     */
    async init() {
        if (this.initiated) {
            return;
        }

        log.debug('AG: AdvancedBlocking: init ContentBlockerController');

        // Drop cache
        this.blockerDataCache = new Map();

        try {
            // checks if rules are in the storage
            //  - if yes: get and set rules from storage
            //  - if not: get and set rules from native app
            const result = await this.hasRulesInStorage();
            if (result) {
                await this.getAndSetRulesFromStorage();
            } else {
                await this.getAndSetRulesFromNativeApp();
            }
            this.initiated = true;
            log.debug('AG: AdvancedBlocking: rules setup went successfully');
        } catch (e) {
            log.debug(`AG: AdvancedBlocking: Error setting rules: ${e}`);
        }
    }

    getBlockerData(url: string): string {
        const data: BlockerData = this.contentBlockerContainer.getData(url);
        return JSON.stringify(data);
    }

    /**
     * Returns requested scripts and css for specified url
     * @param url
     */
    getData(url: string): string {
        const cacheKey = url;
        if (this.blockerDataCache.has(cacheKey)) {
            log.debug('AG: AdvancedBlocking: Return cached version');
            return this.blockerDataCache.get(cacheKey) as string;
        }

        let data = '';
        try {
            data = this.getBlockerData(url);
            this.blockerDataCache.set(cacheKey, data);

            log.debug('AG: AdvancedBlocking: Return data');
        } catch (error) {
            log.debug(`AG: AdvancedBlocking: Error getting data: ${error}`);
        }

        return data;
    }
}
