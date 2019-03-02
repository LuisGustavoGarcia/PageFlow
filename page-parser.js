// This file will handle DOM parsing
const BREAKER = '↵';
// Use Jquery to write to the end of the body tag.
// //$("body").append("TEST");
// const bodyTag = $('body')[0];
// console.log($('body'));
// bodyTag.childNodes.forEach(node => {
//     // console.log(node['nodeName']);
//     if (node && node['nodeName'] !== '#text' && node['nodeName'] !== 'SCRIPT') {
//         // console.log(node);
//     } 
// });
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