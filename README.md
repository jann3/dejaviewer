# DejaViewer

A replacement photo/image viewer application build on Chromium using [Electron](https://electron.atom.io/).

## Current Features

* Single image viewer
* Automatic reloading of modified files
* Open images via dialog window, explorer, drag & drop

## How to run this project

This project requires [Electron](https://electron.atom.io/) to be installed.

```
npm install -g electron 
```

Then [download DejaViewer](https://github.com/Jann3/DejaViewer/archive/master.zip) or clone the project, then extract and run the following npm commands:

```
cd DejaViewer
npm install
electron .
```

You can then drag an image onto the main window to open it.

## Future work

* Handle multiple files
* Build production (.exe) for win32
* Navigate to other images
* (considering) Adding version control and saving/exporting files


### Why did you make this?

Simply I wanted a replacement photo viewer that would reload if I modified the file, the old windows viewer did this automatically but subsequent versions did not. I found this a problem when making glitchart - where I need to reload the image many times.
