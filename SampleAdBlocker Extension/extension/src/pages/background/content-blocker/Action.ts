export interface ActionRaw {
    type: string;

    css?: string;

    script?: string;

    scriptlet?: string;

    scriptletParam?: string;
}

export class Action {
    type: string;

    css?: string;

    script?: string;

    scriptlet?: string;

    scriptletParam?: string;

    constructor(action: ActionRaw) {
        this.type = action.type;

        if (action.css) {
            this.css = action.css;
        }

        if (action.script) {
            this.script = action.script;
        }

        if (action.scriptlet) {
            this.scriptlet = action.scriptlet;
        }

        if (action.scriptletParam) {
            this.scriptletParam = action.scriptletParam;
        }
    }
}
