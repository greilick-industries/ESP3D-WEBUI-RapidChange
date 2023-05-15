var ESP3D_authentication = false;
var page_id = "";
var convertDHT2Fahrenheit = false;
var ws_source;
var event_source;
var log_off = false;
var async_webcommunication = false;
var websocket_port = 0;
var websocket_ip = "";
var esp_hostname = "ESP3D WebUI";
var EP_HOSTNAME;
var EP_STA_SSID;
var EP_STA_PASSWORD;
var EP_STA_IP_MODE;
var EP_STA_IP_VALUE;
var EP_STA_GW_VALUE;
var EP_STA_MK_VALUE;
var EP_WIFI_MODE;
var EP_AP_SSID;
var EP_AP_PASSWORD;
var EP_AP_IP_VALUE;
var EP_BAUD_RATE = 112;
var EP_AUTH_TYPE = 119;
var EP_TARGET_FW = 461;
var EP_IS_DIRECT_SD = 850;
var EP_PRIMARY_SD = 851;
var EP_SECONDARY_SD = 852;
var EP_DIRECT_SD_CHECK = 853;
var SETTINGS_AP_MODE = 1;
var SETTINGS_STA_MODE = 2;
var SETTINGS_FALLBACK_MODE = 3;
var interval_ping = -1;
var last_ping = 0;
var enable_ping = true;
var esp_error_message ="";
var esp_error_code = 0;

function beep(duration, frequency) {
    var audioCtx;
    if (typeof window.AudioContext !== 'undefined') {
        audioCtx = new window.AudioContext();
    } else if (typeof window.webkitAudioContext() !== 'undefined') {
        audioCtx = new window.webkitAudioContext();
    } else if (typeof window.audioContext !== 'undefined') {
        audioCtx = new window.audioContext();
    }
    // = new (window.AudioContext() || window.webkitAudioContext() || window.audioContext());
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 1;
    oscillator.frequency.value = frequency;
    oscillator.start();
    setTimeout(function() {
        oscillator.stop();
    }, duration);
}

function Init_events(e) {
    page_id = e.data;
    console.log("connection id = " + page_id);
}

function ActiveID_events(e) {
    if (page_id != e.data) {
        Disable_interface();
        console.log("I am disabled");
        event_source.close();
    }
}

function DHT_events(e) {
    Handle_DHT(e.data);
}
//Check for IE
//Edge
//Chrome
function browser_is(bname) {
    var ua = navigator.userAgent;
    switch (bname) {
        case "IE":
            if (ua.indexOf("Trident/") != -1) return true;
            break;
        case "Edge":
            if (ua.indexOf("Edge") != -1) return true;
            break;
        case "Chrome":
            if (ua.indexOf("Chrome") != -1) return true;
            break;
        case "Firefox":
            if (ua.indexOf("Firefox") != -1) return true;
            break;
        case "MacOSX":
            if (ua.indexOf("Mac OS X") != -1) return true;
            break;
        default:
            return false;
    }
    return false;
}

window.onload = function() {
    //to check if javascript is disabled like in anroid preview
    id('loadingmsg').style.display = 'none';
    console.log("Connect to board");
    connectdlg();
    //ugly hack for IE
    console.log(navigator.userAgent);
    if (browser_is("IE")) {
        id('control-body').className = "panel-body";
        id('extruder-body').className = "panel-body panel-height";
        id('command-body').className = "panel-body";
        id('file-body').className = "panel-body panel-height panel-max-height panel-scroll";
    }
    tabletInit();
};

var wsmsg = "";

function startSocket() {
    try {
        if (async_webcommunication) {
            ws_source = new WebSocket('ws://' + document.location.host + '/ws', ['arduino']);
        } else {
            console.log("Socket is " + websocket_ip + ":" + websocket_port);
            ws_source = new WebSocket('ws://' + websocket_ip + ':' + websocket_port, ['arduino']);
        }
    } catch (exception) {
        console.error(exception);
    }
    ws_source.binaryType = "arraybuffer";
    ws_source.onopen = function(e) {
        console.log("Connected");
    };
    ws_source.onclose = function(e) {
        console.log("Disconnected");
        //seems sometimes it disconnect so wait 3s and reconnect
        //if it is not a log off
        if (!log_off) setTimeout(startSocket, 3000);
    };
    ws_source.onerror = function(e) {
        //Monitor_output_Update("[#]Error "+ e.code +" " + e.reason + "\n");
        console.log("ws error", e);
    };
    ws_source.onmessage = function(e) {
        var msg = "";
        //bin
        if (e.data instanceof ArrayBuffer) {
            var bytes = new Uint8Array(e.data);
            for (var i = 0; i < bytes.length; i++) {
                msg += String.fromCharCode(bytes[i]);
                if (bytes[i] == 10) {
                    wsmsg += msg.replace('\r\n', '\n');
                    var thismsg = wsmsg;
                    wsmsg = "";
                    msg = "";
                    Monitor_output_Update(thismsg);
                    process_socket_response(thismsg);
                    if (!((thismsg.startsWith("<") || thismsg.startsWith("ok T:") || thismsg.startsWith("X:") || thismsg.startsWith("FR:") ||thismsg.startsWith("echo:E0 Flow"))))
                        console.log(thismsg);
                }
            }
            wsmsg += msg;
        } else {
            msg += e.data;
            var tval = msg.split(":");
            if (tval.length >= 2) {
                if (tval[0] == 'CURRENT_ID') {
                    page_id = tval[1];
                    console.log("connection id = " + page_id);
                }
                if (enable_ping) {
                    if (tval[0] == 'PING') {
                        page_id = tval[1];
                        // console.log("ping from id = " + page_id);
                        last_ping = Date.now();
                        if (interval_ping == -1) interval_ping = setInterval(function() {
                            check_ping();
                        }, 10 * 1000);
                    }
                }
                if (tval[0] == 'ACTIVE_ID') {
                    if (page_id != tval[1]) {
                        Disable_interface();
                    }
                }
                if (tval[0] == 'DHT') {
                    Handle_DHT(tval[1]);
                }
                if (tval[0] == 'ERROR') {
                    esp_error_message = tval[2];
                    esp_error_code = tval[1];
                    console.log("ERROR: " + tval[2] + " code:" +  tval[1]);
                    CancelCurrentUpload();
                }
                if (tval[0] == 'MSG') {
                    var error_message = tval[2];
                    var error_code = tval[1];
                    console.log("MSG: " + tval[2] + " code:" +  tval[1]);
                }
            }

        }
        //console.log(msg);

    };
}

function check_ping() {
    //if ((Date.now() - last_ping) > 20000){
    //Disable_interface(true);
    //console.log("No heart beat for more than 20s");
    //}
}

function disable_items(item, state) {
    var liste = item.getElementsByTagName("*");
    for (i = 0; i < liste.length; i++) liste[i].disabled = state;
}

function ontogglePing(forcevalue) {
    if (typeof forcevalue != 'undefined') enable_ping = forcevalue;
    else enable_ping = !enable_ping;
    if (enable_ping) {
        if (interval_ping != -1) clearInterval(interval_ping);
        last_ping = Date.now();
        interval_ping = setInterval(function() {
            check_ping();
        }, 10 * 1000);
        console.log("enable ping");
    } else {
        if (interval_ping != -1) clearInterval(interval_ping);
        console.log("disable ping");
    }
}

function ontoggleLock(forcevalue) {
    if (typeof forcevalue != 'undefined') id('lock_UI').checked = forcevalue;
    if (id('lock_UI').checked) {
        id('lock_UI_btn_txt').innerHTML = translate_text_item("Unlock interface");
        disable_items(id('maintab'), true);
        disable_items(id('configtab'), true);
        id('progress_btn').disabled = false;
        id('clear_monitor_btn').disabled = false;
        id('monitor_enable_verbose_mode').disabled = false;
        id('monitor_enable_autoscroll').disabled = false;
        id('settings_update_fw_btn').disabled = true;
        id('settings_restart_btn').disabled = true;
        disable_items(id('JogUI'), false);
        id('JogUI').style.pointerEvents = 'none';
    } else {
        id('lock_UI_btn_txt').innerHTML = translate_text_item("Lock interface");
        disable_items(id('maintab'), false);
        disable_items(id('configtab'), false);
        id('settings_update_fw_btn').disabled = false;
        id('settings_restart_btn').disabled = false;
        id('JogUI').style.pointerEvents = 'auto';
    }
}


function Handle_DHT(data) {
    var tdata = data.split(" ");
    if (tdata.length != 2) {
        console.log("DHT data invalid: " + data);
        return;
    }
    var temp = (convertDHT2Fahrenheit) ? (parseFloat(tdata[0]) * 1.8) + 32 : parseFloat(tdata[0]);
    id('DHT_humidity').innerHTML = parseFloat(tdata[1]).toFixed(2).toString() + "%";
    var temps = temp.toFixed(2).toString() + "&deg;";
    if (convertDHT2Fahrenheit) temps += "F";
    else temps += "C";
    id('DHT_temperature').innerHTML = temps;
}
//window.addEventListener("resize", OnresizeWindow);

//function OnresizeWindow(){
//}
var total_boot_steps = 5;
var current_boot_steps = 0;

function display_boot_progress(step) {
    var val = 1;
    if (typeof step != 'undefined') val = step;
    current_boot_steps += val;
    //console.log(current_boot_steps);
    //console.log(Math.round((current_boot_steps*100)/total_boot_steps));
    id('load_prg').value = Math.round((current_boot_steps * 100) / total_boot_steps);
}


function Disable_interface(lostconnection) {
    var lostcon = false;
    if (typeof lostconnection != "undefined") lostcon = lostconnection;
    //block all communication
    http_communication_locked = true;
    log_off = true;
    if (interval_ping != -1) clearInterval(interval_ping);
    //clear all waiting commands
    clear_cmd_list();
    //no camera 
    id('camera_frame').src = "";
    //No auto check
    on_autocheck_position(false);
    on_autocheck_temperature(false);
    on_autocheck_status(false);
    if (async_webcommunication) {
        event_source.removeEventListener('ActiveID', ActiveID_events, false);
        event_source.removeEventListener('InitID', Init_events, false);
        event_source.removeEventListener('DHT', DHT_events, false);
    }
    ws_source.close();
    document.title += "(" + decode_entitie(translate_text_item("Disabled")) + ")";
    UIdisableddlg(lostcon);
}

function update_UI_firmware_target() {
    var fwName;
    initpreferences();
    id('control_x_position_label').innerHTML = "X";
    id('control_y_position_label').innerHTML = "Y";
    id('control_z_position_label').innerHTML = "Z";
    id('config_smoothie_nav').style.display = 'none';
    showAxiscontrols();
    if (target_firmware == "repetier") {
        fwName = "Repetier";
        id('configtablink').style.display = 'block';
        id('auto_check_control').style.display = 'flex';
        id('motor_off_control').style.display = 'table-row';
        id('progress_btn').style.display = 'table-row';
        id('abort_btn').style.display = 'table-row';
        id('grblPanel').style.display = 'none';
        id('zero_xyz_btn').style.display = 'none';
        id('zero_x_btn').style.display = 'none';
        id('zero_y_btn').style.display = 'none';
        id('zero_z_btn').style.display = 'none';
        id('control_xm_position_row').style.display = 'none';
        id('control_ym_position_row').style.display = 'none';
        id('control_zm_position_row').style.display = 'none';
    } else if (target_firmware == "repetier4davinci") {
        fwName = "Repetier for Davinci";
        id('configtablink').style.display = 'block';
        id('auto_check_control').style.display = 'flex';
        id('motor_off_control').style.display = 'table-row';
        id('progress_btn').style.display = 'table-row';
        id('abort_btn').style.display = 'table-row';
        id('grblPanel').style.display = 'none';
        id('zero_xyz_btn').style.display = 'none';
        id('zero_x_btn').style.display = 'none';
        id('zero_y_btn').style.display = 'none';
        id('zero_z_btn').style.display = 'none';
        id('control_xm_position_row').style.display = 'none';
        id('control_ym_position_row').style.display = 'none';
        id('control_zm_position_row').style.display = 'none';
    } else if (target_firmware == "smoothieware") {
        fwName = "Smoothieware";
        id('configtablink').style.display = 'block';
        id('config_smoothie_nav').style.display = 'block';
        id('auto_check_control').style.display = 'flex';
        id('motor_off_control').style.display = 'table-row';
        id('progress_btn').style.display = 'table-row';
        id('abort_btn').style.display = 'table-row';
        id('grblPanel').style.display = 'none';
        id('zero_xyz_btn').style.display = 'none';
        id('zero_x_btn').style.display = 'none';
        id('zero_y_btn').style.display = 'none';
        id('zero_z_btn').style.display = 'none';
        id('control_xm_position_row').style.display = 'none';
        id('control_ym_position_row').style.display = 'none';
        id('control_zm_position_row').style.display = 'none';
    } else if (target_firmware == "grbl-embedded") {
        fwName = "FluidNC";
        last_grbl_pos = "";
        id('configtablink').style.display = 'none';
        id('auto_check_control').style.display = 'none';
        id('progress_btn').style.display = 'none';
        id('abort_btn').style.display = 'none';
        id('motor_off_control').style.display = 'none';
        id('tab_title_configuration').innerHTML = "<span translate>GRBL configuration</span>";
        id('tab_printer_configuration').innerHTML = "<span translate>GRBL</span>";
        id('files_input_file').accept = " .g, .gco, .gcode, .txt, .ncc, .G, .GCO, .GCODE, .TXT, .NC";
        id('zero_xyz_btn').style.display = 'block';
        id('zero_x_btn').style.display = 'block';
        id('zero_y_btn').style.display = 'block';
        if (grblaxis >2) {
            //id('control_z_position_display').style.display = 'block';
            id('control_z_position_label').innerHTML = "Zw";
        } else {
            hideAxiscontrols();
            id('preferences_control_z_velocity_group').style.display = 'none';
        }
        if (grblaxis >3) {
            
            id('zero_xyz_btn_txt').innerHTML +="A";
            grblzerocmd += " A0";
            build_axis_selection();
            id('preferences_control_a_velocity_group').style.display = 'block';
            id('positions_labels2').style.display = 'inline-grid';
            id('control_a_position_display').style.display = 'block';
        } 
        if (grblaxis >4) {
            id('control_b_position_display').style.display = 'block';
            id('zero_xyz_btn_txt').innerHTML +="B";
            grblzerocmd += " B0";
            id('preferences_control_b_velocity_group').style.display = 'block';
        } 
        if (grblaxis >5) {
            id('control_c_position_display').style.display = 'block';
            id('zero_xyz_btn_txt').innerHTML +="C";
            id('preferences_control_c_velocity_group').style.display = 'block';
            
        } else {
            id('control_c_position_display').style.display = 'none';
        }
        id('grblPanel').style.display = 'flex';
        // id('FW_github').href = 'https://github.com/bdring/FluidNC';
        id('settings_filters').style.display = 'block';
        id('control_x_position_label').innerHTML = "Xw";
        id('control_y_position_label').innerHTML = "Yw";
        

    } else if (target_firmware == "marlin-embedded") {
        fwName = "Marlin ESP32";
        id('configtablink').style.display = 'block';
        id('auto_check_control').style.display = 'flex';
        id('motor_off_control').style.display = 'table-row';
        id('progress_btn').style.display = 'table-row';
        id('abort_btn').style.display = 'table-row';
        id('zero_xyz_btn').style.display = 'none';
        id('zero_x_btn').style.display = 'none';
        id('zero_y_btn').style.display = 'none';
        id('zero_z_btn').style.display = 'none';
        id('grblPanel').style.display = 'none';
        id('FW_github').href = 'https://github.com/MarlinFirmware/Marlin';
        id('settings_filters').style.display = 'none';
        id('control_xm_position_row').style.display = 'none';
        id('control_ym_position_row').style.display = 'none';
        id('control_zm_position_row').style.display = 'none';
    } else if (target_firmware == "marlin") {
        fwName = "Marlin";
        id('configtablink').style.display = 'block';
        id('auto_check_control').style.display = 'flex';
        id('motor_off_control').style.display = 'table-row';
        id('progress_btn').style.display = 'table-row';
        id('abort_btn').style.display = 'table-row';
        id('zero_xyz_btn').style.display = 'none';
        id('zero_x_btn').style.display = 'none';
        id('zero_y_btn').style.display = 'none';
        id('zero_z_btn').style.display = 'none';
        id('grblPanel').style.display = 'none';
        id('control_xm_position_row').style.display = 'none';
        id('control_ym_position_row').style.display = 'none';
        id('control_zm_position_row').style.display = 'none';
    } else if (target_firmware == "marlinkimbra") {
        fwName = "Marlin Kimbra";
        id('configtablink').style.display = 'block';
        id('auto_check_control').style.display = 'flex';
        id('motor_off_control').style.display = 'table-row';
        id('progress_btn').style.display = 'table-row';
        id('abort_btn').style.display = 'table-row';
        id('zero_xyz_btn').style.display = 'none';
        id('zero_x_btn').style.display = 'none';
        id('zero_y_btn').style.display = 'none';
        id('zero_z_btn').style.display = 'none';
        id('grblPanel').style.display = 'none';
        id('control_xm_position_row').style.display = 'none';
        id('control_ym_position_row').style.display = 'none';
        id('control_zm_position_row').style.display = 'none';
    } else if (target_firmware == "grbl") {
        fwName = "Grbl";
        id('configtablink').style.display = 'block';
        id('tab_title_configuration').innerHTML = "<span translate>GRBL configuration</span>";
        id('tab_printer_configuration').innerHTML = "<span translate>GRBL</span>";
        id('files_input_file').accept = " .g, .gco, .gcode, .txt, .ncc, .G, .GCO, .GCODE, .TXT, .NC";
        id('auto_check_control').style.display = 'none';
        id('motor_off_control').style.display = 'none';
        id('progress_btn').style.display = 'none';
        id('abort_btn').style.display = 'none';
        id('zero_xyz_btn').style.display = 'block';
        id('zero_x_btn').style.display = 'block';
        id('zero_y_btn').style.display = 'block';
        id('zero_z_btn').style.display = 'block';
        id('grblPanel').style.display = 'flex';
        id('control_x_position_label').innerHTML = "Xw";
        id('control_y_position_label').innerHTML = "Yw";
        id('control_z_position_label').innerHTML = "Zw";
        id('control_xm_position_row').style.display = 'table-row';
        id('control_ym_position_row').style.display = 'table-row';
        id('control_zm_position_row').style.display = 'table-row';
    } else {
        fwName = "Unknown";
        id('configtablink').style.display = 'none';
    }
    if (target_firmware == "grbl-embedded") {
        EP_HOSTNAME = "Hostname";
        EP_STA_SSID = "Sta/SSID";
        EP_STA_PASSWORD = "Sta/Password";
        EP_STA_IP_MODE = "Sta/IPMode";
        EP_STA_IP_VALUE = "Sta/IP";
        EP_STA_GW_VALUE = "Sta/Gateway";
        EP_STA_MK_VALUE = "Sta/Netmask";
        EP_WIFI_MODE = "WiFi/Mode";
        EP_AP_SSID = "AP/SSID";
        EP_AP_PASSWORD = "AP/Password";
        EP_AP_IP_VALUE = "AP/IP";
        SETTINGS_AP_MODE = 2;
        SETTINGS_STA_MODE = 1;
    } else if (target_firmware == "marlin-embedded") {
        EP_HOSTNAME = "ESP_HOSTNAME";
        EP_STA_SSID = "STA_SSID";
        EP_STA_PASSWORD = "STA_PWD";
        EP_STA_IP_MODE = "STA_IP_MODE";
        EP_STA_IP_VALUE = "STA_IP";
        EP_STA_GW_VALUE = "STA_GW";
        EP_STA_MK_VALUE = "STA_MK";
        EP_WIFI_MODE = "WIFI_MODE";
        EP_AP_SSID = "AP_SSID";
        EP_AP_PASSWORD = "AP_PWD";
        EP_AP_IP_VALUE = "AP_IP";
        SETTINGS_AP_MODE = 2;
        SETTINGS_STA_MODE = 1;
    } else {
        EP_HOSTNAME = 130;
        EP_STA_SSID = 1;
        EP_STA_PASSWORD = 34;
        EP_STA_IP_MODE = 99;
        EP_STA_IP_VALUE = 100;
        EP_STA_MK_VALUE = 104;
        EP_STA_GW_VALUE = 108;
        EP_WIFI_MODE = 0;
        EP_AP_SSID = 218;
        EP_AP_PASSWORD = 251;
        EP_AP_IP_VALUE = 316;
        SETTINGS_AP_MODE = 1;
        SETTINGS_STA_MODE = 2;
    }
    if (typeof id('fwName') != "undefined") id('fwName').innerHTML = fwName;
    //SD image or not
    if (direct_sd && typeof id('showSDused') != "undefined") id('showSDused').innerHTML = "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'><g transform='translate(50,1200) scale(1, -1)'><path  fill='#777777' d='M200 1100h700q124 0 212 -88t88 -212v-500q0 -124 -88 -212t-212 -88h-700q-124 0 -212 88t-88 212v500q0 124 88 212t212 88zM100 900v-700h900v700h-900zM500 700h-200v-100h200v-300h-300v100h200v100h-200v300h300v-100zM900 700v-300l-100 -100h-200v500h200z M700 700v-300h100v300h-100z' /></g></svg>";
    else id('showSDused').innerHTML = "";
    return fwName;
}

function Set_page_title(page_title) {
    if (typeof page_title != 'undefined') esp_hostname = page_title;
    document.title = esp_hostname;
}

function initUI() {
    console.log("Init UI");
    if (ESP3D_authentication) connectdlg(false);
    AddCmd(display_boot_progress);
    //initial check
    if ((typeof target_firmware == "undefined") || (typeof web_ui_version == "undefined") || (typeof direct_sd == "undefined")) alert('Missing init data!');
    //check FW
    update_UI_firmware_target();
    //set title using hostname
    Set_page_title();
    //update UI version
    if (typeof id('UI_VERSION') != "undefined") id('UI_VERSION').innerHTML = web_ui_version;
    //update FW version
    if (typeof id('FW_VERSION') != "undefined") id('FW_VERSION').innerHTML = fw_version;
    // Get the element with id="defaultOpen" and click on it

    

    id("maintablink").click();
    if ((target_firmware == "grbl-embedded") || (target_firmware == "grbl-embedded")) {
        if (typeof id("grblcontroltablink") !== 'undefined') {
            id("grblcontroltablink").click();
        }
    }
    //removeIf(production)
    console.log(JSON.stringify(translated_list));
    //endRemoveIf(production)
    initUI_2();
}

function initUI_2() {
    AddCmd(display_boot_progress);
    //get all settings from ESP3D
    console.log("Get settings");
    //query settings but do not update list in case wizard is showed
    refreshSettings(true);
    initUI_3();
}

function initUI_3() {
    AddCmd(display_boot_progress);
    //init panels 
    console.log("Get macros");
    init_controls_panel();
    init_grbl_panel();
    console.log("Get preferences");
    getpreferenceslist();
    initUI_4();
}

function initUI_4() {
    AddCmd(display_boot_progress);
    init_temperature_panel();
    init_extruder_panel();
    init_command_panel();
    init_files_panel(false);
    //check if we need setup
    if (target_firmware == "???") {
        console.log("Launch Setup");
        AddCmd(display_boot_progress);
        closeModal("Connection successful");
        setupdlg();
    } else {
        //wizard is done UI can be updated
        setup_is_done = true;
        do_not_build_settings = false;
        AddCmd(display_boot_progress);
        build_HTML_setting_list(current_setting_filter);
        AddCmd(closeModal);
        AddCmd(show_main_UI);
    }
}

function show_main_UI() {
    id('main_ui').style.display = 'block';
}

function compareStrings(a, b) {
    // case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function compareInts(a, b) {
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function HTMLEncode(str) {
    var i = str.length,
        aRet = [];

    while (i--) {
        var iC = str[i].charCodeAt();
        if (iC < 65 || iC > 127 || (iC > 90 && iC < 97)) {
            if (iC == 65533) iC = 176;
            aRet[i] = '&#' + iC + ';';
        } else {
            aRet[i] = str[i];
        }
    }
    return aRet.join('');
}

function decode_entitie(str_text) {
    var tmpelement = document.createElement('div');
    tmpelement.innerHTML = str_text;
    str_text = tmpelement.textContent;
    tmpelement.textContent = '';
    return str_text;
}

var socket_response = "";
var socket_is_settings = false;

function process_socket_response(msg) {

    if (target_firmware == "grbl-embedded") {
        msg.split('\n').forEach(grblHandleMessage);
        return;
    }
    if (target_firmware == "marlin-embedded") {
        if (socket_is_settings && !(msg.startsWith("echo:Unknown command:") || msg.startsWith("echo:enqueueing"))) socket_response += msg+"\n";
        if (!socket_is_settings && (msg.startsWith("  G21") || msg.startsWith("  G20") || msg.startsWith("echo:  G21") || msg.startsWith("echo:  G20"))) {
            socket_is_settings = true;
            socket_response = msg + "\n";
            //to stop waiting for data
            console.log("Got settings Start");
        }
        if (msg.startsWith("ok T:") || msg.startsWith(" T:")|| msg.startsWith("T:")) {
            if (!graph_started)start_graph_output();
            process_Temperatures(msg);
        }
        if (msg.startsWith("X:")) {
            process_Position(msg);
        }
        if (msg.startsWith("FR:")) {
            process_feedRate(msg);
        }
        
        if (msg.startsWith("echo:E") && (msg.indexOf("Flow:")!=-1)){
            process_flowdRate(msg);
        }
        
        if (msg.startsWith("[esp3d]")) {
            process_Custom(msg); // handles custom messages sent via M118
        }
        if (msg.startsWith("ok")) {
            if (socket_is_settings) {
                //update settings
                console.log("Got settings End");
                console.log(socket_response);
                getESPconfigSuccess(socket_response);
                socket_is_settings = false;
            }
        }
        return;
    }
}
