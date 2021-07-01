import { browser } from 'webextension-polyfill-ts';

import { log } from '../../common/log';
import { ContentBlockerContainer } from './ContentBlockerContainer';
import { BlockerData } from './BlockerData';
import { Messages } from '../../common/constants';

export class ContentBlockerController {
    private contentBlockerContainer: ContentBlockerContainer;

    private blockerDataCache: Map<string, string>;

    private initiated: boolean = false;

    constructor() {
        log.debug('AG: AdvancedBlocking init ContentBlockerController');

        this.contentBlockerContainer = new ContentBlockerContainer();
        this.blockerDataCache = new Map();

        this.setupJson();
    }

    /**
     * Downloads and sets up json from shared resources
     * @private
     */
    private async initJson() {
        const response = await browser.runtime.sendNativeMessage(
            'application-id',
            {
                type: Messages.GetRules,
            },
        );
        this.contentBlockerContainer.setJson(response.data);
    }

    /**
     * Downloads and sets up json from shared resources
     */
    async setupJson() {
        // Drop cache
        this.blockerDataCache = new Map();

        try {
            await this.initJson();
            this.initiated = true;
            log.debug('AG: AdvancedBlocking: Json setup successfully.');
        } catch (error) {
            log.debug(`AG: AdvancedBlocking: Error setting json: ${error}`);
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
        if (!this.initiated) {
            log.debug("Can't get data, because not initiated yet");
            return '';
        }

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
