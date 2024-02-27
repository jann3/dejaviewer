const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deja", {
  openDialog: (method, config) => ipcRenderer.invoke("dialog", method, config),
  get: async (channel, data) => {
    let validChannels = ["versionNumber"];
    if (validChannels.includes(channel)) {
      try {
        const response = await ipcRenderer.invoke(channel, data);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
  },
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["filepath", "log", "modalStatus"];
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