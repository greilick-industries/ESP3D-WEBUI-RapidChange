function updateIndexFile() {
    SPIFFSdlg('/');
    id("SPIFFS_select_files").click();
}

window.addEventListener('load', () => {
    setTimeout(() => {
        id('devtablink').click();
    }, 1000);
});