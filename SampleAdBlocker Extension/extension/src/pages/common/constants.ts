export enum MessagesToNativeApp {
    GetJsonRules = 'get_json_rules',
    WriteInNativeLog = 'write_in_native_log',
}

export enum MessagesToBackgroundPage {
    OpenAssistant = 'open_assistant',
    GetScriptsAndSelectors = 'get_scripts_and_selectors',
    AddRule = 'add_rule',
}

export enum MessagesToContentScript {
    InitAssistant = 'init_assistant',
}
