
//E-porner API
const epornerAPI = 'https://www.eporner.com/api/v2/';

// RedTube API

// Get Tag List

function countObjItems(j){
    let count = Object.keys(j).length
    let props = Object.keys(j)
    console.log(props)
    console.log('total props: ' + count)
}


async function fetchTags(){
    const tagsURL = 'https://api.redtube.com/?data=redtube.Tags.getTagList&output=json';
    const tagList = [];

    const response = await fetch(tagsURL)
    const tagsJSON = await response.json()
    console.log(tagsJSON)
    for (key in tagsJSON['tags']){
        const tagObj = tagsJSON['tags'][key]['tag']['tag_name']//[subKey]
        console.log(tagObj)
        tagList.push(tagObj)
    }
    console.log(tagList.length)
}

//fetchTags();

// FETCH VIDEOS FOR GIVEN TAG

function splitSearchString(searchString){
    
    const splitString = searchString.split(' ');   
    const finalSearchString = splitString.join('+')
    return finalSearchString
}

function createSearchReq(searchString,tagsArray,page){
    //console.log(searchString,tagsArray)
    const searchQuery = searchString//splitSearchString(searchString)
    const searchTags = tagsArray//tagsArray.join('+')
    const searchURL = 'https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&search=' + searchQuery + '&[' + searchTags + ']=Teen&thumbsize=medium&page=' + page;
    //console.log(searchURL)
    return searchURL
}

async function fetchVideoResults(searchURL){
    const response = await fetch(searchURL);
    const vidsJSON = await response.json();
    //const vidObj = await vidsJSON.videos
    //console.log(vidsJSON)
    //console.log(Object.keys(vidsJSON.videos))
    //console.log(Object.keys(vidsJSON.videos[1].video))
    return vidsJSON//vidObj
}

async function searchRedTube(searchString,tagsArray,page){
    const searchInput = createSearchReq(searchString, tagsArray,page);
    const searchResults = await fetchVideoResults(searchInput);
    //console.log(typeof(searchResults))
    return await searchResults
    //
    //console.log('complete')
}

async function returnResults(query,tags){
    const searchInput = createSearchReq(query, tags);
    const searchJSON = fetch(searchInput)
    .then(response => {
        response.json()
    })
    .then(data => { 
        return data.videos;
    })

    return searchJSON
    //const searchResults = await fetchVideoResults(searchInput);
}

//const r = returnResults('hot asian girls',['asian','big','boobs'])
//console.log(r)
module.exports =  {  searchRedTube }