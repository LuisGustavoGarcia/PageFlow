// This file will handle DOM parsing

/* Create a port to send messages back and forth between background.js and page-parser.js */
var port = chrome.runtime.connect({name: "userInteraction"});
var nextToRead;

/* Respond to messages from background.js here */
port.onMessage.addListener(function(msg){});

/* Send data to be read by the text-to-speech engine, and a callback function to execute afterwards */
/* Note: the callback function must be located within background.js, NOT page-parser.js */
function sendReadData(dataStr, readCallback){
    port.postMessage({tts: dataStr, callback: readCallback});
}