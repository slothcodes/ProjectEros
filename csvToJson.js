const csvFilePath= 'YouPorn-Embed-Videos-Dump.csv'
const csv=require('csvtojson')
fs = require('fs');

console.log('Running')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    
    console.log('stringify json object');
    const data = JSON.stringify(jsonObj);
    console.log('saving file')
    fs.writeFile( 'youPornEmbeds.json', data, function (err) {
        if (err) return console.log(err);})
    //console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
})
 

