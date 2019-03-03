document.addEventListener('DOMContentLoaded', function() {
    var enablePort = chrome.runtime.connect({name: "enabler"});
    // setup button listeners
    document.getElementById('enableBtn').onclick = function () {
        enablePort.postMessage({enable: true});
    };
    document.getElementById('disableBtn').onclick = function () {
        enablePort.postMessage({enable: false});
    };
}, false);