# SampleAdBlocker

## Development
Be sure you have installed make utility
### Setup

To setup project run:
`make setup`

### Build
To build run:
`make build`

### Lint
To lint run:
`make lint`

## What I have learned building simple content blocker with dynamic rules list and web extension for macOS

- To log url with NSLog better use `.path` method instead of `.absoluteString` or `.absoluteURL`, otherwise log won't print the whole path after space

- In order to launch debugger for content blocker do not forget to checkbox Debugging Tool (https://uploads.adguard.com/Image_2021-06-16_12-55-47.png)

- Do not forget to add correct app group (https://uploads.adguard.com/Image_2021-06-16_12-57-27.png), otherwise extension won't be able to load content blocker (`/Users/<username>/Library/Group Containers/group.SampleAdBlocker/customBlockerList.json`)

- To debug content blocker you can attach to the process name or pid (https://uploads.adguard.com/Image_2021-06-16_12-59-10.png) with the name of the content blocker (https://uploads.adguard.com/Image_2021-06-16_13-00-02.png)

- Log messages from content blocker you can see in the Console.app if you call NSLog("debug message") in the content blocker code (https://uploads.adguard.com/Image_2021-06-16_13-03-28.png)

- Check that you have allowed unsigned extensions, if your extension is not signed (https://uploads.adguard.com/Image_2021-06-16_14-01-16.png)

