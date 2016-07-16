var firstTime = true;

window.alert = function(msg,n) {
	alerting = 1;
    var elem = document.getElementById("alert");
    elem.textContent = msg;
    elem.className = 'show';
};

window.disalert = function(n) {
	alerting = 0;
	reInit();
    var elem = document.getElementById("alert");
    elem.className = ' ';
};

