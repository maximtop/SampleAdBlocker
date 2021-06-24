import SafariServices
import os.log

let SFExtensionMessageKey = "message"

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let message = item.userInfo?[SFExtensionMessageKey]
        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@", message as! CVarArg)
        
        NSLog("Received message from browser.runtime.sendNativeMessage: \(String(describing: message))")

        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: ["Response to": message]]

        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

}
