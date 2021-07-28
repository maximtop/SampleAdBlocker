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
    private var contentBlockerController: ContentBlockerController? = nil;

    // This method will be called when a background page calls browser.runtime.sendNativeMessage
    func beginRequest(with context: NSExtensionContext) {
        if (self.contentBlockerController == nil) {
            NSLog("Set new content blocker controller")
            self.contentBlockerController = ContentBlockerController.shared;
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
            // FIXME remove
            NSLog("Page url: \(String(describing: pageUrl))");

            if pageUrl == nil {
                context.completeRequest(returningItems: nil, completionHandler: nil)
                return;
            }

            do {
                NSLog("Start get blocking data")
                let blockingData = try self.contentBlockerController!.getData(url: pageUrl!);
                NSLog("End get blocking data")
                NSLog(blockingData)
                let response = NSExtensionItem()
                response.userInfo = [SFExtensionMessageKey: ["data": blockingData]]
                context.completeRequest(returningItems: [response], completionHandler: nil)
            } catch {
                NSLog("Error getting blocking data")
                NSLog("AG: An error ocurred: \(error)")
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

//        context.completeRequest(returningItems: nil, completionHandler: nil)
    }

}
