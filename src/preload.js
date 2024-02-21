const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deja", {
  openDialog: (method, config) => ipcRenderer.invoke("dialog", method, config),
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["filepath", "getVersion", "log", "modalStatus"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["response", "versionNumber"];
    if (validChannels.includes(channel)) {
      // strip event 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});