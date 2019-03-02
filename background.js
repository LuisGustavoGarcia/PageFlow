// This file will handle speech and other chrome add-on functionality.

// How to send messages back and forth between background.js and page-parser.js
// chrome.runtime.onConnect.addListener(function(port) {
//     console.assert(port.name == "joke");
//     port.onMessage.addListener(function(msg) {
//       if (msg.joke == "Why are Canadians so good at sports?")
//       {
//         chrome.tts.speak(msg.joke, {
//             requiredEventTypes: ['end'],
//             onEvent: function(event) {
//                 if(event.type === 'end') {
//                     port.postMessage({question: "Why?"});
//                 }
//             }
//         });
//       }
//       else if (msg.answer == "They always bring their eh game")
//       {
//         chrome.tts.speak(msg.answer, {
//             requiredEventTypes: ['end'],
//             onEvent: function(event) {
//                 if(event.type === 'end') {
//                     port.postMessage({response: "That sucked."});
//                 }
//             }
//         });
//       }
//     });
// });