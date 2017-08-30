const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const {dialog} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const filename = 'index.html'
const accepted_file_extensions = ['gif', 'jpeg', 'jpg', 'png', 'webp', 'ico', 'bmp', 'jfif', 'pjpeg', 'pjp', 'svg', 'svgz', 'tiff', 'tif', 'xbm']


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 300, height: 200, backgroundColor: '#333'})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, filename),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.on('will-navigate', (event, url) => {

    // Disabled navigation but pass to checkFile
    event.preventDefault()
    console.log('receiving url from navigate', url)
    checkFile(url)
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // Start watch
  fs.watch(filename, (eventType, filename) => {
    console.log(`event type is: ${eventType}`);
    if (filename) {
      console.log(`filename provided: ${filename}`);
      win.reload()
    } else {
      console.log('filename not provided');
    }
  })
}

function checkFile(url){
  // Extract file extension if dot
  let file_extension = url.split('.').pop().toLowerCase()
  
   // Filter acceptable extensions by the current file extension
  let isAcceptable = accepted_file_extensions.filter(ext => ext == file_extension)
  
  // Found acceptable file extension load it, else send error message
  if(isAcceptable.length){
    console.log(file_extension, 'accepted!')
    win.loadURL(url)
  } else {
    console.log(file_extension, 'unacceptable!')

    // Send error message to win/icp
    win.webContents.send('error', 'Image Files Only');

  }
}

// ipcMain receives filepath from index.html
ipcMain.on('filepath', (event, url) => {
  console.log('receiving url from ipc', url)
  checkFile(url)
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