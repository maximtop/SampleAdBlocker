import Cocoa
import SafariServices

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        RulesConverterService.applyConverter();

        // reload SampleAdBlocker extension
        NSLog("Start reloading the CONTENT BLOCKER")
        let start = DispatchTime.now()
        SFContentBlockerManager.reloadContentBlocker(withIdentifier: "com.maximtop.SampleAdBlocker.ContentBlocker", completionHandler: { (error) in
            if (error != nil) {
                NSLog("CONTENT BLOCKER error: \(String(describing: error))")
            }
            NSLog("Finished reloading the CONTENT BLOCKER")
            let end = DispatchTime.now()
            let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
            let timeInterval = Double(nanoTime) / 1_000_000_000
            NSLog("CONTENT BLOCKER reload time: \(timeInterval)")
        })

        SFContentBlockerManager.getStateOfContentBlocker(withIdentifier: "com.maximtop.SampleAdBlocker.ContentBlocker", completionHandler: { (state, error) in
            if let error = error {
                NSLog("CONTENT BLOCKER error: \(error)")
            }
            if let state = state {
                let contentBlockerIsEnabled = state.isEnabled
                NSLog("CONTENT BLOCKER state: \(contentBlockerIsEnabled ? "Enabled" : "Disabled")")
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
