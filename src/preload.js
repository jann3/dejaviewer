const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deja", {
  getAcceptedFileExtensions: async () => {
    try {
      // Invoke IPC to fetch acceptedFileExtensions from the main process
      return await ipcRenderer.invoke("getAcceptedFileExtensions");
    } catch (error) {
      console.error("Error getting accepted file extensions:", error);
      return [];
    }
  },
  openDialog: (method, config) => ipcRenderer.invoke("dialog", method, config),
  get: async (channel, data) => {
    let validChannels = ["versionNumber"];
    if (validChannels.includes(channel)) {
      try {
        const response = await ipcRenderer.invoke(channel, data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
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
    let validChannels = ["response", "displayMode"];
    if (validChannels.includes(channel)) {
      // strip event 
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  saveDisplayMode: async (mode) => {
    let validModes = ["osdefault", "darkmode", "lightmode"];
    if (validModes.includes(mode)) {
      try {
        const response = await ipcRenderer.invoke("saveDisplayMode", mode);
        return response.mode;
      } catch (error) {
        console.error("Error setting display mode:", error);
        throw error;
      }
    }
  }
});