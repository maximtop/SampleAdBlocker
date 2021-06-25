import Foundation
import SafariServices
import os.log

let SFExtensionMessageKey = "message"

struct ExtensionMessage {
    var type: String
    var data: [String: Any]

    init(message: [String: Any]) {
        type = message["type"] as! String
        data = message["data"] as! [String: Any]
    }
}

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    private var contentBlockerController: ContentBlockerController? = nil;

    // This method will be called when a background page calls browser.runtime.sendNativeMessage
    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let rawMessage = item.userInfo?[SFExtensionMessageKey] as! [String: Any]

        let message = ExtensionMessage(message: rawMessage)

        NSLog("Received message from browser.runtime.sendNativeMessage: \(String(describing: message))")

        if (contentBlockerController == nil) {
            contentBlockerController = ContentBlockerController.shared;
        }

        NSLog("AG: The extension received a message (%@)", message.type);

        // Content script requests scripts and css for current page
        if (message.type == "get_selectors_and_scripts") {
            do {
                let url = message.data["url"] as! String

                NSLog("AG: Page url: %@", url);

                let pageUrl = URL(string: url);
                if pageUrl == nil {
                    return;
                }

                let data = try contentBlockerController!.getData(url: pageUrl!)

                let response = NSExtensionItem()
                response.userInfo = [SFExtensionMessageKey: ["data": data]]

                context.completeRequest(returningItems: [response], completionHandler: nil)

            } catch {
                NSLog("AG: Error handling message (\(message.type)): \(error)");
            }
        }
    }

}
