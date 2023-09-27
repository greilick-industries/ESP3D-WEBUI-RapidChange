function downloadConfigFile() {
    const file = createFile();
    const link = document.createElement('a');
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function createFile() {
    return new File([getFileText()], 'RapidChangeConfig.txt', { type: 'text/plain' });
}

function getFileText() {
    let fileText = 'RapidChange:\n';
    if (rcSettings.length != 0) {
        rcSettings.forEach(s => {
            let name = '  ' + s.label.substring(rcPrefixLength) + ': ';
            let value = getSettingValue(s) + '\n';
            fileText += name + value;
        });
        const dustCoverPinValue = id('dust_cover_pin').value;
        const infraredPinValue = id('infrared_pin').value;
        const dustCoverPin = dustCoverPinValue == '' ? 'NO_PIN' : 'GPIO.' + dustCoverPinValue;
        const infraredPin = infraredPinValue == '' ? 'NO_PIN' : 'GPIO.' + infraredPinValue;
        fileText += '  dust_cover_pin: ' + dustCoverPin + '\n';
        fileText += '  infrared_pin: ' + infraredPin;  
    }
    return fileText;
}

function getSettingValue(setting) {
    let input = setting.clonedEl.querySelector('#setting_' + setting.index + '_0');
    if (input.tagName === 'SELECT') {
        return input.options[input.selectedIndex].text;
    } else {
        return input.value;
    }
}