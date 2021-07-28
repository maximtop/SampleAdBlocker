export enum MessagesToNativeApp {
    GetJsonRules = 'get_json_rules',
    WriteInNativeLog = 'write_in_native_log',
    AddToUserrules = 'add_to_userrules',
    GetBlockingData = 'get_blocking_data',
}

export enum MessagesToBackgroundPage {
    OpenAssistant = 'open_assistant',
    GetScriptsAndSelectors = 'get_scripts_and_selectors',
    AddRule = 'add_rule',
    GetAdvancedJson = 'get_advanced_json',
}

export enum MessagesToContentScript {
    InitAssistant = 'init_assistant',
}
