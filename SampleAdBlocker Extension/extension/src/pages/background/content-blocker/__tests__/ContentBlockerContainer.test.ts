import { ContentBlockerContainer } from '../ContentBlockerContainer';

describe('ContentBlockerContainer', () => {
    const contentBlockerContainer = new ContentBlockerContainer();

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

        contentBlockerContainer.setJson(json);

        const data = contentBlockerContainer.getData('http://example.org');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets.length).toBe(0);
    });

    it('convert trigger url filter', () => {
        const json = `
            [
            {
                "trigger": {
                    "url-filter": "example.com"
                },
                "action": {
                    "type": "script",
                    "script": "included-script"
                }
            },
                {
                    "trigger": {
                        "url-filter": "not-example.com"
                    },
                    "action": {
                        "type": "css-extended",
                        "css": "#excluded-css:has(div) { height: 5px; }"
                    }
                }
            ]
        `;

        contentBlockerContainer.setJson(json);

        const data = contentBlockerContainer.getData('http://example.com');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });

    it('testUrlFilterIfDomain', () => {
        const contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": "^[htpsw]+:\\/\\/",
                    "if-domain": [
                        "example.com"
                    ]
                },
                "action": {
                    "type": "script",
                    "script": "included-script"
                }
            },
                {
                    "trigger": {
                        "url-filter": "^[htpsw]+:\\/\\/",
                        "if-domain": [
                            "not-example.com"
                        ]
                    },
                    "action": {
                        "type": "css-extended",
                        "css": "#excluded-css:has(div) { height: 5px; }"
                    }
                }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        const data = contentBlockerContainer.getData('http://example.com');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });

    it('testUrlFilterIfSubDomain', () => {
        const contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": "^[htpsw]+:\\/\\/",
                    "if-domain": [
                        "*example.com"
                    ]
                },
                "action": {
                    "type": "script",
                    "script": "included-script"
                }
            },
                {
                    "trigger": {
                        "url-filter": "^[htpsw]+:\\/\\/",
                        "if-domain": [
                            "not-example.com"
                        ]
                    },
                    "action": {
                        "type": "css-extended",
                        "css": "#excluded-css:has(div) { height: 5px; }"
                    }
                }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        const data = contentBlockerContainer.getData('http://sub.example.com');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });

    it('testUrlFilterUnlessDomain', () => {
        const contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": ".*",
                    "unless-domain": [
                        "example.com",
                        "test.com"
                    ]
                },
                "action": {
                    "type": "script",
                    "script": "excluded-script"
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
                }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        const data = contentBlockerContainer.getData('http://example.com');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended[0]).toBe('#included-css:has(div) { height: 5px; }');
        expect(data.scriptlets.length).toBe(0);
    });

    it('testIgnorePreviousRules', () => {
        const contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": ".*"
                },
                "action": {
                    "type": "script",
                    "script": "example-ignored-script"
                }
            },
                {
                    "trigger": {
                        "url-filter": ".*",
                        "if-domain": [
                            "example.com"
                        ]
                    },
                    "action": {
                        "type": "ignore-previous-rules"
                    }
                },
                {
                    "trigger": {
                        "url-filter": ".*"
                    },
                    "action": {
                        "type": "script",
                        "script": "included-script"
                    }
                }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        let data = contentBlockerContainer.getData('http://example.com');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);

        data = contentBlockerContainer.getData('http://test.com');

        expect(data.scripts[0]).toBe('included-script');
        expect(data.scripts[1]).toBe('example-ignored-script');
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });

    it('testIgnorePreviousRulesExtended', () => {
        const contentBlockerJsonString = `
            [{
            "trigger": {"url-filter": ".*", "if-domain": ["*example-more.com", "*example.org"]},
            "action": {"type": "script", "script": "alert(1);"}
        }, {
            "trigger": {"url-filter": "^[htpsw]+:\\/\\/", "if-domain": ["*example.org"]},
            "action": {"type": "ignore-previous-rules"}
        }, {
            "trigger": {"url-filter": "^[htpsw]+:\\/\\/", "if-domain": ["*example.org"]},
            "action": {"type": "ignore-previous-rules"}
        }]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        let data = contentBlockerContainer.getData('http://example.org');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);

        data = contentBlockerContainer.getData('http://example-more.com');

        expect(data.scripts[0]).toBe('alert(1);');
        expect(data.cssInject.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });

    it('testIgnorePreviousRulesScripts', () => {
        const contentBlockerJsonString = `
            [
            {
                "trigger":
                    {
                        "url-filter":".*",
                        "if-domain":["*example.com"]
                    },
                "action":{"type":"script","script":"alert(1);"}
            },
                {
                    "trigger":
                        {
                            "url-filter":".*",
                            "if-domain":["*example.com"],
                            "resource-type":["document"]
                        },
                    "action":{"type":"ignore-previous-rules"}
                }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        const data = contentBlockerContainer.getData('http://example.com');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });

    it('testUrlFilterShortcuts', () => {
        const contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": "/YanAds/"
                },
                "action": {
                    "type": "script",
                    "script": "excluded-script"
                }
            },
                {
                    "trigger": {
                        "url-filter": "/cdsbData_gal/bannerFile/"
                    },
                    "action": {
                        "type": "script",
                        "script": "excluded-script"
                    }
                },
                {
                    "trigger": {
                        "url-filter": "test.ru"
                    },
                    "action": {
                        "type": "script",
                        "script": "test-included-script"
                    }
                }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        const data = contentBlockerContainer.getData('http://test.ru');

        expect(data.scripts[0]).toBe('test-included-script');
    });

    it('testInvalidItems', () => {
        // Invalid trigger
        let contentBlockerJsonString = `
            [
            {
                "trigger": {
                },
                "action": {
                    "type": "script",
                    "script": "some-script"
                }
            }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        let data = contentBlockerContainer.getData('http://test.ru');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);

        // Unsupported action
        contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": ".*"
                },
                "action": {
                    "type": "unsupported",
                    "script": "some-script"
                }
            }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        data = contentBlockerContainer.getData('http://test.ru');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);

        // Invalid action
        contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": ".*"
                },
                "action": {
                    "type": "script"
                }
            }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        data = contentBlockerContainer.getData('http://test.ru');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);

        // Invalid regexp
        contentBlockerJsonString = `
            [
            {
                "trigger": {
                    "url-filter": "t{1}est.ru{a)$"
                },
                "action": {
                    "type": "script",
                    "script": "some-script"
                }
            }
            ]
        `;

        contentBlockerContainer.setJson(contentBlockerJsonString);
        data = contentBlockerContainer.getData('http://test.ru');

        expect(data.scripts.length).toBe(0);
        expect(data.cssExtended.length).toBe(0);
        expect(data.scriptlets.length).toBe(0);
    });
});
