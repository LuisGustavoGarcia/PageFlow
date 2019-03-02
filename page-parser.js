// This file will handle DOM parsing

// Use Jquery to write to the end of the body tag.
//$("body").append("TEST");


// How to send messages back and forth between background.js and page-parser.js
// var port = chrome.runtime.connect({name: "joke"});
// port.postMessage({joke: "Why are Canadians so good at sports?"});
// port.onMessage.addListener(function(msg) {
//   if (msg.question == "Why?")
//   {
//     console.log("This ran1");
//     port.postMessage({answer: "They always bring their eh game"});
//   }
// });