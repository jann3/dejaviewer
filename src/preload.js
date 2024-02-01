const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deja", {
  openDialog: (method, config) => ipcRenderer.invoke("dialog", method, config),
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["filepath"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["response"];
    if (validChannels.includes(channel)) {
      // strip event 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});