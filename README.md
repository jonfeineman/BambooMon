BambooMon
=========

A Chrome extension to monitor Atlassian Bamboo build servers

Installation
------------
1. Open Chrome extensions: Chrome Menu > Tools > Extensions
2. Click "Load Unpacked Extension"
3. Select Extension folder in BambooMon git repo

Configuration
-------------
1. From Chrome extensions page, select "Options" under BambooMon
2. Enter the base address of your Bamboo server in the Server URI field (ie: https://build.yourcompany.org, omit trailing slashes)
3. Enter the name of the project you wish to monitor in the Project field (ie: TRUNK)

Usage
-----
1. Click the Bamboo icon on your extensions bar
2. Extension popup will display the current status of build plans in your selected project
   * Failed builds will show as desktop notifications

Notes
-----
* Please ensure that you are currently authenticated on your build server.

Planned Features
----------------
* Authentication timeout detection and link to log back in
* Easier project selection
* Background updates
* HTML Notification window
* API version support (currently just uses /api/latest/)
* Monitoring builds across multiple projects 
* Combined notifications for failed builds
* Build lifecycle monitoring
* Dependent build hierarchy
* Favorites list support
