# Time to deliver selectors and scripts to content script (tested on Safari)

Because we are forced to use a non-persistent background page, we had to decide where we should keep the content blocker service. There are several possible ways:

1. Get rules from background page, init blocker with lookup tables from storage
2. Get rules from the content script, init blocker with lookup tables from storage
3. Get rules from the native host (even though request handler is initiated on every request, content blocker service seems to live in the memory of the native host app)

## Table with results
Tests where run on the collection of 17 AdGuard filters, resulted in the 7.6MB JSON file of advanced rules (scriptlets, scripts, and extended css)

| Test | Background page unloaded, ms | Background page loaded, ms | Native app process killed | 
| --- | --- | --- | --- |
| Init blocker from content script storage | 1150 - 1250 | same (blocker initiates from storage on every page load) |
| Init blocker from background page storage | 1200 - 1400 | 40 - 45 |
| Get rules from native host app (blocker initated inside native host app) | 125 - 150 | 40 - 45 | 3500 - 3700 | 