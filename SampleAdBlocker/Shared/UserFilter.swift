import Foundation

class UserFilterStorage {
    static let storageFilename = "user_rules.txt"

    static func getRules() throws {
//        let dir = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")
//
//        let file = dir!.appendingPathComponent(UserFilterStorage.storageFilename);
//
//        // FIXME handle errors
//        do {
//            let rulesText = try String(contentsOfFile: file.path, encoding: String.Encoding.utf8)
//            NSLog("Rules received \(rulesText)")
//        } catch {
//            let err = error as NSError
//            if err.code == 260 {
//                return nil;
//            }
//            throw err;
//            NSLog("Error reading userrules file: \(err)")
//        }
    }

    func setRules() {

    }
}

// Manages rules added by user
class UserFilter {
    func addRule(rule: String) {

        // 1. read file
        // 2. check if has rule
            // 3.1. if has than do nothing
            // 3.2. if no than add to the end of file
                // 4. update launch converter
                // 5. set flag for web-extension to be updated if advanced rules updated
    }
}

