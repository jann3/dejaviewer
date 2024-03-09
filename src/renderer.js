let acceptedFileExtensions = [];

deja.receive("response", (message) => {
    console.log(`response from main: ${message}`);

    if (message === "closeModal") {
        document.getElementById("help-button").click();
    }
});

deja.receive("displayMode", (mode) => {
    console.log(`response from main: ${mode}`);

    const fakeEvent = {
        target: {
            id: `${mode}-button`
        }
    };

    if (mode === "darkmode") {
        loadDisplayMode("darkmode");
        clearAndSetButton(fakeEvent);
    } else if (mode === "lightmode") {
        loadDisplayMode("lightmode");
        clearAndSetButton(fakeEvent);
    } else {
        //osdefault
    }
});

async function getVersion() {
    try {
        const message = await window.deja.get("versionNumber");
        console.log(`response to version: ${message}`);
        document.getElementById("versionFooter").innerHTML = `v.${message}`;
        document.getElementById("versionFooter").setAttribute("aria-label", `version ${message}`);
    } catch (error) {
        console.error(`error fetching version: ${error}`);
    }
}

const getFileExtensions = async () => {
    try {
        acceptedFileExtensions = await deja.getAcceptedFileExtensions();
    } catch (error) {
        console.error('Error getting accepted file extensions:', error);
    }
};

window.onload = function () {
    getFileExtensions();
    getVersion();
    addEventListeners();
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
            targetButton.value = dataAlt;
            targetButton.classList.remove("spinOut");
        }, 100);
    } else if (dataState === "true") {
        targetButton.dataset.state = "false";
        targetButton.setAttribute("aria-pressed", "false");
        targetButton.classList.add("spinOut");
        setTimeout(() => {
            // after animation reset the icon
            targetButton.value = dataInitial;
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
            syncButton.value = syncButton.dataset.initial;
        } else if (syncOverlay.classList.contains("fadeIn")) {
            syncButton.value = syncButton.dataset.alt;
        } else {
            // do nothing
        }
    }, 600);
}

function toggleModalStatusOnMain(target) {
    const targetOverlay = document.getElementById(target);

    setTimeout(() => {
        if (targetOverlay.classList.contains("fadeIn")) {
            deja.send("modalStatus", "open");
        } else {
            deja.send("modalStatus", "closed");
        }
    }, 300);
}

function toggleDisable(target) {
    const targetButton = document.getElementById(target);

    if (targetButton.disabled === true) {
        targetButton.disabled = false;
    } else {
        targetButton.disabled = true;
    }
}

function toggleAriaHidden(target) {
    const targetEl = document.getElementById(target);
    if (targetEl.ariaHidden == "false") {
        targetEl.setAttribute("aria-hidden", "true");
    } else {
        targetEl.setAttribute("aria-hidden", "false");
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
                extensions: acceptedFileExtensions,
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
    // handler to assign keys for non-button button
    if (event.key === "Enter" || event.key === " ") {
        document.getElementById(event.target.id).click();
    }
}

function loadDisplayMode(mode) {
    if (mode === "darkmode") {
        removeCSS("lightmode.css");
        loadCSS("darkmode.css");
    } else if (mode === "lightmode") {
        removeCSS("darkmode.css");
        loadCSS("lightmode.css");
    } else {
        removeCSS("lightmode.css");
        removeCSS("darkmode.css");
    }
}

async function setDisplayMode(mode) {
    console.log(`saving display mode: ${mode}`);
    try {
        await window.deja.saveDisplayMode(mode);
    } catch (error) {
        console.error(`error saving display mode: ${error}`);
    }
}

function removeCSS(url) {
    const link = document.querySelector(`link[href="${url}"]`);
    if (link) {
        link.parentNode.removeChild(link);
    }
}

function loadCSS(url) {
    // Create a link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    // Append the link element to the head of the document
    document.head.appendChild(link);
}

function clearAndSetButton(event) {
    const buttons = document.querySelectorAll(".button-group input");
    buttons.forEach(button => {

        if (button.id === event.target.id) {
            button.setAttribute("aria-selected", true);
        } else {
            button.removeAttribute("aria-selected");
        }
    });
}

function addEventListeners() {
    const browseButton = document.getElementById("browse-button");
    const helpButton = document.getElementById("help-button");

    const osdefaultButton = document.getElementById("osdefault-button");
    const darkmodeButton = document.getElementById("darkmode-button");
    const lightmodeButton = document.getElementById("lightmode-button");

    browseButton.addEventListener("click", openFile);
    helpButton.addEventListener("click", function () {
        toggleOverlay("help-overlay");
        toggleButton("help-button");
        toggleOverlaySync("help-overlay", "help-button");
        toggleDisable("browse-button");
        toggleModalStatusOnMain("help-overlay");
        toggleAriaHidden("main-intro");
    });

    osdefaultButton.addEventListener("click", function (event) {
        console.log(`clicked: ${event.target.id}`);
        loadDisplayMode("osdefault");
        setDisplayMode("osdefault");
        clearAndSetButton(event);
    });
    darkmodeButton.addEventListener("click", function (event) {
        console.log(`clicked: ${event.target.id}`);
        loadDisplayMode("darkmode");
        setDisplayMode("darkmode");
        clearAndSetButton(event);
    });
    lightmodeButton.addEventListener("click", function (event) {
        console.log(`clicked: ${event.target.id}`);
        loadDisplayMode("lightmode");
        setDisplayMode("lightmode");
        clearAndSetButton(event);
    });
}