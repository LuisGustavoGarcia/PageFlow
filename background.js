// This file will handle speech and other chrome add-on functionality.

/* Uses the text-to-speech engine, then calls a chosen callback when string has been read */
function readMsg(msg, port){
    if(msg.tts != "" && msg.tts != null){
        chrome.tts.speak(msg.tts, {
            requiredEventTypes: ['end'],
            onEvent: function(event) {
                if(event.type === 'end') {
                    resumeAnnyang(port);
                }
            }
        });
    }
}

function resumeAnnyang(port){
    port.postMessage({annyang: true});
}

/* ================ Add Functions Above This ================ */

/* This communicates with the page-parser.js file */
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "userInteraction");
    port.onMessage.addListener(function(msg){
        readMsg(msg, port);
    });
});
