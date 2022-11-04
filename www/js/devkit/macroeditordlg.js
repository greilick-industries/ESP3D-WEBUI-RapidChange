const formRoot = id('macroformroot');

Components.defineComponents();

function showMacroEditor(macroName, closefn) {
    var modal = setactiveModal('macroeditordlg.html', closefn);
    if (modal == null) return;

    let form = Components.MacroFormComponentFactory.form();
    formRoot.append(form);

    showModal();
}

function openMacroEditor(macroName) {
    showMacroEditor(macroName, closeMacroEditor);
}

function closeMacroEditor(answer) {
    let formNode = document.getElementsByTagName('macro-form')[0];
    if (formNode) {
        formNode.parentNode.removeChild(formNode);
    }
    closeModal(answer);
}

async function fetchMacros() {
    const apiURL = 'https://script.google.com/macros/s/AKfycby-uxMCf8hJccNvpthXZCvZsge7ZjTG49PdazdHXJ6dUWosiksP3JHQ4lrbaoFVW5zmLg/exec';
    let url = apiURL + '/macros';
    const macros = await fetch(url)
        .then((response) => response.json());
    console.log(macros);
}

