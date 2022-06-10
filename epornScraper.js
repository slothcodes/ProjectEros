

function splitSearchString(searchString){
    const splitString = searchString.split(' ');   
    const finalSearchString = splitString.join('+')
    return finalSearchString
}

function createSearchReq(searchString,tagsArray,page){
    const searchQuery = splitSearchString(searchString)
    const searchTags = tagsArray.join('+')
    const searchURL = 'https://www.eporner.com/api/v2/video/search/?query=' + searchQuery + '&' + searchTags + '&per_page=100&page=' + page + '&thumbsize=big&order=top-weekly&gay=0&lq=1&format=json';
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
    return vidsJSON
}

async function searchEporner(searchString,tagsArray,page){
    const searchInput = createSearchReq(searchString, tagsArray,page);
    console.log(searchInput)
    const searchResults = await fetchVideoResults(searchInput);
    //console.log(searchResults)
    //console.log('complete')
    return searchResults
}

module.exports = {searchEporner}
//const searchResults = searchEporner('naked dancing',['asian','petite','dancing'])