//restart dialog
function restartdlg() {
    console.log("show restart");
    var modal = setactiveModal('restartdlg.html');
    if (modal == null) return;
    id('prgrestart').style.display = 'block';
    id('restartmsg').innerHTML = translate_text_item("Restarting, please wait....");
    showModal();
    SendPrinterCommand("[ESP444]RESTART", false, restart_esp_success, restart_esp_failed);
}

function restart_esp_success(response) {
    var i = 0;
    var interval;
    var x = id("prgrestart");
    http_communication_locked = true;
    x.max = 10;
    interval = setInterval(function() {
        last_ping = Date.now();
        i = i + 1;
        var x = id("prgrestart");
        x.value = i;
        id('restartmsg').innerHTML = translate_text_item("Restarting, please wait....") + (x.max + 1 - i) + translate_text_item(" seconds");
        if (i > x.max) {
            clearInterval(interval);
            location.reload();
        }
    }, 1000);
    //console.log(response);
}

function restart_esp_failed(errorcode, response) {
    id('prgrestart').style.display = 'none';
    id('restartmsg').innerHTML = translate_text_item("Upload failed : ") + errorcode + " :" + response;
    console.log("Error " + errorcode + " : " + response);
    closeModal('Cancel')
}
