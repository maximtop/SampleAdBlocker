import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager

let appName = "SampleAdBlocker"
let extensionBundleIdentifier = "com.maximtop.SampleAdBlocker.Extension"

class ViewController: NSViewController {

    @IBOutlet var appNameLabel: NSTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.appNameLabel.stringValue = appName
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if (state.isEnabled) {
                    self.appNameLabel.stringValue = "\(appName)'s extension is currently on."
                } else {
                    self.appNameLabel.stringValue = "\(appName)'s extension is currently off. You can turn it on in Safari Extensions preferences."
                }
            }
        }
    }
    
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        }
    }

    @IBAction func reloadContentBlocker(_ sender: Any) {
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
    }
}
