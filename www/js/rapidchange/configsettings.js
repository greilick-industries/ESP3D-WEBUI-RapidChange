var configSettingsList = [];
var configListRoot;
var configListLoaded = false;
const rcPrefixLength = 13;

window.addEventListener('load', () => {
    id('rapidchangetablink').addEventListener('click', loadConfigSettings);
    id('settingtablink').addEventListener('click', unloadConfigSettings);
});

function openSettingsTree() {
    id('tree_setting_filter').click();
}

function closeSettingsTree() {
    id('nvs_setting_filter').click();
}

function getConfigListRoot() {
    configListRoot = id('rapidchangeconfiglist');
}

function fetchConfigSettings() {
    configSettingsList = scl
        .filter(s => s.label.startsWith('/RapidChange'));
}

function createCloneElements() {
    configSettingsList.forEach(s => {
        s.clonedEl = id('status_setting_' + s.index + '_0');
        modifyClonedElement(s.clonedEl);
    });
}

function createLabelElements() {
    configSettingsList.forEach(s => {
        let labelEl = document.createElement('span');
        labelEl.className = 'config-label';
        let labelText = s.label
            .substring(rcPrefixLength);        
        labelEl.innerText = labelText;
        s.labelEl = labelEl;
    });
}

function createListItemElements() {
    configSettingsList.forEach(s => {
        let listItemEl = document.createElement('li');         
        listItemEl.className = 'config-list-item';
        listItemEl.append(s.labelEl, s.clonedEl);
        s.listItemEl = listItemEl;
    });
}

function modifyClonedElement(clone) {
    if (clone) {
        clone.style.margin = '0';
        clone.style.justifySelf = 'end';
        clone.style.width = '100%';
        let wrapper = clone.querySelector('.item-flex-row');
        wrapper.style.justifyContent = 'stretch';
        wrapper.querySelector('table').style.width = '100%';
        let selectElement = wrapper.querySelector('select');
        if (selectElement) {
            selectElement.parentElement.style.width = '100%';
            selectElement.classList.remove('wauto');
            selectElement.style.width = '100%';
        }
    }
}

function appendListItemElements() {
    configSettingsList.forEach(s => {
        configListRoot.append(s.listItemEl);
    });
}

function loadConfigSettings() {
    if (!configListLoaded) {
        openSettingsTree();
        fetchConfigSettings();
        createLabelElements();
        createCloneElements();
        createListItemElements();
        closeSettingsTree();
        getConfigListRoot();
        appendListItemElements();
        configListLoaded = true;
    }
}

function unloadConfigSettings() {
    if (configListLoaded) {
        configListRoot.innerHTML = '';
        configSettingsList = [];
        configListLoaded = false;
    }
}