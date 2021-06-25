import Foundation

class ContentBlockerController {
    // Singleton instance
    static let shared = ContentBlockerController();

    private var contentBlockerContainer: ContentBlockerContainer;
    private var blockerDataCache: NSCache<NSString, NSString>;

    // Constructor
    private init() {
        NSLog("AG: AdvancedBlocking init ContentBlockerController");

        contentBlockerContainer = ContentBlockerContainer();
        blockerDataCache = NSCache<NSString, NSString>();

        setupJson();
    }

    func initJson() throws {
        let documentFolder = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.SampleAdBlocker")

        let jsonURL = documentFolder!.appendingPathComponent(Constants.advancedRulesBlockerFilename)

        NSLog("Advanced rules path \(jsonURL.path)")

        let text = try String(contentsOf: jsonURL, encoding: .utf8);
        try contentBlockerContainer.setJson(json: text);
    }

    // Downloads and sets up json from shared resources
    func setupJson() {
        // Drop cache
        blockerDataCache = NSCache<NSString, NSString>();

        do {
            try initJson();
            NSLog("AG: AdvancedBlocking: Json setup successfully.");
        } catch {
            NSLog("AG: AdvancedBlocking: Error setting json: \(error)");
        }
    }

    func getBlockerData(url: URL) throws -> String {
        let data: BlockerData = try contentBlockerContainer.getData(url: url) as! BlockerData;

        let encoder = JSONEncoder();
        encoder.outputFormatting = .prettyPrinted

        let json = try encoder.encode(data);
        return String(data: json, encoding: .utf8)!;
    }

    // Returns requested scripts and css for specified url
    func getData(url: URL) throws -> String {
        let cacheKey = url.absoluteString as NSString;
        if let cachedVersion = blockerDataCache.object(forKey: cacheKey) {
            NSLog("AG: AdvancedBlocking: Return cached version");
            return cachedVersion as String;
        }

        var data = "";
        do {
            data = try getBlockerData(url: url);
            blockerDataCache.setObject(data as NSString, forKey: cacheKey);

            NSLog("AG: AdvancedBlocking: Return data");
        } catch {
            NSLog("AG: AdvancedBlocking: Error getting data: \(error)");
        }

        return data;
    }
}
