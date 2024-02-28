# DejaViewer

An image viewer built primarily as a single purpose replacement for the default Windows 'Photos' app - which doesn't hot reload files anymore. Built using [Electron](https://electron.atom.io/).

## Current Features

* Image viewer for previewing glitchart based on Chrome
* Hot reload - when modifying an image the viewer will refresh whenever the file is saved
* Accessible user interface, images can also be drag and dropped

## How to donwload and run this project manually

Currently this project requires [Node](https://nodejs.org/en/download/) to be installed, run the following npm command to install Electron globally:

```
npm install -g electron 
```

Then [download dejaviewer](https://github.com/jann3/dejaviewer/archive/master.zip), then extract and run the following npm commands:

```
cd dejaviewer
npm install
npm start
```

You can then drag an image onto the main window to open it. Pressing the Escape key will return to main menu and at the main menu pressing Escape will quit the app.

### Why not provide an executable (.exe) or simple installer?
As this is a personal project I felt it wasn't necessary. However, I may add an installer in the near future as other people may find this useful.

## Future work

* Build production (.exe) for Windows
* Autoupdater
* Navigate to other images
* (considering) Adding version control and saving/exporting files

### Why did you make this?

Simply, I needed a replacement image viewer on Windows for making [glitchart](https://g.litch.art/).