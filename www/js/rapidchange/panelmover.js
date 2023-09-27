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
    rapidChangeParent.append(controlsPanel, commandPanel, grblPanel, filesPanel);
}

function sendPanelsToDashboard() {
    dashboardParent.append(filesPanel);
    dashboardParent.insertBefore(grblPanel, id('temperaturesPanel'));
    dashboardParent.insertBefore(controlsPanel, grblPanel);
    dashboardParent.insertBefore(commandPanel, grblPanel);
}