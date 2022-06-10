// [X] Check String For Non Latin Characters
// [X] Check List For Duplicates
// [X] USE WRITESTREAM TO Save RESULT AND KEYWORD Files For Each Keyword
// [X] Save ToDo And Used Keyword Lists
//      [X] Update Write File To Avoid Joining Keywords Instead Save As New Line
// [ ] Figure Out Why AllResults Is Not Filtering

const fs = require('fs');
const RedTube = require('./redTubeAPIscraper')
const Eporner = require('./epornScraper.js')

let ToDoKeywords = ['crazy','rich','cheerleader','gamer','black','asian'];
let usedKeyWords = ['anal'];
let allResults = [];

async function redSearch(){
        for (x=0;x<ToDoKeywords.length;x++){
        let results = await redIterate(ToDoKeywords[0])
        usedKeyWords.push(ToDoKeywords[0])
        ToDoKeywords.splice(0,1)
        saveResultsAppend(results,'results','');
        saveKeywords(ToDoKeywords,'ToDoKeywords')
        saveKeywords(usedKeyWords,'usedKeywords')
        };    
}


async function ESearch(){
    try{ 
        for (x=0;x<ToDoKeywords.length;x++){
            let results = await ePornerIterate(ToDoKeywords[0])
            usedKeyWords.push(ToDoKeywords[0])
            ToDoKeywords.splice(0,1)
            saveResultsAppend(results,'results','');
            saveKeywords(ToDoKeywords,'ToDoKeywords')
            saveKeywords(usedKeyWords,'usedKeywords')
        };    
        return 
    } catch {
        saveKeywords(ToDoKeywords,'ToDoKeywords')
        saveKeywords(usedKeyWords,'usedKeywords')
    }
}

function checkUsedKeywords(targetKW){
    if (!usedKeyWords.includes(targetKW)){
        if (!ToDoKeywords.includes(targetKW)){
            ToDoKeywords.push(targetKW)
        }
    }
    return
}

function nonLatinCheck(inputString){
    return /^[a-zA-Z\s.,]+$/.test(inputString);
}

function checkDupes(testEntry){
    // RETURNS TRUE IF DUPLICATE HAS BEEN FOUND
    let alreadySeen = allResults.includes(testEntry);
    return alreadySeen
}

function statusUpdate(searchKW,x,numOfPages){
    console.clear();
    console.log('Searched: ' + usedKeyWords.length);
    console.log('To Be Searched: ' + ToDoKeywords.length);
    console.log('Result Length: ' + allResults.length);
    console.log('Keyword: ' + searchKW);
    console.log('Page: ' + x + '/' + numOfPages);
    
}

async function redIterate(searchKW){
    let searchResults = await RedTube.searchRedTube(searchKW,[searchKW],1)
    let countJSON = await searchResults.count
    let videoJSON = await searchResults.videos
    let resultList = []
    const numberOfPages = Math.floor(countJSON/20);
    if (numberOfPages > 1){
        for (let x=1;x< numberOfPages;x++){
            statusUpdate(searchKW,x,numberOfPages);
            //console.log(resultList.length)
            try{
                let searchResults = await RedTube.searchRedTube(searchKW,[searchKW],x)
                // Split Below Into New Function
                // INCLUDE NONLATIN AND DUPE CHECK FUNCTIONS IN NEW FUNCTION FOR BELOW
                searchResults.videos.forEach(data =>{
                    let resultString = data.video.title.replace(/\s\s+/g, ' ')
                    // IF NON LATIN CHARS SKIP
                    
                    data.video.tags.forEach(element =>{
                        checkUsedKeywords(element.tag_name)
                        resultString = resultString + ' ' + element.tag_name
                            // IF DUPE SKIP                
                    })  

                    if (nonLatinCheck(resultString)){ 
                        //console.log('pass latin test ' + resultString )   
                        if(!checkDupes(resultString)){ 
                            //console.log('no dupes')
                            resultList.push(resultString)// + '\n')
                            allResults.push(resultString)// + '\n')
                        }

                    }
                    
                });
            }
            catch(e){
                console.error(e.name + ': ' + e.message)
                const errorMess = e.message;
                //saveKeywords(ToDoKeywords,'ToDoKeywords')
                saveErrorFile(e.message + '\n' + e + '\n' + Object.keys(searchResults),'errorFile')
                return resultList
            }
        }
    }

    return resultList
}

async function ePornerIterate(searchKW){
    let searchResults = await Eporner.searchEporner(searchKW,[searchKW],1)
    //console.log(searchResults)
    let countJSON = await searchResults.total_pages
    let videoJSON = await searchResults.videos
    let resultList = []
    //console.log(countJSON)
    const numberOfPages = countJSON;//Math.floor(countJSON/100);
    //console.log(numberOfPages)
    if (numberOfPages > 1){
        for (let x=1;x< numberOfPages;x++){
            statusUpdate(searchKW,x,numberOfPages);
            //console.log(resultList.length)
                let searchResults = await RedTube.searchRedTube(searchKW,[searchKW],x)
                console.log('search results \n' + Object.keys(searchResults))
                console.log('search results \n' + searchResults.message)
                // Split Below Into New Function
                // INCLUDE NONLATIN AND DUPE CHECK FUNCTIONS IN NEW FUNCTION FOR BELOW
                searchResults.videos.forEach(data =>{
                    let resultString = data.video.title.replace(/\s\s+/g, ' ')
                    //console.log('video title \n' + resultString)
                    // IF NON LATIN CHARS SKIP
                    //console.log('tag: ' + data.video.tags)
                    data.video.tags.forEach(element =>{
                        //console.log('tag: ' + element)
                        checkUsedKeywords(element.tag_name)
                        resultString = resultString + ' ' + element.tag_name
                            // IF DUPE SKIP                
                    })  

                    if (nonLatinCheck(resultString)){ 
                        //console.log('pass latin test ' + resultString )   
                        if(!checkDupes(resultString)){ 
                            //console.log('no dupes')
                            resultList.push(resultString)// + '\n')
                            allResults.push(resultString)// + '\n')
                        }

                    }
                    
                });
        }
        // }catch(e){
        //     console.error(e.name + ': ' + e.message)
        //     const errorMess = e.message;
        //     saveKeywords(ToDoKeywords,'ToDoKeywords')
        //     saveErrorFile(e.message + '\n' + e + '\n' + Object.keys(searchResults),'errorFile')
        //     return resultList
        //     }
        // }
    }

    return resultList
}

function saveResultsAppend(results,name,seperator){
    let writeStream = fs.createWriteStream(name + '.txt', {flags: 'a'});
    
    results.forEach((item,index) => {
        //console.log((item));
        //let joinedResults = results.join(seperator,'utf-8')
        writeStream.write(item + '\n')
    })
}

function saveKeywords(keywords,name){
    let writeStream = fs.createWriteStream(name + '.txt');
    writeStream.write(keywords.join('\n'),'utf-8');
    //writeStream.end();
}

function loadSaveData(filename){
    const reader = fs.readFileSync(filename,'utf-8');
    const arr = reader.split(/\r?\n/);
    //console.log(arr);
    return arr

}

function ReInit(){
    ToDoKeywords = loadSaveData('ToDoKeywords.txt');
    usedKeyWords = loadSaveData('usedKeywords.txt');
    allResults = loadSaveData('results.txt')
}

function saveErrorFile(errorMessage,name,seperator){
    let writeStream = fs.createWriteStream(name + '.txt');
    console.log('writing error file');
    writeStream.write(errorMessage,'utf-8');
}

ReInit()
//const redResults = redSearch()
const eResults = ESearch();
//const eResults = ePornerIterate('asian',['asian'],1)

