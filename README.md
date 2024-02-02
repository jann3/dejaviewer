# DejaViewer

An image viewer primarily as a single purpose replacement for the detault Windows 'Photos' app - which doesn't hot load images anymore. Built using [Electron](https://electron.atom.io/).

## Current Features

* Single image viewer
* Automatic 'hot' reloading when modifying image files
* UI interface
* Open images via dialog window or drag & drop

## How to donwload and run this project manually

Currently this project requires [Node](https://nodejs.org/en/download/) and [Electron](https://electron.atom.io/) to be installed, once Node has been installed run the following npm command to install Electron:

```
npm install -g electron 
```

Then [download DejaViewer](https://github.com/Jann3/DejaViewer/archive/master.zip) or clone the project, then extract and run the following npm commands:

```
cd DejaViewer
npm install
npm start
```

You can then drag an image onto the main window to open it.

### Why not provide an executable (.exe) or simple installer?
As this is a personal project I felt it wasn't necessary. However, I may add an installer in the near future as other people may find this useful.

## Future work

* Build production (.exe) for Windows
* Navigate to other images
* (considering) Adding version control and saving/exporting files

### Why did you make this?

Simply, I needed a replacement image viewer for Windows that would reload files while I made changes to them to make [glitchart](https://g.litch.art/).