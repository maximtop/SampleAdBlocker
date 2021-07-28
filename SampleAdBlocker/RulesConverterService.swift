import Foundation
import ContentBlockerConverter

class RulesConverterService {
    /**
     * Reads rules from test filter
     */
    static func getRules() -> [String]? {
        var result: [String] = []
        // FIXME set 17
        for index in 1...17 {
            let filePath = Bundle.main.url(forResource: "filter_\(index)", withExtension: "txt")
            do {
                NSLog("--------------------------------------")
                NSLog("Filter \(String(describing: filePath))")
                let rulesText = try String(contentsOf: filePath!, encoding: .utf8)
                let rules = rulesText.components(separatedBy: "\n")
                result += rules
            } catch {
                NSLog("Error: \(error)")
                return nil;
            }
        }
        return result;
    }

    /**
     * Converts rules
     */
    static func convertRules(rules: [String]) -> ConversionResult {
        let result: ConversionResult? = ContentBlockerConverter().convertArray(rules: rules, advancedBlocking: true)
//        NSLog("Converted: \(result!.converted)")
//        NSLog("Advanced Blocking: \(result!.advancedBlocking ?? "Empty")")
        return result!
    }

    /**
     * Writes conversion result into file in groups directory
     */
    static func saveConversionResult(rules: Data, fileName: String) {
        let dir = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

        let fileURL = dir!.appendingPathComponent(fileName)

        NSLog("Path to the content blocker: \(fileURL.path)")
        do {
            try rules.write(to: fileURL)
        } catch {
            print(error)
            NSLog("Error saving conversion result")
        }
    }

    static func applyConverter() {
        let rulesList = getRules()!

        let rules = convertRules(rules: rulesList)
        
        let rulesData = rules.converted.data(using: .utf8)
        saveConversionResult(rules: rulesData!, fileName: Config.simpleRulesBlockerFilename)

        if let advancedBlocking = rules.advancedBlocking {
            let advancedData = advancedBlocking.data(using: .utf8)
            saveConversionResult(rules: advancedData!, fileName: Config.advancedRulesBlockerFilename)
        }
    }
}
