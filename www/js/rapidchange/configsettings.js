var rcSettings = [];
var magSettingsRoot;
var coordSettingsRoot;
var speedSettingsRoot;
var zedSettingsRoot;
var touchSettingsRoot;
var infraredSettingsRoot;
var configSettingsLoaded = false;
const rcPrefix = '/RapidChange/'
const rcPrefixLength = 13;
const magSettingsLabels = [ 
    'collet', 
    'pockets', 
    'direction', 
    'orientation', 
    'probe', 
    'disable_tool_recognition' 
];
const coordSettingsLabels = [ 
    'pocket_one_x_pos', 
    'pocket_one_y_pos', 
    'manual_x_pos', 
    'manual_y_pos' 
];
const speedSettingsLabels = [ 
    'engage_feedrate', 
    'spin_speed_engage_cw', 
    'spin_speed_engage_ccw' 
];
const zedSettingsLabels = [ 
    'engage_z', 
    'back_off_engage_z', 
    'spindle_start_z', 
    'tool_recognition_z', 
    'safe_clearance_z' 
];
const touchSettingsLabels = [ 
    'touch_probe_x_pos', 
    'touch_probe_y_pos', 
    'go_to_touch_probe_z', 
    'touch_probe_start_z', 
    'touch_tool_setter_z', 
    'touch_probe_max_distance', 
    'touch_probe_feedrate' 
];
const infraredSettingsLabels = [
    'infrared_probe_start_z',
    'infrared_tool_setter_z',
    'infrared_probe_feedrate',
    'spin_speed_infrared_probe'
];
const categoryMap = new Map();

window.addEventListener('load', () => {
    id('rapidchangetablink').addEventListener('click', loadConfigSettings);
    id('settingtablink').addEventListener('click', unloadConfigSettings);
    buildCategoryMap();
});

function openSettingsTree() {
    id('tree_setting_filter').click();
}

function closeSettingsTree() {
    id('nvs_setting_filter').click();
}

function buildCategoryMap() {
    magSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'mag'));
    coordSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'coord'));
    speedSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'speed'));
    zedSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'zed'));
    touchSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'touch'));
    infraredSettingsLabels.forEach(l => categoryMap.set(rcPrefix + l, 'infrared'));
}

function getSettingsRoots() {
    magSettingsRoot = id('magazine_settings_list');
    coordSettingsRoot = id('coordinate_settings_list');
    speedSettingsRoot = id('speed_settings_list');
    zedSettingsRoot = id('zed_settings_list');
    touchSettingsRoot = id('touch_settings_list');
    infraredSettingsRoot = id('infrared_settings_list');
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
            case 'mag':
                magSettingsRoot.append(s.listItemEl);
                break;
            case 'coord':
                coordSettingsRoot.append(s.listItemEl);
                break;
            case 'zed':
                zedSettingsRoot.append(s.listItemEl);
                break;
            case 'speed':
                speedSettingsRoot.append(s.listItemEl);
                break;
            case 'touch':
                touchSettingsRoot.append(s.listItemEl);
                break;
            case 'infrared':
                infraredSettingsRoot.append(s.listItemEl);
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
        magSettingsRoot.innerHTML = '';
        coordSettingsRoot.innerHTML = '';
        zedSettingsRoot.innerHTML = '';
        speedSettingsRoot.innerHTML = '';
        touchSettingsRoot.innerHTML = '';
        infraredSettingsRoot.innerHTML = '';
        rcSettings = [];
        configSettingsLoaded = false;
    }
}