/**
 * Wrapper class for results
 */
export class BlockerData {
    scripts: string[] = [];

    cssExtended: string[] = [];

    cssInject: string[] = [];

    scriptlets: string[] = [];

    addScript(script?: string) {
        if (script != null && script !== '') {
            this.scripts.push(script);
        }
    }

    addCssExtended(style?: string) {
        if (style != null && style !== '') {
            this.cssExtended.push(style);
        }
    }

    addCssInject(style?: string) {
        if (style != null && style !== '') {
            this.cssInject.push(style);
        }
    }

    addScriptlet(scriptlet?: string) {
        if (scriptlet != null && scriptlet !== '') {
            this.scriptlets.push(scriptlet);
        }
    }
}
