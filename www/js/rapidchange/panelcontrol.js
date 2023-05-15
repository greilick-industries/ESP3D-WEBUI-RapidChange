// window.addEventListener('load', () => {
//     id('mag-opt-btn').click();
//     id('coord-btn').click();
//     id('zed-btn').click();
//     id('speed-btn').click();
//     id('infrared-btn').click();
//     id('touch-btn').click();    
// });

function togglePanel(btnId, panelId) {
    const button = id(btnId);
    const panel = id(panelId);
    const wasShown = button.classList.toggle('btn-rc');
    button.classList.toggle('btn-rc-orange');
    panel.style.display = wasShown ? 'none' : 'flex';
}

