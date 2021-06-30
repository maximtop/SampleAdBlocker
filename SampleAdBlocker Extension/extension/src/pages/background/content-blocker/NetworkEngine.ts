/* eslint-disable no-restricted-syntax,no-continue */
// Builds lookup tables:
// 1. domain -> ruleIdx
// 2. shortcut hash -> ruleIdx
// 3. no shortcuts indexes list
import { parse } from 'tldts';
import { BlockerEntry } from './BlockerEntry';

export class NetworkEngine {
    private shortcutLength = 5;

    private domainsLookupTable: Map<number, number[]>;

    private shortcutsLookupTable: Map<number, number[]>;

    private shortcutsHistogram: Map<number, number>;

    private otherRules: number[];

    /**
     * Constructor
     */
    constructor() {
        this.domainsLookupTable = new Map();
        this.shortcutsLookupTable = new Map();
        this.shortcutsHistogram = new Map();
        this.otherRules = [];
    }

    /**
     * Adds rules to engine
     * @param entries
     */
    addRules(entries: BlockerEntry[]): void {
        for (let i = 0; i < entries.length; i += 1) {
            this.addRule(entries[i], i);
        }
    }

    /**
     * Looks for matches in lookup tables
     * @param url
     */
    lookupRules(url: string): number[] {
        const absoluteUrl = url;
        const parsedUrl = parse(url);
        const host = parsedUrl.hostname || '';

        // First check by shortcuts
        const result = this.matchShortcutsLookupTable(absoluteUrl);

        // Check domains lookup
        for (const index of this.matchDomainsLookupTable(host)) {
            result.push(index);
        }

        // Add all other rules
        for (const index of this.otherRules) {
            result.push(index);
        }

        return result;
    }

    /**
     * Finds all matching rules from the domains lookup table
     * @param host
     * @private
     */
    private matchDomainsLookupTable(host: string): number[] {
        const result: number[] = [];

        if (host === '') {
            return result;
        }

        const domains = NetworkEngine.getSubdomains(host);
        for (const domain of domains) {
            const hash = NetworkEngine.fastHash(domain);
            const rules = this.domainsLookupTable.get(hash);
            if (!rules) {
                continue;
            }

            for (const ruleIdx of rules) {
                result.push(ruleIdx);
            }
        }
        return result;
    }

    /**
     * Returns subdomains of domain
     * @param hostname
     * @private
     */
    private static getSubdomains(hostname: string): string[] {
        const parts = hostname.split('.');
        const subdomains: string[] = [];
        let domain = '';
        for (const part of parts.reverse()) {
            if (domain === '') {
                domain = String(part);
            } else {
                domain = `${part}.${domain}`;
            }
            subdomains.push(domain);
        }

        return subdomains;
    }

    /**
     * finds all matching rules from the shortcuts lookup table
     * @param url
     * @private
     */
    private matchShortcutsLookupTable(url: string): number[] {
        const result: number[] = [];

        for (let i = 0; i < (url.length - this.shortcutLength); i += 1) {
            const hash = NetworkEngine.fastHashBetween(url, i, i + this.shortcutLength);
            const rules = this.shortcutsLookupTable.get(hash);
            if (!rules) {
                continue;
            }

            for (const ruleIdx of rules) {
                result.push(ruleIdx);
            }
        }

        return result;
    }

    /**
     * Adds rule to the network engine
     * @param entry
     * @param index
     * @private
     */
    private addRule(entry: BlockerEntry, index: number) {
        if (!this.addRuleToShortcutsTable(entry, index)) {
            if (!this.addRuleToDomainsTable(entry, index)) {
                if (!this.otherRules.includes(index)) {
                    this.otherRules.push(index);
                }
            }
        }
    }

    private addRuleToShortcutsTable(entry: BlockerEntry, index: number): boolean {
        const shortcuts = this.getRuleShortcuts(entry);

        if (!shortcuts || shortcuts?.length === 0) {
            return false;
        }

        // Find the applicable shortcut (the least used)
        let shortcutHash: number = 0;
        let minCount: number = 2147483647;

        shortcuts.forEach((shortcutToCheck) => {
            const hash = NetworkEngine.fastHash(shortcutToCheck);
            let count = this.shortcutsHistogram.get(hash);
            if (!count) {
                count = 0;
            }

            if (count < minCount) {
                minCount = count;
                shortcutHash = hash;
            }
        });

        // Increment the histogram
        this.shortcutsHistogram.set(shortcutHash, minCount + 1);

        // Add the rule to the lookup table
        let rulesIndexes = this.shortcutsLookupTable.get(shortcutHash);
        if (!rulesIndexes) {
            rulesIndexes = [];
        }

        rulesIndexes.push(index);
        this.shortcutsLookupTable.set(shortcutHash, rulesIndexes);

        return true;
    }

    /**
     * Returns a list of shortcuts that can be used for the lookup table
     */
    private getRuleShortcuts(entry: BlockerEntry): string[] | null {
        const entryShortcut = entry.trigger?.shortcut;
        if (!entryShortcut) {
            return null;
        }

        if (entryShortcut.length < this.shortcutLength) {
            return null;
        }

        if (NetworkEngine.isAnyURLShortcut(entryShortcut)) {
            return null;
        }

        const shortcuts: string[] = [];

        for (let i = 0; i < (entryShortcut.length - this.shortcutLength); i += 1) {
            const s = entryShortcut.substring(i, i + this.shortcutLength);
            shortcuts.push(s);
        }

        return shortcuts;
    }

    /**
     * Checks if the rule potentially matches too many URLs.
     * We'd better use another type of lookup table for this kind of rules.
     * @private
     */
    private static isAnyURLShortcut(shortcut: String): boolean {
        // Sorry for magic numbers
        // The numbers are basically ("PROTO://".length + 1)
        if (shortcut.length < 6 && shortcut.startsWith('ws:')) {
            return true;
        }

        if (shortcut.length < 7 && shortcut.startsWith('|ws')) {
            return true;
        }

        if (shortcut.length < 9 && shortcut.startsWith('http')) {
            return true;
        }

        if (shortcut.length < 10 && shortcut.startsWith('|http')) {
            return true;
        }

        return false;
    }

    private addRuleToDomainsTable(entry: BlockerEntry, index: number): boolean {
        const permittedDomains = entry.trigger.ifDomain;
        if (!permittedDomains || permittedDomains.length === 0) {
            return false;
        }

        for (const domain of permittedDomains) {
            let pattern = domain;
            if (domain.startsWith('*')) {
                pattern = domain.slice(1);
            }

            const hash = NetworkEngine.fastHash(pattern);

            // Add the rule to the lookup table
            let rulesIndexes = this.domainsLookupTable.get(hash);
            if (!rulesIndexes) {
                rulesIndexes = [];
            }

            rulesIndexes.push(index);
            this.domainsLookupTable.set(hash, rulesIndexes);
        }

        return true;
    }

    /**
     * djb2 hash algorithm
     *
     * @param str string to get hash
     * @param begin index from
     * @param end index to
     * @return {number} hash
     */
    private static fastHashBetween(str: string, begin: number, end: number): number {
        let hash = 5381;
        for (let idx = begin; idx < end; idx += 1) {
            hash = 33 * hash + str.charCodeAt(idx);
        }

        return hash;
    }

    /**
     * djb2 hash algorithm
     *
     * @param str string to get hash
     * @return {number} hash
     */
    private static fastHash(str: string): number {
        if (str === '') {
            return 0;
        }

        const len = str.length;
        return NetworkEngine.fastHashBetween(str, 0, len);
    }
}
