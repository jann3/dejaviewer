let modalOpen = false;
let changeEvent = false;

// modalOpen

function setModalOpen(value) {
    modalOpen = value;
}

function isModalOpen() {
    return modalOpen;
}

// changeEvent

function setChangeEvent(value) {
    changeEvent = value;
}

function isChangeEvent() {
    return changeEvent;
}

// all exports

module.exports = {
    setModalOpen,
    isModalOpen,
    setChangeEvent,
    isChangeEvent
};