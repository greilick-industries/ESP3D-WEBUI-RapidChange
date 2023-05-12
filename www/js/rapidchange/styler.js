var clearMonitorBtn;
var commandContent;
var sendBtn;
var commandInput;
var autoScrollCheckbox;
var verboseCheckbox;

window.addEventListener('load', () => {
    getStyledComponents();
    wireStyleEvents();
});

function getStyledComponents() {
    clearMonitorBtn = id('clear_monitor_btn');
    commandContent = id('cmd_content');
    sendBtn = commandPanel.querySelector('button:not([id="clear_monitor_btn"])');
    commandInput = commandPanel.querySelector('input[type="text"]');
    autoScrollCheckbox = id('monitor_enable_autoscroll');
    verboseCheckbox = id('monitor_enable_verbose_mode');
}

function wireStyleEvents() {
    id('maintablink').addEventListener('click', removeRapidChangeStyle);
    id('settingtablink').addEventListener('click', removeRapidChangeStyle);
    id('camtablink').addEventListener('click', removeRapidChangeStyle);
    id('configtablink').addEventListener('click', removeRapidChangeStyle);
    id('tablettablink').addEventListener('click', removeRapidChangeStyle);
    id('rapidchangetablink').addEventListener('click', setRapidChangeStyle);
}

function setRapidChangeStyle() {
    document.querySelector('body').classList.add('dark-body');
    commandPanel.classList.add('panel-rc');
    controlsPanel.classList.add('panel-rc');
    clearMonitorBtn.classList.add('btn-rc');
    commandContent.classList.add('command-content-rc');
    sendBtn.classList.add('btn-rc');
    commandInput.classList.add('command-input-rc');
    autoScrollCheckbox.classList.add('checkbox-rc');
    verboseCheckbox.classList.add('checkbox-rc');
    document.querySelector('.navbar').classList.add('navbar-rc');
    id('rapidchangetablink').classList.add('active-rc');
    classes('tablinks')
        .filter(tab => tab.id != 'rapidchangetablink')
        .forEach(tab => {
            tab.classList.add('tab-rc');
    });
    document.querySelector('.navbar-brand').classList.add('navbar-brand-rc');
    document.querySelector('.dropbtn').classList.add('dropbtn-rc');
}

function removeRapidChangeStyle() {
    document.querySelector('body').classList.remove('dark-body');
    commandPanel.classList.remove('panel-rc');
    controlsPanel.classList.remove('panel-rc');
    clearMonitorBtn.classList.remove('btn-rc');
    commandContent.classList.remove('command-content-rc');
    sendBtn.classList.remove('btn-rc');
    commandInput.classList.remove('command-input-rc');
    autoScrollCheckbox.classList.remove('checkbox-rc');
    verboseCheckbox.classList.remove('checkbox-rc');
    document.querySelector('.navbar').classList.remove('navbar-rc');
    document.querySelector('.navbar-brand').classList.remove('navbar-brand-rc');
    document.querySelector('.dropbtn').classList.remove('dropbtn-rc');
    id('rapidchangetablink').classList.remove('active-rc');
    classes('tablinks')
        .filter(tab => tab.id != 'rapidchangetablink')
        .forEach(tab => {
            tab.classList.remove('tab-rc');
    });
}