const electronInstaller = require("electron-winstaller");

const packageJson = require("../package.json");

let resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: "./build/win",
    outputDirectory: "./dist/win",
    authors: "Jann3",
    exe: "DejaViewer.exe",
    setupExe: "DejaViewer-" + packageJson.version + ".exe",
    setupMsi: "DejaViewer-" + packageJson.version + ".msi",
    noMsi: false
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));