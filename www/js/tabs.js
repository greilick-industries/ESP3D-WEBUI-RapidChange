function opentab(evt, tabname, tabcontentid, tablinkid) {
    var i, tabcontent, tablinks;
    tabcontent = classes("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].parentNode.id == tabcontentid) {
            tabcontent[i].style.display = "none";
        }
    }
    tablinks = classes("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].parentNode.id == tablinkid) {
            tablinks[i].className = tablinks[i].className.replace("active", "");
        }
    }
    id(tabname).style.display = "block";
    evt.currentTarget.className += " active";
}
