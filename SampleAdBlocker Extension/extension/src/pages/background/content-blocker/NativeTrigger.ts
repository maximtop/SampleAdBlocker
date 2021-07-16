import { CodingKey } from './CodingKey';
import { Trigger } from './Trigger';

export interface RawNativeTrigger {
    [CodingKey.ifDomain]?: string[],
    [CodingKey.urlFilter]?: string,
    [CodingKey.unlessDomain]?: string[],
    [CodingKey.shortcut]?: string,
}

/**
 * Helps to convert from trigger returned by native application to Trigger
 */
export class NativeTrigger {
    ifDomain?: string[];

    urlFilter?: string;

    unlessDomain?: string[];

    shortcut?: string;

    constructor(trigger: RawNativeTrigger) {
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

    toTrigger() {
        return new Trigger(this);
    }
}
