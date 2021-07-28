import Foundation

// Wrapper result class
class BlockerData: Encodable {
    var scripts = [String]()
    var cssExtended = [String]()
    var cssInject = [String]()
    var scriptlets = [String]()

    func addScript(script: String?) {
        if (script != nil && script != "") {
            scripts.append(script!);
        }
    }

    func addCssExtended(style: String?) {
        if (style != nil && style != "") {
            cssExtended.append(style!);
        }
    }

    func addCssInject(style: String?) {
        if (style != nil && style != "") {
            cssInject.append(style!);
        }
    }

    func addScriptlet(scriptlet: String?) {
        if (scriptlet != nil && scriptlet != "") {
            scriptlets.append(scriptlet!);
        }
    }

    func clear() {
        scripts = [];
        cssExtended = [];
        cssInject = [];
        scriptlets = [];
    }
}
