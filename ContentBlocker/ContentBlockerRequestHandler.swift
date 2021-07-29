import Foundation

class ContentBlockerRequestHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let documentFolder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

        let jsonURL = documentFolder!.appendingPathComponent(Config.simpleRulesBlockerFilename)

        NSLog("AG: ContentBlocker path \(jsonURL.path)")

        let attachment = NSItemProvider(contentsOf: jsonURL)!

        let item = NSExtensionItem()
        item.attachments = [attachment]

        context.completeRequest(returningItems: [item], completionHandler: nil)
    }
}
