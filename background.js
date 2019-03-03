// This file will handle speech and other chrome add-on functionality.

function resumeAnnyang(port){
    port.postMessage({annyang: true});
}

/* ================ Add Functions Above This ================ */

/* This communicates with the page-parser.js file */
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "userInteraction");
    
    /* Uses the text-to-speech engine, then calls a chosen callback when string has been read */
    port.onMessage.addListener(function(msg){
        console.log("Msg: " , msg);
        if(msg.readonly == true){
            console.log("Taking input only");
            resumeAnnyang(port);
        }else if(msg.tts != "" && msg.tts != null){
            console.log("Reading text");
            chrome.tts.speak(msg.tts, {
                requiredEventTypes: ['end'],
                onEvent: function(event) {
                    if(event.type === 'end') {
                        console.log("Resuming port.");
                        resumeAnnyang(port);
                    }
                }
            });
        }
    });
});
