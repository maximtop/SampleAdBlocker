export interface RawTrigger {
    ifDomain?: string[],
    urlFilter?: string,
    unlessDomain?: string[],
    shortcut?: string,
}

/**
 * Trigger class
 */
export class Trigger {
    ifDomain?: string[];

    urlFilter?: string;

    unlessDomain?: string[];

    shortcut?: string;

    regex?: RegExp;

    constructor(trigger: RawTrigger) {
        if (trigger.ifDomain) {
            this.ifDomain = trigger.ifDomain;
        }
        if (trigger.urlFilter) {
            this.urlFilter = trigger.urlFilter;
        }
        if (trigger.unlessDomain) {
            this.unlessDomain = trigger.unlessDomain;
        }
        if (trigger.shortcut) {
            this.shortcut = trigger.shortcut;
        }
    }

    setShortcut(shortcutValue?: string) {
        this.shortcut = shortcutValue;
    }

    setRegex(regex?: RegExp) {
        this.regex = regex;
    }
}
