// This file will handle speech and other chrome add-on functionality.

// Read the response from the user, and continue.
function readMsg(msg){
    if(msg.tts != "" && msg.tts != null){
        readString(msg.tts, msg.callback);
    }
}

/* Uses the text-to-speech engine, then calls a chosen callback when string has been read */
function readString(dataStr, readStringCallback){
    chrome.tts.speak(dataStr, {
        requiredEventTypes: ['end'],
        onEvent: function(event) {
            if(event.type === 'end') {
                readStringCallback();
            }
        }
    });
}

/* ================ Add Functions Above This ================ */

/* This communicates with the page-parser.js file */
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "userInteraction");
    port.onMessage.addListener(function(msg){
        readMsg(msg);
    });
});