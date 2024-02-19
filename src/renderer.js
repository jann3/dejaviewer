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

function toggleOverlay(target) {
    const targetOverlay = document.getElementById(target);

    if (targetOverlay.classList.contains("fadeIn")) {
        // add fadeOut, remove fadeIn and add aria-hidden
        targetOverlay.classList.add("fadeOut");
        targetOverlay.classList.remove("fadeIn");
        targetOverlay.setAttribute("aria-hidden", "true");
        setTimeout(() => {
            // hide overlay after animation
            targetOverlay.style.display = "none";
        }, 280);
    } else if (targetOverlay.classList.contains("fadeOut")) {
        // add fadeIn, remove fadeOut, set aria-hidden to false and show overlay
        targetOverlay.classList.add("fadeIn");
        targetOverlay.classList.remove("fadeOut");
        targetOverlay.style.display = "block";
        targetOverlay.setAttribute("aria-hidden", "false");
    } else {
        // do nothing
    }
}

function toggleButton(target) {
    const targetButton = document.getElementById(target);
    const dataState = targetButton.dataset.state;
    const dataInitial = targetButton.dataset.initial;
    const dataAlt = targetButton.dataset.alt;

    if (dataState === "false") {
        // set button state to on and aria pressed, spinOut animation 
        targetButton.dataset.state = "true";
        targetButton.setAttribute("aria-pressed", "true");
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            // after animation switch icon
            targetButton.innerText = dataAlt;
            targetButton.classList.remove("spinOut");
        }, 100);
    } else if (dataState === "true") {
        targetButton.dataset.state = "false";
        targetButton.setAttribute("aria-pressed", "false");
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            // after animation reset the icon
            targetButton.innerText = dataInitial;
            targetButton.classList.remove("spinOut");
        }, 100);
    } else {
        // do nothing
    }
}

function toggleOverlaySync(targetOverlay, targetButton) {
    const syncOverlay = document.getElementById(targetOverlay);
    const syncButton = document.getElementById(targetButton);

    setTimeout(() => {
        // sync states after animations
        if (syncOverlay.classList.contains("fadeOut")) {
            syncButton.innerText = syncButton.dataset.initial;
        } else if (syncOverlay.classList.contains("fadeIn")) {
            syncButton.innerText = syncButton.dataset.alt;
        } else {
            // do nothing
        }
    }, 600);
}

function toggleDisable(target) {
    const targetButton = document.getElementById(target);

    if (targetButton.disabled === true) {
        targetButton.disabled = false;
    } else {
        targetButton.disabled = true;
    }
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
        toggleOverlay("help-overlay");
        toggleButton("help-button");
        toggleOverlaySync("help-overlay", "help-button");
        toggleDisable("browse-button");
    });
    helpButton.addEventListener("keyup", handleKeypPress);
}