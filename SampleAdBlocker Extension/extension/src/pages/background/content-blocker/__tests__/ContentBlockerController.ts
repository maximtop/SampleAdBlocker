import { browser } from 'webextension-polyfill-ts';

import { ContentBlockerController } from '../ContentBlockerController';
import { storage } from '../../storage';

// silence log messages
jest.mock('../../../common/log');

jest.mock('../../storage', () => {
    const store: { [key: string]: any } = {};

    return {
        __esModule: true,
        storage: {
            store,
            set: async (key: string, value: unknown) => {
                store[key] = JSON.stringify(value);
            },
            get: async (key: string) => {
                if (store[key]) {
                    return JSON.parse(store[key]);
                }
                return undefined;
            },
        },
    };
});

jest.mock('../../browser', () => {
    const json = `[
            {
                "trigger": {
                    "url-filter": "example.org"
                },
                "action": {
                    "type": "script",
                    "script": "included-script"
                }
            },
            {
                "trigger": {
                    "url-filter": ".*"
                },
                "action": {
                    "type": "css-extended",
                    "css": "#included-css:has(div) { height: 5px; }"
                }
            },
            {
                "trigger": {
                    "url-filter": ".*"
                },
                "action": {
                    "type": "scriptlet",
                    "scriptlet": "abp-hide-if-contains",
                    "scriptletParam": "{\\"name\\":\\"abort-on-property-read\\",\\"args\\":[\\"I10C\\"]}"
                }
            }
        ]`;
    return {
        __esModule: true,
        browser: {
            runtime: {
                sendNativeMessage: jest.fn(async () => {
                    return { data: json };
                }),
            },
        },
    };
});

describe('ContentBlockerController', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('on first init retrieves rules from native app and saves in the storage', async () => {
        const contentBlocker = new ContentBlockerController();
        await contentBlocker.init();
        expect(browser.runtime.sendNativeMessage).toBeCalledTimes(1);
        const data = JSON.parse(contentBlocker.getData('https://example.org'));

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets[0]).toBe('{"name":"abort-on-property-read","args":["I10C"]}');

        const blockerEntries = await storage.get('blocker_entries');
        expect(blockerEntries).toEqual([
            { action: { script: 'included-script', type: 'script' }, trigger: { shortcut: 'example.org', urlFilter: 'example.org' } },
            { action: { css: '#included-css:has(div) { height: 5px; }', type: 'css-extended' }, trigger: { shortcut: undefined, urlFilter: '.*' } },
            { action: { scriptlet: 'abp-hide-if-contains', scriptletParam: '{"name":"abort-on-property-read","args":["I10C"]}', type: 'scriptlet' }, trigger: { shortcut: undefined, urlFilter: '.*' } },
        ]);

        const lookupTables = await storage.get('lookup_tables');
        expect(lookupTables).toEqual({
            domainsLookupTable: {},
            otherRules: [1, 2],
            shortcutsHistogram: {
                210711749536: 1,
            },
            shortcutsLookupTable: {
                210711749536: [0],
            },
        });
    });

    it('on next init retrieves rules from storage', async () => {
        let contentBlocker = new ContentBlockerController();
        await contentBlocker.init();

        expect(browser.runtime.sendNativeMessage).toBeCalledTimes(1);
        let data = JSON.parse(contentBlocker.getData('https://example.org'));

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets[0]).toBe('{"name":"abort-on-property-read","args":["I10C"]}');

        // fake second initialization
        contentBlocker = new ContentBlockerController();
        await contentBlocker.init();
        expect(browser.runtime.sendNativeMessage).toBeCalledTimes(1);

        data = JSON.parse(contentBlocker.getData('https://example.org'));

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets[0]).toBe('{"name":"abort-on-property-read","args":["I10C"]}');
    });
});
