var rcSettings = [];
var pocketsRoot;
var referencesRoot;
var speedsRoot;
var optionsRoot;
var toolSetRefRoot;
var touchOffRoot;
var toolRecognitionRoot;
var dustCoverRoot;
var configSettingsLoaded = false;
const rcPrefix = '/RapidChange/'
const rcPrefixLength = 13;
const pocketsLabels = [ 
    'alignment',
    'direction',
    'number_of_pockets', 
    'pocket_offset',
];
const referencesLabels = [
    'x_pocket_1',
    'y_pocket_1',
    'z_engage',
    'z_traverse',
    'z_safe_clearance',
];
const speedLabels = [ 
    'engage_feed_rate', 
    'load_rpm', 
    'unload_rpm' 
];
const optionsLabels = [ 
    'tool_recognition_enabled',
    'tool_setter_enabled',
    'dust_cover_enabled'
];
const toolSetterRefLabels = [
    'x_tool_setter', 
    'y_tool_setter', 
    'z_seek_start', 
    'z_safe_tool_setter', 
];
const touchOffLabels = [ 
    'set_tool_offset',
    'seek_feed_rate',
    'seek_retreat',
    'set_feed_rate',
    'set_tool_max_travel', 
];
const toolRecognitionLabels = [ 
    'z_tool_recognition_zone_1',
    'z_tool_recognition_zone_2',
];

const dustCoverSettingsLabels = [
    'dust_cover_axis',
    'dust_cover_open_position',
    'dust_cover_closed_position',
    'dust_cover_use_output'
];
const categoryMap = new Map();

window.addEventListener('load', () => {
    id('rapidchangetablink').addEventListener('click', loadConfigSettings);
    id('settingtablink').addEventListener('click', unloadConfigSettings);
    buildCategoryMap();
});

function getSettingInput(labelSuffix, inputType) {
    let inputSelector;
    switch (inputType) {
        case 'text':
            inputSelector = 'input[type="text"]';
            break;
        case 'select':
            inputSelector = 'select';
            break;
        case 'button':
            inputSelector = 'button';
            break;
        default:
            break;
    }

    return rcSettings
        .find(s => s.label === rcPrefix + labelSuffix)
        .clonedEl
        .querySelector(inputSelector);
}

function openSettingsTree() {
    id('tree_setting_filter').click();
}

function closeSettingsTree() {
    id('nvs_setting_filter').click();
}

function buildCategoryMap() {
    pocketsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'pockets'));
    referencesLabels.forEach(l => categoryMap.set(rcPrefix + l, 'references'));
    speedLabels.forEach(l => categoryMap.set(rcPrefix + l, 'speed'));
    optionsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'options'));
    toolSetterRefLabels.forEach(l => categoryMap.set(rcPrefix + l, 'toolSetRef'));
    touchOffLabels.forEach(l => categoryMap.set(rcPrefix + l, 'touch'));
    toolRecognitionLabels.forEach(l => categoryMap.set(rcPrefix + l, 'toolRec'));
    dustCoverSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'cover'));
}

function getSettingsRoots() {
    pocketsRoot = id('pocket_settings_list');
    referencesRoot = id('reference_settings_list');
    speedsRoot = id('speed_settings_list');
    optionsRoot = id('option_settings_list');
    toolSetRefRoot = id('tool_setter_ref_settings_list');
    touchOffRoot = id('touch_settings_list');
    toolRecognitionRoot = id('tool_rec_settings_list');
    dustCoverRoot = id('dust_cover_settings_list');
}

function fetchRCSettings() {
    rcSettings = scl
        .filter(s => s.label.startsWith('/RapidChange'));
}

function createCloneElements() {
    rcSettings.forEach(s => {
        s.clonedEl = id('status_setting_' + s.index + '_0');
        modifyClonedElement(s.clonedEl);
    });
}

function createLabelElements() {
    rcSettings.forEach(s => {
        let labelEl = document.createElement('span');
        labelEl.className = 'config-label';
        let labelText = s.label
            .substring(rcPrefixLength)
            .replaceAll('_', ' ');        
        labelEl.innerText = labelText;
        s.labelEl = labelEl;
    });
}

function createListItemElements() {
    rcSettings.forEach(s => {
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
        clone.style.width = '170px';
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
    rcSettings.forEach(s => {
        let category = categoryMap.get(s.label);
        switch (category) {
            case 'pockets':
                pocketsRoot.append(s.listItemEl);
                break;
            case 'references':
                referencesRoot.append(s.listItemEl);
                break;
            case 'speed':
                speedsRoot.append(s.listItemEl);
                break;
            case 'options':
                optionsRoot.append(s.listItemEl);
                break;
            case 'toolSetRef':
                toolSetRefRoot.append(s.listItemEl);
                break;
            case 'touch':
                touchOffRoot.append(s.listItemEl);
                break;
            case 'toolRec':
                toolRecognitionRoot.append(s.listItemEl);
                break;
            case 'cover':
                dustCoverRoot.append(s.listItemEl);
                break;
            default:
                console.log('Settings category does not exist.');
                break;
        }
        
    });
}

function loadConfigSettings() {
    if (!configSettingsLoaded) {
        openSettingsTree();
        fetchRCSettings();
        createLabelElements();
        createCloneElements();
        createListItemElements();
        closeSettingsTree();
        getSettingsRoots();
        appendListItemElements();
        configSettingsLoaded = true;
    }
}

function unloadConfigSettings() {
    if (configSettingsLoaded) {
        pocketsRoot.innerHTML = '';
        optionsRoot.innerHTML = '';
        toolRecognitionRoot.innerHTML = '';
        speedsRoot.innerHTML = '';
        touchOffRoot.innerHTML = '';
        // infraredSettingsRoot.innerHTML = '';
        rcSettings = [];
        configSettingsLoaded = false;
    }
}