import Cocoa
import SafariServices

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        RulesConverterService.applyConverter();

        // reload SampleAdBlocker extension
        NSLog("Start reloading of the content blocker")
        SFContentBlockerManager.reloadContentBlocker(withIdentifier: "com.maximtop.SampleAdBlocker.ContentBlocker", completionHandler: { _ in
            NSLog("Finished reloading the content blocker")
        })

        SFContentBlockerManager.getStateOfContentBlocker(withIdentifier: "com.maximtop.SampleAdBlocker.ContentBlocker", completionHandler: { (state, error) in
            if let error = error {
                NSLog("Content blocker error: \(error)")
            }
            if let state = state {
                let contentBlockerIsEnabled = state.isEnabled
                NSLog("Content blocker state: \(contentBlockerIsEnabled ? "Enabled" : "Disabled")")
            }
        })
    }

    func applicationWillTerminate(_ notification: Notification) {
        // Insert code here to tear down your application
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

}
