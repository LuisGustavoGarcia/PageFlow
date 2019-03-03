var enable = true;
function setupPage() {
    // Use Jquery to write to the end of the body tag.
    if (enable) {
        const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        var headers = [];
        // save body html before it gets altered to keep webpage looking the same
        var tempBody = $('body').clone();
        // remove all divs
        for (let div of $('div')) {
            var newDiv = $(div).children();
            if (newDiv.length <= 0 ) {
                //create p tag with innertext
                var para = document.createElement("p");
                para.innerHTML = div.innerText;
                para.innerText = div.innerText;
                newDiv = para;
            }
            $(div).replaceWith(newDiv);
        }
        
        function isHeader(tag) {
            for (let tagType of headerTags) {
                if (tagType.toUpperCase() == tag.toUpperCase()) {
                    return true;
                }
            }
            return false;
        }
        
        function traverseElements(nextElement, header) {
            // stop adding once there are no more siblings
            // or another header is reached
            if (!nextElement || isHeader(nextElement.nodeName))
                return;
            // save text in paragraphs and span tags
            if (nextElement.nodeName === 'P' || nextElement.nodeName === 'SPAN' 
                && nextElement.innerText && nextElement.innerText.trim() !== '') {
                header['p'].push(nextElement.innerText.trim());
            } else if (nextElement.nodeName === 'A') {
                // save links associated with this header
                header['a'].push({'text': nextElement.innerText.trim(), 'data': nextElement});
            } 
                //else if (nextElement.childNodes.length == 0) {
                //  header['p'].push(nextElement.innerText.trim());
            //}
            else {
                // search inside another other type of tag for the above tags
                traverseElements(nextElement.firstElementChild, header);
            }
            // go to the next sibling
            traverseElements(nextElement.nextElementSibling, header);
        }

        for (var tagType of headerTags) {
            var tags = $(tagType);
            for (var index in tags) {
                var tag = tags[index];
                if (tag && tag.innerText && tag.innerText.trim() !== '') {
                    var header = {'text': tag.innerText.trim(), 'p': [], 'a': []};
                    var nextElement = tag.nextElementSibling;
                    traverseElements(nextElement, header);
                    headers.push(header);
                }
            }   
        }
        
        console.log(headers);
        
        $('body').replaceWith($(tempBody));
    }
}

setupPage();
/* This file will handle DOM parsing */

/* Fetch annyang script */

/* Create a port to send messages back and forth between background.js and page-parser.js */
var port = chrome.runtime.connect({name: "userInteraction"});
var recorder;
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
            "work": function(){
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
    // if(hasGetUserMedia()){
        var constraints = {audio: true};
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            window.streamReference = stream;
            recorder = new MediaRecorder(stream);
            // recorder.ondataavailable = function(e) {
            //     var url = URL.createObjectURL(e.data);
            //     var preview = document.createElement('audio');
            //     preview.controls = true;
            //     preview.src = url;
            //     document.body.appendChild(preview);
            // };
            recorder.start();
        });
    // }
}

/* Disable microphone's ability to record audio. */
function denyMicrophoneUse(){
    recorder.stop();
    if (!window.streamReference) return;

    window.streamReference.getAudioTracks().forEach(function(track) {
        console.log('stopping');
        track.stop();
    });

    window.streamReference = null;
}

/* ================ Add Functions Above This ================ */
if(initAnnyang()){
    allowMicrophoneUse();
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
