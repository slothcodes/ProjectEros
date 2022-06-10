const fs = require('fs');

const content = fs.readFileSync("YouPorn-Embed-Videos-Dump.csv", 'utf-8');

var textByLine = content.split("\n")
console.log(textByLine.length);
// fs.readFile('embed_source.csv', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   var text = fs.readFileSync("./mytext.txt");
//   var textByLine = text.split("\n")
//   console.log(textByLine[1]);
// });