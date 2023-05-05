function updateIndexFile() {
    SPIFFSdlg('/');
    id("SPIFFS_select_files").click();
}

window.addEventListener('load', () => {
    setTimeout(() => {
        id('rapidchangetablink').click();
    }, 2000);
});