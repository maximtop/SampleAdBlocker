import Foundation
import SafariServices
import os.log

let SFExtensionMessageKey = "message"

struct ExtensionMessage {
    var type: String
    var data: [String: Any]?

    init(message: [String: Any]) {
        type = message["type"] as! String
        data = message["data"] as? [String : Any]
    }
}

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    // This method will be called when a background page calls browser.runtime.sendNativeMessage
    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let rawMessage = item.userInfo?[SFExtensionMessageKey] as! [String: Any]

        let message = ExtensionMessage(message: rawMessage)

        NSLog("AG: The extension received a message (%@)", message.type);

        // Content script requests scripts and css for current page
        if (message.type == "get_rules") {
            do {
                let documentFolder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

                let jsonURL = documentFolder!.appendingPathComponent(Constants.advancedRulesBlockerFilename)

                NSLog("Advanced rules path \(jsonURL.path)")

                let text = try String(contentsOf: jsonURL, encoding: .utf8);

                let response = NSExtensionItem()
                response.userInfo = [SFExtensionMessageKey: ["data": text]]

                context.completeRequest(returningItems: [response], completionHandler: nil)
            } catch {
                NSLog("AG: Error handling message (\(message.type)): \(error)");
            }
        }
    }

}
