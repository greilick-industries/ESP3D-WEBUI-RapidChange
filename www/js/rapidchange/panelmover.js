var controlsPanel;
var commandPanel;
var grblPanel;
var filesPanel;
var dashboardParent;
var rapidChangeParent;

window.addEventListener('load', () => {
    getPanels();
    wireEvents();
});

function getPanels() {
    controlsPanel = id('controlPanel');
    commandPanel = id('commandsPanel');
    grblPanel = id('grblPanel');
    filesPanel = id('filesPanel');
    dashboardParent = controlsPanel.parentNode;
    rapidChangeParent = id('rcpanels');
}

function wireEvents() {
    id('maintablink').addEventListener('click', sendPanelsToDashboard);
    id('rapidchangetablink').addEventListener('click', bringPanelsToRapidChange);
}

function bringPanelsToRapidChange() {
    commandPanel.classList.add('rc-panel-max-height');
    controlsPanel.classList.add('rc-panel-max-height');
    grblPanel.classList.add('rc-panel-max-height');
    filesPanel.classList.add('rc-panel-max-height');
    rapidChangeParent.append(controlsPanel, commandPanel, grblPanel, filesPanel);
}

function sendPanelsToDashboard() {
    controlsPanel.classList.remove('rc-panel-max-height');
    commandPanel.classList.remove('rc-panel-max-height');
    grblPanel.classList.remove('rc-panel-max-height');
    filesPanel.classList.remove('rc-panel-max-height');
    dashboardParent.append(filesPanel);
    dashboardParent.insertBefore(grblPanel, id('temperaturesPanel'));
    dashboardParent.insertBefore(controlsPanel, grblPanel);
    dashboardParent.insertBefore(commandPanel, grblPanel);
}