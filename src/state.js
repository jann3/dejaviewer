let modalOpen = false;

function setModalOpen(value) {
    modalOpen = value;
}

function isModalOpen() {
    return modalOpen;
}

module.exports = {
    setModalOpen,
    isModalOpen
};