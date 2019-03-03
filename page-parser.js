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
            $(div).replaceWith($(div).children());
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
            } else {
                // search inside another other type of tag for the above tags
                traverseElements(nextElement.firstElementChild, header);
            }
            // go to the next sibling
            traverseElements(nextElement.nextElementSibling, header);
        }
        // TODO: Make enable/disable, fix page breaking
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
