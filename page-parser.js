var current_index = 0;
var navigate_index = -1;
var enable = true;
var headers;
var delay = "...";
function setupPage() {
    // Use Jquery to write to the end of the body tag.
    if (enable) {
        const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        headers = [];
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

/* Create a port to send messages back and forth between background.js and page-parser.js */
var port = chrome.runtime.connect({name: "userInteraction"});
var recorder;
/* Send data to be read by the text-to-speech engine */
function sendReadData(dataStr){
    port.postMessage({tts: dataStr, annyang: false});
}

/* Take input from voice */
function takeInput(){
    port.postMessage({readonly: true});
}

/* Send data to be read by the text-to-speech engine, then take user voice input afterwards. */
function readAndTakeInput(dataStr){
    port.postMessage({tts: dataStr, annyang: true});
}

/* Initialize speech-to-text library */
function initAnnyang(){
    if(annyang){
        console.log("Initiating annyang");
        
        var commands = {
            "top (header)": function(){
                console.log("Start parsing:");
                annyang.abort();
                denyMicrophoneUse();
                current = headers[0];
                console.log("Current:", current);
                if(current && current.text.length > 0){
                    console.log("Current_text:", current.text);
                    readAndTakeInput(current.text);
                }
            },

            "details": function(){
                console.log("Header Details:");
                var current = headers[current_index].p;
                
                var all_p = "";
                for(var ultra of current){
                    if(ultra != "" && ultra != null){
                        console.log(ultra);
                        all_p += ultra + delay; // You figure it out.
                    }
                }
                annyang.abort();
                denyMicrophoneUse();
                if(all_p == ""){
                    var extra = "";
                    if(headers[current_index].a.length > 0){
                        extra = "However, there are links available.";
                    }
                    readAndTakeInput("There are no remaining details" + delay + extra);
                }else{
                    readAndTakeInput(all_p);
                }
            },

            "click (link)": function(){
                console.log("Clicking:");
                annyang.abort();
                denyMicrophoneUse();
                navigate_index = 0;
                var current = headers[current_index].a[navigate_index];
                window.location = current.data.href;
                console.log(current.text);
                readAndTakeInput("Clicking " + current.text);
            },

            "first link": function(){
                console.log("Navigating:");
                annyang.abort();
                denyMicrophoneUse();
                navigate_index = 0;
                var current = headers[current_index].a[navigate_index];
                console.log(current.text);
                readAndTakeInput(current.text);
            },

            "last link": function(){
                console.log("Navigating:");
                annyang.abort();
                denyMicrophoneUse();
                navigate_index = headers[current_index].a.length - 1;
                var current = headers[current_index].a[navigate_index];
                console.log(current.text);
                console.log(current);
                readAndTakeInput(current.text);
            },

            "next link": function(){
                console.log("Navigating:");
                annyang.abort();
                denyMicrophoneUse();
                navigate_index += 1;
                if(navigate_index >= headers[current_index].a.length){
                    navigate_index = 0;
                }
                var current = headers[current_index].a[navigate_index];
                console.log(current.text);
                readAndTakeInput(current.text);
            },

            "(all) links": function(){
                console.log("All links:");
                annyang.abort();
                denyMicrophoneUse();
                var current = headers[current_index].a;
                var all_links = "";
                for(var link of current){
                    all_links += link.text + delay;
                }
                console.log(all_links);
                navigate_index = -1;
                readAndTakeInput(all_links);
            },

            "next (header)": function(){
                console.log("Next element:");
                annyang.abort();
                denyMicrophoneUse();
                current_index+=1;
                if(current_index < headers.length){
                    var current = headers[current_index];
                    if(current && current.text.length > 0){
                        console.log(current.text);
                        readAndTakeInput(current.text);
                    }else{
                        console.log("Some error ocurred finding the next sibling.");
                    }
                }else{
                    readAndTakeInput("There are no more headers.");
                }
            },

            "stop": function(){
                console.log("stop:");
                annyang.abort();
                denyMicrophoneUse();
                sendReadData("Goodbye!");
                annyang.abort();
                denyMicrophoneUse();
            },

            "help": function(){
                console.log("help:");
                annyang.abort();
                denyMicrophoneUse();
                readAndTakeInput("Use the following commands to navigate the webpage: Start, Stop, Details, Next, Navigate");
            },
        }

        // Add new commands, overwriting any existing ones.
        annyang.addCommands(commands);

        // I think a result match is already being handled.
        //annyang.addCallback('resultMatch', handleResultMatch(result));
        //annyang.addCallback('resultNoMatch', handleResultNoMatch());
        return true;
    }else{
        return false;
    }
}

/* Verify your browser has GetUserMedia API */
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/* Prompt the user to allow their microphone to record audio. */
function allowMicrophoneUse(){
    var constraints = {audio: true};
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        window.streamReference = stream;
        recorder = new MediaRecorder(stream);
        recorder.start();
    });
}

/* Disable microphone's ability to record audio. */
function denyMicrophoneUse(){
    if(recorder.state == "inactive") return;

    recorder.stop();

    if (!window.streamReference) return;

    window.streamReference.getAudioTracks()[0].stop();

    window.streamReference = null;
}

/* ================ Add Functions Above This ================ */
if(initAnnyang()){
    readAndTakeInput("Page Flow is ready for input.");
}

/* Respond to messages from background.js here */
port.onMessage.addListener(function(msg){
    // Initialize
    if (msg.annyang == true){
        allowMicrophoneUse();
        // Ask user to allow microphone input.
        annyang.start({ autoRestart: true, continuous: true });
    }
});
