/*
    vidInfo array are structured like so:
    [0: id, 1: Title, 2: description, 3: publish date, 4: default thumbnail url]
*/

var apiKey = "AIzaSyCtBppALGmSX13Cn8lLSxYHs486cmSJadE";
var latestVidUrl;

$(document).ready(function () {
    // body...
});

var vidInfoCallback = function(data){
    for (obj in data) {
        console.log(data[obj]);
    }
    displayVideo(data[1],data[0],data[2],"#latestVidTitle","#latestVidContainer","#latestVidDescription");
}

function googleApiClientReady() {
    console.log("Google api loaded");
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        var request;
        request = gapi.client.youtube.search.list({
            part: 'id',
            channelId: 'UCOYWgypDktXdb-HfZnSMK6A',
            maxResults: 1,
            type: 'video',
            order: 'date'
        });
        request.execute(function(response) {
            if(response.pageInfo.totalResults != 0) {
                var vidId = response.result.items[0].id.videoId;
                console.log(vidId);
                getVidInfo(vidId, vidInfoCallback);
            }
        });
    }); 
}

function getEmbedURL(id){
    var baseURL = "https://www.youtube.com/embed/"
    console.log(baseURL + id);
    return baseURL + id.toString();
}

function getVidInfo(VidId,callback){
    var vidRequest;
    var vidRequestResponse;
    var returnArray = [VidId];
    var canReturn = false;
    gapi.client.youtube.videos.list({
        part: 'snippet',
        maxResults: 1,
        id: VidId
    }).then(function(response){
        if(response.result.pageInfo.totalResults != 0) {
            returnArray[1] = response.result.items[0].snippet.title;
            returnArray[2] = response.result.items[0].snippet.description;
            returnArray[3] = response.result.items[0].snippet.publishedAt;
            //Check for HD thumbnail
            if (response.result.items[0].snippet.thumbnails.maxres.url){
                returnArray[4] = response.result.items[0].snippet.thumbnails.maxres.url
            }
            else {
                returnArray[4] = response.result.items[0].snippet.thumbnails.standard.url;
            }
        }
        else{
            returnArray[0] = false;
            returnArray[1] = false;
            returnArray[2] = false;
            returnArray[3] = false;
            returnArray[4] = false;
        }
        return returnArray;
    }).then(function(array){    
        callback(array);
    });
    //return returnArray;
}

function displayVideo (title,id,description,titleId,embedId,descId) {
    var dom_title = $(titleId);
    var dom_embed = $(embedId);
    var dom_desc  = $(descId );
    console.log(title);
    $("#latestVidTitle").text(title);
    console.log(id);
    var embedHtml = "<iframe width='1280' height='750' src='" + getEmbedURL(id) + "' frameborder='1' allowfullscreen> </iframe>";

    dom_embed.html(embedHtml);

    description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');

    dom_desc.html(description);
}