import { CodingKey } from './CodingKey';

export interface TriggerRaw {
    [CodingKey.ifDomain]?: string[],
    [CodingKey.urlFilter]?: string,
    [CodingKey.unlessDomain]?: string[],
    [CodingKey.shortcut]?: string,
}

export class Trigger {
    ifDomain?: string[];

    urlFilter?: string;

    unlessDomain?: string[];

    shortcut?: string;

    regex?: RegExp;

    constructor(trigger: TriggerRaw) {
        if (trigger[CodingKey.ifDomain]) {
            this.ifDomain = trigger[CodingKey.ifDomain];
        }
        if (trigger[CodingKey.urlFilter]) {
            this.urlFilter = trigger[CodingKey.urlFilter];
        }
        if (trigger[CodingKey.unlessDomain]) {
            this.unlessDomain = trigger[CodingKey.unlessDomain];
        }
        if (trigger[CodingKey.shortcut]) {
            this.shortcut = trigger[CodingKey.shortcut];
        }
    }

    setShortcut(shortcutValue?: string) {
        this.shortcut = shortcutValue;
    }

    setRegex(regex?: RegExp) {
        this.regex = regex;
    }
}
