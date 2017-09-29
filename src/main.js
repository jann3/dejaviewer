"use strict"

const electron = require('electron')
const {app, BrowserWindow, dialog, ipcMain} = electron
const path = require('path')
const url = require('url')
const fs = require('fs')
const promisify = require('util.promisify')
const sizeOf = promisify(require('image-size'))
const exec = promisify(require('child_process').exec)
const {addBypassChecker} = require('electron-compile')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, globalfilename

const mainpage = 'index.html'
const accepted_file_extensions = ['gif', 'jpeg', 'jpg', 'png', 'webp', 'ico', 'bmp', 'jfif', 'pjpeg', 'pjp', 'svg', 'svgz', 'tiff', 'tif', 'xbm']

addBypassChecker((filePath) => {
  // Bypass authenticity on local files to allow open with CLI
  return filePath.indexOf(app.getAppPath()) === -1
})

function createWindow () {

  // Git status - temporary exec
  exec('git status')
  .then((stdout, stderr) => {
    if(stdout) console.log('stdout: ', stdout)
    if(stderr) console.log('stderr: ', stderr)
  })
  .catch(err => console.error(err))

  // Check CLI params
  if (process.defaultApp && process.argv.length >= 3){
    // Opened app as param from default with additional params
    // Set file to open as last param
    globalfilename = process.argv[process.argv.length-1]
  } else if (!process.defaultApp && process.platform == 'win32' && process.argv.length >= 2) {
    // Opened app as build with params
    // Set file to open as last param
    globalfilename = process.argv[process.argv.length-1]
  } else {
    // Not a thing
  }

  let dir = ''
  if(!globalfilename || !isAcceptableExt(globalfilename)){
    // If no global or unacceptable file set it to the default page
    globalfilename = mainpage
    dir = __dirname
  }

  // Create the browser window.
  win = new BrowserWindow({width: 300, height: 200, backgroundColor: '#333', show: false })

  // Hide loading flash
  win.once('ready-to-show', () => {
    win.show()
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(dir, globalfilename),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.on('will-navigate', (event, navurl) => {

    // Disabled navigation but pass to checkFile
    event.preventDefault()
    let newnavurl = fixPath(navurl)
    console.log(`fixed url from navigate: ${newnavurl}`)
    checkFile(navurl)
  })

  win.webContents.on('did-finish-load', (event, isMainFrame) => {

    console.log('loaded')
    
    if (win.isFullScreen() || win.isMaximized() || globalfilename == mainpage){
      // If fullscreen, maximized or mainpage dont adjust size
      console.log('no size adjust')
    } else {
      // Else adjust based on filesize
      console.log('adjusted size')

      // Get current size, currently unused
      let current = {}
      current.width = win.getContentSize()[0] // Current window width
      current.height =  win.getContentSize()[1] // Current window height

      // Get display dimensions
      let display = {}
      display = electron.screen.getPrimaryDisplay().workAreaSize // primary display workArea (returns width and height)
      display.aspectRatio = display.width / display.height // User width and height to calc aspectRatio

      console.log(  `available workArea
                                width: ${display.width}, 
                                height: ${display.height}, 
                                aspectRatio: ${display.aspectRatio}`)

      // Set size based on file dimensions
      sizeOf(globalfilename)
      .then(dimensions => {
          dimensions.aspectRatio = dimensions.width / dimensions.height
          console.log(  `file dimensions
                                width: ${dimensions.width},
                                height: ${dimensions.height},
                                aspectRatio: ${dimensions.aspectRatio}`)
          
          if (display.width >= dimensions.width && display.height >= dimensions.height){
            // File fits on screen area so set dimensions accordingly
            console.log('file fits available work space')

            win.setContentSize(dimensions.width, dimensions.height)
          } else if (display.aspectRatio > dimensions.aspectRatio){
            // File exceeds dimensions with wider screen
            console.log('file exceeds workspace, with wider screen')
            
            let widthByRatio = Math.round(display.height * dimensions.aspectRatio)
            win.setContentSize(widthByRatio, display.height)
          } else {
            // File exceeds dimensions with taller screen
            console.log('file exceeds workspace, with taller screen')

            let heightByRatio = Math.round(display.width / dimensions.aspectRatio)
            win.setContentSize(display.width, heightByRatio)
          }
      })
      .catch(err => console.error(err))
    }
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

function fixPath(url){

  // Normalize path. Forward slashes become backslashes
  url = path.normalize(url)
  // Strip file from path
  if(url.startsWith('file:')){
    url = url.substring(6)
  }
  // Returned decoded URI. For example %20 becomes whitespace
  return decodeURI(url)
}

function isAcceptableExt(filename){

  // No filename, return false
  if (filename === undefined) return false
  
  // Extract file extension if dot
  let file_extension = filename.split('.').pop().toLowerCase()
  
   // Filter acceptable extensions by the current file extension
  let isAcceptable = accepted_file_extensions.filter(ext => ext === file_extension)
  
  // Return false if unacceptable, true if acceptable
  if(!isAcceptable.length){
    console.log(`unacceptable: ${file_extension}`)
    return false
  } else {
    console.log(`accepted: ${file_extension}`)
    return true
  }
}

function checkFile(url){

  // No file url, return false
  if (url === undefined) return false

  if(!isAcceptableExt(url)) {

    // If unacceptable send error to client
    win.webContents.send('error', 'Image Files Only');
  } else {

    // Found acceptable file extension, fix the path
    url = fixPath(url)

    // Set url to global
    globalfilename = url
    console.log(`globalfilename: ${globalfilename}`)

    // Load url
    win.loadURL(globalfilename)

    // Start watch
    let watcher = fs.watch(globalfilename, (eventType, filename) => {

      if (globalfilename === url) {
        // If modified file is global reload
        console.log(`modified file is global: ${filename}`);
        win.reload()
      } else {
        // Else close the watcher
        console.log(`closing watcher: ${filename}`);
        watcher.close()
      }
    }) // End watch
  } // End acceptable
}

ipcMain.on('filepath', (event, ipcurl) => {
  // ipcMain receives filepath from index.html
  console.log(`receiving url from ipc: ${ipcurl}`)
  checkFile(ipcurl)
})

ipcMain.on('error', (event, message) => {
  // passes error message back to index.html
  console.log(message)
  event.sender.send('error', message)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})