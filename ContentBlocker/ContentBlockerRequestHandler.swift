import Foundation

class ContentBlockerRequestHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        NSLog("TEST")

        let documentFolder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

        NSLog("print: \(documentFolder!.absoluteString)")

        guard let jsonURL = documentFolder?.appendingPathComponent(Constants.blockerListFilename) else {
            return
        }

        let attachment = NSItemProvider(contentsOf: jsonURL)!

        let item = NSExtensionItem()
        item.attachments = [attachment]

        context.completeRequest(returningItems: [item], completionHandler: nil)
    }

}
