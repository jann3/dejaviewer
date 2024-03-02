const electronInstaller = require("electron-winstaller");

const packageJson = require("../package.json");

let resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: "./build/win",
    outputDirectory: "./dist/win",
    authors: "jann3",
    exe: "dejaviewer.exe",
    setupExe: "dejaviewer-" + packageJson.version + ".exe",
    noMsi: true
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));