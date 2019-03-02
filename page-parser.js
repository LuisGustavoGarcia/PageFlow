// This file will handle DOM parsing
// Use Jquery to write to the end of the body tag.
var h2Tags = $('h2');
// console.log(h2Tags);
var headers = [];
for (var index in h2Tags) {
    var h2Tag = h2Tags[index];
    if (h2Tag && h2Tag.innerText && h2Tag.innerText !== '') {
        var header = {'text': h2Tag.innerText.trim(), 'p': [], 'a': []};
        var nextElement = h2Tag.nextElementSibling;
        while (nextElement && nextElement.nodeName !== 'H2') {
            // TODO: if its a div, then look through childrensss
            if (nextElement.nodeName === 'P') {
                header['p'].push(nextElement.innerText);
            }
            else if (nextElement.nodeName === 'A') {
                header['a'].push(nextElement.innerText);
            }
            nextElement = nextElement.nextElementSibling;
        }
        headers.push(header);
    }
}

console.log(headers);
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
