deja.receive("response", (message) => {
    console.log(`response from main: ${message}`);
});

deja.receive("versionNumber", (message) => {
    console.log(`version: ${message}`);
    document.getElementById("versionFooter").innerHTML = `v.${message}`;
});

window.onload = function () {
    window.deja.send("getVersion");
    addEventListeners()
}

document.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (let file of event.dataTransfer.files) {
        console.log("sending from drag/drop", file.path);
        window.deja.send("filepath", file.path)
    }
    // drop indicator
    document.getElementById("drag-overlay").classList.add("dragleave");
    document.getElementById("drag-overlay").classList.remove("dragover");

    // remove no pointer class for elements
    document.getElementById("browse-button").classList.remove("no-pointer");
    document.getElementById("help-button").classList.remove("no-pointer");
});

document.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();

    // dragover indicator
    document.getElementById("drag-overlay").classList.add("dragover");
    document.getElementById("drag-overlay").classList.remove("dragleave");

    // add no pointer class for elements
    document.getElementById("browse-button").classList.add("no-pointer");
    document.getElementById("help-button").classList.add("no-pointer");
});

document.addEventListener("dragleave", (event) => {
    event.preventDefault();
    event.stopPropagation();

    // dragover indicator
    document.getElementById("drag-overlay").classList.add("dragleave");
    document.getElementById("drag-overlay").classList.remove("dragover");

    // remove no pointer class for elements
    document.getElementById("browse-button").classList.remove("no-pointer");
    document.getElementById("help-button").classList.remove("no-pointer");
});

function toggleOverlay(target, targetButton) {
    const targetOverlay = document.getElementById(target);

    if (targetOverlay.classList.contains("fadeIn")) {
        targetOverlay.classList.add("fadeOut");
        targetOverlay.classList.remove("fadeIn");
        setTimeout(() => {
            targetOverlay.style.display = "none";
        }, 280);
    } else if (targetOverlay.classList.contains("fadeOut")) {
        targetOverlay.classList.add("fadeIn");
        targetOverlay.classList.remove("fadeOut");
        targetOverlay.style.display = "block";
    } else {
        // do nothing
    }
    // also toggle button
    toggleButton(target, targetButton);
}

function toggleButton(targetOverlay, target) {
    const targetButton = document.getElementById(target);
    const dataState = targetButton.dataset.state;
    const dataInitial = targetButton.dataset.initial;
    const dataAlt = targetButton.dataset.alt;

    if (dataState === "false") {
        targetButton.dataset.state = "true";
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            targetButton.innerText = dataAlt;
            targetButton.classList.remove("spinOut");
        }, 100);
    } else if (dataState === "true") {
        targetButton.dataset.state = "false";
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            targetButton.innerText = dataInitial;
            targetButton.classList.remove("spinOut");
        }, 100);
    } else {
        // do nothing
    }
    toggleOverlaySync(targetOverlay, target);
}

function toggleOverlaySync(targetOverlay, targetButton) {
    const syncOverlay = document.getElementById(targetOverlay);
    const syncButton = document.getElementById(targetButton);

    setTimeout(() => {
        if (syncOverlay.classList.contains("fadeOut")) {
            syncButton.innerText = syncButton.dataset.initial;
        } else if (syncOverlay.classList.contains("fadeIn")) {
            syncButton.innerText = syncButton.dataset.alt;
        } else {
            // do nothing
        }
    }, 500);
}

function openFile() {
    const dialogConfig = {
        title: 'Select a file',
        buttonLabel: 'Open',
        properties: ['openFile'],
        filters: [
            {
                name: "All Image Files",
                extensions: [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                    "ico",
                    "bmp",
                    "jfif",
                    "pjpeg",
                    "pjp",
                    "svg",
                    "svgz",
                    "tiff",
                    "tif",
                    "webp",
                    "avif",
                    "xbm",
                ],
            },
            { name: "JPEG", extensions: ["jpg", "jpeg"] },
            { name: "PNG", extensions: ["png"] },
            { name: "GIF", extensions: ["gif"] },
            { name: "BMP", extensions: ["bmp"] },
            { name: "TIFF", extensions: ["tif", "tiff"] },
            { name: "WebP", extensions: ["webp"] },
            { name: "AVIF", extensions: ["avif"] },],
    };
    deja.openDialog("showOpenDialog", dialogConfig);
}

function handleKeypPress(event) {
    if (event.key === "Enter" || event.key === " ") {
        document.getElementById("help-button").click();
    }
}

function addEventListeners() {
    const browseButton = document.getElementById("browse-button");
    const helpButton = document.getElementById("help-button");

    browseButton.addEventListener("click", openFile);
    helpButton.addEventListener("click", function () {
        toggleOverlay("help-overlay", "help-button")
    });
    helpButton.addEventListener("keyup", handleKeypPress);
}