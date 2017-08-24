const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const {dialog} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const filename = 'index.html'
const accepted_file_extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tif', 'tiff', 'svg', 'svgz', 'pdf', 'bmp', 'dib']

console.log(dialog)

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 300, height: 200})

  win.webContents.on('will-navigate', (event, url) => {

    // Extract file extension if dot
    let file_extension = url.split('.').pop().toLowerCase()

    // Filter acceptable extensions by the current file extension
    let isAcceptable = accepted_file_extensions.filter(ext => ext == file_extension)

    // Found acceptable file extension else prevent navigate
    if(isAcceptable.length){
      console.log(file_extension, 'accepted!')
    } else {
      console.log(file_extension, 'unacceptable!')
      event.preventDefault()
    }
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, filename),
    protocol: 'file:',
    slashes: true
  }))

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

// ipcMain receives messages from other windows
ipcMain.on('message', (event, arg) => {
  console.log('receiving')
  console.log(arg)  // prints "ping"
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