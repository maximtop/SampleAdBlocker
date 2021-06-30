import { ContentBlockerContainer } from '../ContentBlockerContainer';

describe('ContentBlockerContainer', () => {
    it('converts simple rules', () => {
        const json = `[
            {
                "trigger": {
                    "url-filter": ".*"
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
        const contentBlockerContainer = new ContentBlockerContainer();

        contentBlockerContainer.setJson(json);

        const data = contentBlockerContainer.getData('http://example.org');
        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets[0]).toBe('{"name":"abort-on-property-read","args":["I10C"]}');
    });

    it('converts trigger url filter all', () => {
        const json = `[
                {
                    "trigger": {
                        "url-filter": ".*"
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
                        "url-filter": "test.com"
                    },
                    "action": {
                        "type": "css",
                        "css": "#excluded-css:has(div) { height: 5px; }"
                    }
                }
            ]`;

        const contentBlockerContainer = new ContentBlockerContainer();

        contentBlockerContainer.setJson(json);

        const data = contentBlockerContainer.getData('http://example.org');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets.length).toBe(0);
    });
});
