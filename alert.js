var firstTime = true;

window.alert = function(msg) {
    var elem = document.getElementById("alert");
    elem.textContent = msg;
    elem.className = 'show';
    if (firstTime) {
        elem.addEventListener('click', function() {
            elem.className = '';
        });
    }
};

