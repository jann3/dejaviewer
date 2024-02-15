deja.receive("response", (message) => {
    console.log(`response from main: ${message}`);
});

deja.receive("versionNumber", (message) => {
    console.log(`version: ${message}`);
    document.getElementById("versionFooter").innerHTML = `v.${message}`;
});

function getVersion() {
    window.deja.send("getVersion");
}

document.addEventListener("drop", function (event) {
    event.preventDefault();
    event.stopPropagation();

    for (let file of event.dataTransfer.files) {
        console.log("sending from drag/drop", file.path);
        window.deja.send("filepath", file.path)
    }
    // drop indicator
    document.getElementById("drag-overlay").style.display = "none";
});

document.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // dragover indicator
    document.getElementById("drag-overlay").style.display = "block";
});

document.addEventListener("dragleave", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // dragover indicator
    document.getElementById("drag-overlay").style.display = "none";
});

function toggleOverlay(target) {
    let targetOverlay = document.getElementById(target);

    if (targetOverlay.classList.contains("fadeIn")) {
        targetOverlay.classList.toggle("fadeIn");
        targetOverlay.classList.add("fadeOut");
        setTimeout(() => {
            targetOverlay.style.display = "none";
        }, 280);
    } else if (targetOverlay.classList.contains("fadeOut")) {
        targetOverlay.classList.toggle("fadeOut");
        targetOverlay.classList.add("fadeIn");
        targetOverlay.style.display = "block";
    } else {
        // do nothing
    }
}

function toggleButton(target) {
    let targetButton = document.getElementById(target);

    if (targetButton.textContent === '?') {
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            targetButton.textContent = '✖';
            targetButton.classList.toggle("spinOut");
        }, 100);
    } else {
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            targetButton.textContent = '?';
            targetButton.classList.toggle("spinOut");
        }, 100);
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