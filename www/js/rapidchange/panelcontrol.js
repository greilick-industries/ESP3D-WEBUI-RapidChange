var configPanel;
var magOptionsButton;

window.addEventListener('load', () => {
    configPanel = id('rapidchangeconfigpanel');
    magOptionsButton = id('mag-opt-btn');
});

function toggleConfigPanel () {
    configPanel.classList.toggle('panel-hide');    
    configPanel.classList.toggle('panel-flex-col');
    magOptionsButton.classList.toggle('btn-rc');
    magOptionsButton.classList.toggle('btn-rc-orange');
}

function togglePanel(btnId, panelId) {
    const button = id(btnId);
    const panel = id(panelId);
    const wasShown = button.classList.toggle('btn-rc');
    button.classList.toggle('btn-rc-orange');
    if (panelId === 'rapidchangeconfigpanel') {
        panel.classList.toggle('panel-hide');    
        panel.classList.toggle('panel-flex-col');
    } else {
        panel.style.display = wasShown ? 'none' : 'flex';
    }
}

