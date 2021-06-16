# SampleAdBlocker
## What I have learned building simple content blocker with dynamic rules list and web extension for macOS

- To log url with NSLog better use `.path` method instead of `.absoluteString` or `.absoluteURL`, otherwise log won't print the whole path if it meet the space in the pathname

- In order to launch debugger for content blocker do not forget to check the Debugging Tool checkbox ![image](https://user-images.githubusercontent.com/17272769/122210277-1e205980-ceae-11eb-8fe8-b318bda818e7.png)

- Do not forget to add correct app group,otherwise content blocker won't be able to load rules (`/Users/<username>/Library/Group Containers/group.SampleAdBlocker/customBlockerList.json`)
![image](https://user-images.githubusercontent.com/17272769/122210349-37290a80-ceae-11eb-955a-a5c695ae583b.png)

- To debug content blocker you can attach to the process name or pid ![image](https://user-images.githubusercontent.com/17272769/122210406-47d98080-ceae-11eb-9b6e-7ff0467f947c.png) with the name of the content blocker ![image](https://user-images.githubusercontent.com/17272769/122210432-5031bb80-ceae-11eb-9b79-51b1be6a16bf.png)

- Log messages from content blocker you can see in the Console.app if you call NSLog("debug message") in the content blocker code ![image](https://user-images.githubusercontent.com/17272769/122210484-5e7fd780-ceae-11eb-867f-9822347aeaa7.png)

- Check that you have allowed unsigned extensions, if your extension is not signed ![image](https://user-images.githubusercontent.com/17272769/122210526-693a6c80-ceae-11eb-95c9-f61e51456c51.png)
