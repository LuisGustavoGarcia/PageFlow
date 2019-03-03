/* This file will handle DOM parsing */

/* Fetch annyang script */

/* Create a port to send messages back and forth between background.js and page-parser.js */
var port = chrome.runtime.connect({name: "userInteraction"});
var stream;
/* Send data to be read by the text-to-speech engine */
function sendReadData(dataStr){
    port.postMessage({tts: dataStr});
}

/* Send data to be read by the text-to-speech engine, then take user voice input afterwards. */
function readAndTakeInput(dataStr){
    port.postMessage({tts: dataStr, annyang: true});
}

function initAnnyang(){
    if(annyang){
        console.log("Initiating annyang");
        
        var commands = {
            "please": function(){
                console.log("Testing.");
                annyang.abort();
                denyMicrophoneUse();
            }
        }

        // Add new commands, overwriting any existing ones.
        annyang.addCommands(commands);

        // I think a result match is already being handled.
        //annyang.addCallback('resultMatch', handleResultMatch(result));
        annyang.addCallback('resultNoMatch', handleResultNoMatch());
        return true;
    }else{
        return false;
    }
}

/* Audio prompt to that user that we did not have a match on their input. */
function handleResultNoMatch(){
    annyang.abort();
    console.log("Error: Did not match user input");
    readAndTakeInput("I'm sorry, could you repeat that?");
}

/* Verify your browser has GetUserMedia API */
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/* Prompt the user to allow their microphone to record audio. */
function allowMicrophoneUse(){
    if(hasGetUserMedia()){
        var constraints = {audio: true};
        stream = navigator.mediaDevices.getUserMedia(constraints);
    }
}

/* Disable microphone's ability to record audio. */
function denyMicrophoneUse(){
    console.log(stream);
    stream.then(function(mediaStream){
        // Do stuff?
    });
}

/* ================ Add Functions Above This ================ */
if(initAnnyang()){
    readAndTakeInput("Hello.");
}

/* Respond to messages from background.js here */
port.onMessage.addListener(function(msg){
    // Initialize
    if (msg.annyang == true){
        // Ask user to allow microphone input.
        allowMicrophoneUse();
        annyang.start({ autoRestart: false, continuous: false });
    }
});