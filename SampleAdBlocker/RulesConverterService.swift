import Foundation
import ContentBlockerConverter

class RulesConverterService {
    /**
     * Reads rules from test filter
     */
    static func getRules() -> [String]? {
        let filePath = Bundle.main.url(forResource: "base-filter", withExtension: "txt")
        do {
            let rules = try String(contentsOf: filePath!, encoding: .utf8)
            let result = rules.components(separatedBy: "\n")
            NSLog("\(result)")
            return result
        } catch {
            NSLog("Error reading test filter")
        }
        return nil
    }

    /**
     * Converts rules
     */
    static func convertRules(rules: [String]) -> ConversionResult? {
        let result: ConversionResult? = ContentBlockerConverter().convertArray(rules: rules, advancedBlocking: true)
        NSLog("Converted: \(result!.converted)")
        NSLog("Advanced Blocking: \(result!.advancedBlocking ?? "Empty")")
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
        } catch let error {
            print(error)
            NSLog("Error saving conversion result")
        }
    }

    static func applyConverter() {
        let rulesList = getRules()!

        let rulesData = convertRules(rules: rulesList)!.converted.data(using: .utf8)
        saveConversionResult(rules: rulesData!, fileName: Constants.blockerListFilename)
    }
}
