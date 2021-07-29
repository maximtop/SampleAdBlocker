import Foundation
import ContentBlockerEngine

class AdvancedContentBlocker {
    static let shared = AdvancedContentBlocker()

    let contentBlockerEngine: ContentBlockerEngine

    init() {
        contentBlockerEngine = ContentBlockerEngine()
        do {
            try getAndSetAdvancedRules()
        } catch {
            NSLog("AG: Was unabled to get and set advanced rules: \(error)")
        }
    }

    func getAndSetAdvancedRules() throws {
        let documentFolder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

        let jsonURL = documentFolder!.appendingPathComponent(Config.advancedRulesBlockerFilename)

        let text = try String(contentsOf: jsonURL, encoding: .utf8);

        try contentBlockerEngine.setJson(json: text);
    }

    public func getBlockingData(url: URL) throws -> String {
        return try contentBlockerEngine.getData(url: url);
    }
}
