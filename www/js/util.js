const id = name => document.getElementById(name);

const classes = name => Array.from(document.getElementsByClassName(name));

const setValue = (name, val) => id(name).value = val;

const getValue = name => id(name).value;

const intValue = name => parseInt(getValue(name));

const getTextContent = name => id(name).textContent;

const setTextContent = (name, val) => id(name).textContent = val;

const setHTML = (name, val) => id(name).innerHTML = val;

const setText = (name, val) => id(name).innerText = val;

const getText = name => id(name).innerText;

const setDisplay = (name, val) => id(name).style.display = val;

const displayNone = name => setDisplay(name, 'none');

const displayBlock = name => setDisplay(name, 'block');

const displayFlex = name => setDisplay(name, 'flex');

const displayTable = name => setDisplay(name, 'table-row');

const displayInline = name => setDisplay(name, 'inline');

const displayInitial = name => setDisplay(name, 'initial');

const displayUndoNone = name => setDisplay(name, '');

const setVisible = name => id('SPIFFS_loader').style.visibility = 'visible';

const setHidden = name => id('SPIFFS_loader').style.visibility = 'hidden';

const setDisabled = (name, value) => id(name).disabled = value;

const selectDisabled = (selector, value) => document.querySelectorAll(selector).forEach(element => element.disabled = value);

const click = name => id(name).click();

const files = name => id(name).files;

const setChecked = (name, val) => id(name).checked = val;

const getChecked = name => id(name).checked;
