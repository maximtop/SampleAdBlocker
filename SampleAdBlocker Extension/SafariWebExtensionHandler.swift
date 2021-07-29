import Foundation
import SafariServices
import os.log

let SFExtensionMessageKey = "message"

struct ExtensionMessage {
    var type: String
    var data: String

    init(message: [String: Any]) {
        type = message["type"] as! String
        data = message["data"] as! String
    }
}

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    private var advancedContentBlocker: AdvancedContentBlocker? = nil;

    // This method will be called when a background page calls browser.runtime.sendNativeMessage
    func beginRequest(with context: NSExtensionContext) {
        if (advancedContentBlocker == nil) {
            advancedContentBlocker = AdvancedContentBlocker.shared;
        }

        let item = context.inputItems[0] as! NSExtensionItem
        let rawMessage = item.userInfo?[SFExtensionMessageKey] as! [String: Any]

        let message = ExtensionMessage(message: rawMessage)

        NSLog("AG: The extension received a message: \(message)")

        switch message.type {
        case "get_json_rules":
            do {
                let documentFolder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

                let jsonURL = documentFolder!.appendingPathComponent(Config.advancedRulesBlockerFilename)

                NSLog("Advanced rules path \(jsonURL.path)")

                let text = try String(contentsOf: jsonURL, encoding: .utf8);

                NSLog(String(text.prefix(20)))

                let response = NSExtensionItem()
                response.userInfo = [SFExtensionMessageKey: ["data": text]]

                context.completeRequest(returningItems: [response], completionHandler: nil)
            } catch {
                NSLog("AG: Error handling message (\(message.type)): \(error)");
            }
            break;
        case "get_blocking_data":
            let pageUrl = URL(string: message.data);

            if pageUrl == nil {
                context.completeRequest(returningItems: nil, completionHandler: nil)
                return;
            }

            do {
                let blockingData = try advancedContentBlocker!.getBlockingData(url: pageUrl!);

                // prepare response
                let response = NSExtensionItem()
                response.userInfo = [SFExtensionMessageKey: ["data": blockingData]]
                context.completeRequest(returningItems: [response], completionHandler: nil)
            } catch {
                NSLog("AG: An error occured on getting blocking data: \(error)")
            }
            break;
        case "write_in_native_log":
            NSLog("AG: Log from extension \(message.data)")
            break;
        case "add_to_userrules":
            NSLog("AG: Add to user rules \(message.data)");
            break;
        default:
            break;
        }
    }

}
