function togglePanel(btnId, panelId) {
    const button = id(btnId);
    const panel = id(panelId);
    const wasShown = button.classList.toggle('btn-rc');
    button.classList.toggle('btn-rc-orange');
    panel.style.display = wasShown ? 'none' : 'flex';
}

