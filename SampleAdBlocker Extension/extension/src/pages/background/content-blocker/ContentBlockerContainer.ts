/* eslint-disable no-restricted-syntax */
import { parse } from 'tldts';
import { BlockerEntry } from './BlockerEntry';
import { NetworkEngine } from './NetworkEngine';
import { log } from '../../common/log';
import { BlockerData } from './BlockerData';
import { Action, ActionRaw } from './Action';
import { Trigger, TriggerRaw } from './Trigger';

/**
 * Storage and parser
 */
export class ContentBlockerContainer {
    private blockerEntries: BlockerEntry[];

    private networkEngine: NetworkEngine;

    constructor() {
        this.blockerEntries = [];
        this.networkEngine = new NetworkEngine();
    }

    /**
     * Converts json script into BlockerEntry[] instance
     * @param jsonString
     */
    private parseJsonString = (jsonString: string) => {
        const blockerEntries = JSON.parse(jsonString);
        const enrichedBlockerEntries: BlockerEntry[] = blockerEntries
            .map((entry: { action: ActionRaw, trigger: TriggerRaw }) => {
                const action = new Action(entry.action);
                const trigger = new Trigger(entry.trigger);

                return {
                    action,
                    trigger,
                };
            });
        return enrichedBlockerEntries;
    };

    /**
     * Parses and saves json
     * @param json
     */
    public setJson(json: string): void {
        log.debug(json);
        // Parses "content-blocker" json
        this.blockerEntries = this.parseJsonString(json);

        // Parses shortcuts
        for (let i = 0; i < this.blockerEntries.length; i += 1) {
            this.blockerEntries[i].trigger.setShortcut(
                ContentBlockerContainer.parseShortcut(this.blockerEntries[i].trigger.urlFilter),
            );
        }

        // Init network engine
        this.networkEngine = new NetworkEngine();
        this.networkEngine.addRules(this.blockerEntries);
    }

    /**
     * Parses url shortcuts
     * @param urlMask
     * @private
     */
    private static parseShortcut(urlMask?: string): string | undefined {
        // Skip empty string
        if (!urlMask || urlMask === '') {
            return undefined;
        }

        const mask = urlMask!;

        // Skip all url templates
        if (mask === '.*' || mask === '^[htpsw]+://') {
            return undefined;
        }

        let shortcut: string | undefined = '';
        const isRegexRule = mask.startsWith('/') && mask.endsWith('/');
        if (isRegexRule) {
            shortcut = ContentBlockerContainer.findRegexpShortcut(mask);
        } else {
            shortcut = ContentBlockerContainer.findShortcut(mask);
        }

        // shortcut needs to be at least longer than 1 character
        if (shortcut && shortcut.length > 1) {
            return shortcut;
        }

        return undefined;
    }

    /**
     * Searches for a shortcut inside of a regexp pattern.
     * Shortcut in this case is a longest string with no REGEX special characters
     * Also, we discard complicated regexps right away.
     * @param pattern
     * @private
     */
    private static findRegexpShortcut(pattern: string): string | undefined {
        // strip backslashes
        let mask = pattern.slice(1, pattern.length - 1);

        if (mask.includes('?')) {
            // Do not mess with complex expressions which use lookahead
            // And with those using ? special character: https://github.com/AdguardTeam/AdguardBrowserExtension/issues/978
            return undefined;
        }

        // placeholder for a special character
        const specialCharacter = '...';

        // (Dirty) prepend specialCharacter for the following replace calls to work properly
        mask = specialCharacter + mask;

        // Strip all types of brackets
        let regex = new RegExp('[^\\\\]\\(.*[^\\\\]\\)', 'i');
        mask = mask.replace(regex, specialCharacter);

        regex = new RegExp('[^\\\\]\\[.*[^\\\\]\\]', 'i');
        mask = mask.replace(regex, specialCharacter);

        regex = new RegExp('[^\\\\]\\{.*[^\\\\]\\}', 'i');
        mask = mask.replace(regex, specialCharacter);

        // Strip some special characters (\n, \t etc)
        regex = new RegExp('[^\\\\]\\\\[a-zA-Z]', 'i');
        mask = mask.replace(regex, specialCharacter);

        let longest = '';
        const parts = mask.split(/\*\.\^\|\+\?\$\[\]\(\)\{\}/);
        for (const part of parts) {
            if (part.length > longest.length) {
                longest = part;
            }
        }

        return longest !== '' ? longest.toLowerCase() : undefined;
    }


    /**
     * Searches for the longest substring of the pattern that
     * does not contain any special characters: *,^,|.
     * @param pattern
     * @private
     */
    private static findShortcut(pattern: string): string | undefined {
        let longest = '';
        const parts = pattern.split(/\*\^\|/);
        for (const part of parts) {
            if (part.length > longest.length) {
                longest = part;
            }
        }

        return longest !== '' ? longest.toLowerCase() : undefined;
    }

    /**
     * Returns scripts and css wrapper object for current url
     * @param url
     */
    getData(url: string): BlockerData {
        const blockerData = new BlockerData();

        // Check lookup tables
        const selectedIndexes = this.networkEngine.lookupRules(url);
        selectedIndexes.sort();

        // Get entries for indexes
        const selectedEntries: BlockerEntry[] = [];
        for (const i of selectedIndexes) {
            selectedEntries.push(this.blockerEntries[i]);
        }

        // Iterate reversed to apply actions or ignore next rules
        for (let i = selectedEntries.length - 1; i >= 0; i -= 1) {
            const entry = selectedEntries[i];
            if (ContentBlockerContainer.isEntryTriggered(entry.trigger, url)) {
                if (entry.action.type === 'ignore-previous-rules') {
                    return blockerData;
                }
                ContentBlockerContainer.addActionContent(blockerData, entry);
            }
        }

        return blockerData;
    }

    /**
     * Checks if trigger content is suitable for current url
     * @param trigger
     * @param url
     * @private
     */
    private static isEntryTriggered(trigger: Trigger, url: string): boolean {
        const parsedUrl = parse(url);
        const host = parsedUrl.hostname;
        const absoluteUrl = url;

        if (trigger.urlFilter && trigger.urlFilter !== '') {
            if (trigger.shortcut && !absoluteUrl.toLowerCase().includes(trigger.shortcut!)) {
                return false;
            }

            if (!host || !ContentBlockerContainer.checkDomains(trigger, host)) {
                return false;
            }

            return ContentBlockerContainer.matchesUrlFilter(absoluteUrl, trigger);
        }
        // Pass empty url-filter

        return false;
    }

    /**
     * Checks if trigger domain's fields matches current host
     * @param trigger
     * @param host
     * @private
     */
    private static checkDomains(trigger: Trigger, host: string): boolean {
        const permittedDomains = trigger.ifDomain;
        const restrictedDomains = trigger.unlessDomain;

        const permittedDomainsEmpty = !permittedDomains || permittedDomains.length === 0;
        const restrictedDomainsEmpty = !restrictedDomains || restrictedDomains.length === 0;

        if (permittedDomainsEmpty && restrictedDomainsEmpty) {
            return true;
        }

        if (!restrictedDomainsEmpty && permittedDomainsEmpty) {
            return !ContentBlockerContainer.matchesDomains(restrictedDomains!, host);
        }

        if (restrictedDomainsEmpty && !permittedDomainsEmpty) {
            return ContentBlockerContainer.matchesDomains(permittedDomains!, host);
        }

        return ContentBlockerContainer.matchesDomains(permittedDomains!, host)
            && !ContentBlockerContainer.matchesDomains(restrictedDomains!, host);
    }

    /**
     * Checks if domain matches at least one domain pattern
     * @param domainPatterns
     * @param domain
     * @private
     */
    private static matchesDomains(domainPatterns: string[], domain: string): boolean {
        for (const pattern of domainPatterns) {
            if (domain === pattern) {
                return true;
            }

            // If pattern starts with '*' - it matches sub domains
            if (pattern
                && domain.endsWith(pattern.slice(1))
                && pattern.startsWith('*')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if text matches specified trigger
     * Checks url-filter or cached regexp
     * @param text
     * @param trigger
     * @private
     */
    private static matchesUrlFilter(text: string, trigger: Trigger): boolean {
        const pattern = trigger.urlFilter;
        if (pattern === '.*' || pattern === '^[htpsw]+:\\/\\/') {
            return true;
        }

        if (!trigger.regex) {
            const regex = new RegExp(pattern!);
            trigger.setRegex(regex);
        }

        if (!trigger.regex) {
            return text.indexOf(pattern!) > -1;
        }

        return trigger.regex.test(text);
    }

    /**
     * Adds scripts or css to blocker data object
     * @param blockerData
     * @param blockerEntry
     * @private
     */
    private static addActionContent(blockerData: BlockerData, blockerEntry: BlockerEntry) {
        if (blockerEntry.action.type === 'css-extended') {
            blockerData.addCssExtended(blockerEntry.action.css);
        } else if (blockerEntry.action.type === 'css-inject') {
            blockerData.addCssInject(blockerEntry.action.css);
        } else if (blockerEntry.action.type === 'script') {
            blockerData.addScript(blockerEntry.action.script);
        } else if (blockerEntry.action.type === 'scriptlet') {
            blockerData.addScriptlet(blockerEntry.action.scriptletParam);
        }
    }
}
