const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const {dialog} = require('electron')
const sizeOf = require('image-size')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, globalfilename

const mainpage = 'index.html'
const accepted_file_extensions = ['gif', 'jpeg', 'jpg', 'png', 'webp', 'ico', 'bmp', 'jfif', 'pjpeg', 'pjp', 'svg', 'svgz', 'tiff', 'tif', 'xbm']


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 300, height: 200, backgroundColor: '#333', show: false})

  // Hide loading flash
  win.once('ready-to-show', () => {
    win.show()
  })

  if(!globalfilename){
    globalfilename = mainpage
  }
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, globalfilename),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.on('will-navigate', (event, navurl) => {

    // Disabled navigation but pass to checkFile
    event.preventDefault()
    newnavurl = fixPath(navurl)
    console.log(`fixed url from navigate: ${newnavurl}`)
    checkFile(navurl)
  })

  win.webContents.on('did-finish-load', (event, isMainFrame) => {

    //console.log(event)

    console.log('loaded')
    // If fullscreen or maximized dont adjust, 
    // Else adjust based on filesize
    if (win.isFullScreen() || win.isMaximized()){
      console.log('fullscreen')
    } else {
      console.log('not fullscreen')
      console.log(win.getSize())
      console.log(win.getContentSize())
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

function checkFile(url){
  // Extract file extension if dot
  let file_extension = url.split('.').pop().toLowerCase()
  
   // Filter acceptable extensions by the current file extension
  let isAcceptable = accepted_file_extensions.filter(ext => ext === file_extension)
  
  // Found acceptable file extension load it, else send error message
  if(isAcceptable.length){
    console.log(`accepted: ${file_extension}`)
    url = fixPath(url)

    globalfilename = url

    let dimensions = sizeOf(url);
    console.log(`image width: ${dimensions.width}, height: ${dimensions.height}`);

    console.log(`globalfilename: ${globalfilename}`)
    win.loadURL(url)

    // Start watch
    let watcher = fs.watch(globalfilename, (eventType, filename) => {

      console.log(`event type is: ${eventType}`);
      if (globalfilename === url) {
        console.log(`modified file is global: ${filename}`);
        win.reload()
      } else {
        console.log(`closing watcher: ${filename}`);
        watcher.close()
      }
    }) // End watch
    
  } else {
    console.log(`unacceptable: ${file_extension}`)

    // Send error message to win/icp
    win.webContents.send('error', 'Image Files Only');
  }
}

// ipcMain receives filepath from index.html
ipcMain.on('filepath', (event, ipcurl) => {
  console.log(`receiving url from ipc: ${ipcurl}`)
  checkFile(ipcurl)
})

// send fileerror message back to index.html
ipcMain.on('error', (event, message) => {
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.