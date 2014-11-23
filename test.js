/*
    vidInfo array are structured like so:
    [0: Title, 1: description, 2: publish date, 3: default thumbnail url]
*/

var apiKey = "AIzaSyCtBppALGmSX13Cn8lLSxYHs486cmSJadE";
var latestVidUrl;
var request;
var vidId;
var vidInfo;

function googleApiClientReady() {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        request = gapi.client.youtube.search.list({
            part: 'id',
            channelId: 'UCOYWgypDktXdb-HfZnSMK6A',
            maxResults: 1,
            type: 'video',
            order: 'date'
        });
        request.execute(function(response) {
            if(response.pageInfo.totalResults != 0) {
                vidId = response.result.items[0].id.videoId;
                //console.log(vidId);
                vidInfo = getVidInfo(vidId);
                console.log(vidInfo);
            }
        });
    }); 
}

function getEmbedCode(id){
    var baseURL = "http://www.youtube.com/watch?v="
    return baseURL + id.toString();
}

var returnArray = [4];

function getVidInfo(VidId){
    var vidRequest;
    var vidRequestResponse;
    vidRequest = gapi.client.youtube.videos.list({
        part: 'snippet',
        id: VidId
    });
    console.log(vidRequest);
    vidRequest.execute(function(response){
        //console.log(response.result);
        if(response.pageInfo.totalResults != 0) {
            returnArray[0] = response.result.items[0].snippet.title;
            returnArray[1] = response.result.items[0].snippet.description;
            returnArray[2] = response.result.items[0].snippet.publishedAt;
            //Check for HD thumbnail
            if (response.result.items[0].snippet.thumbnails.maxres.url){
                returnArray[3] = response.result.items[0].snippet.thumbnails.maxres.url
            }
            else {
                returnArray[3] = response.result.items[0].snippet.thumbnails.standard.url;
            }
           // console.log(returnArray);
            return returnArray;
        }
    });
}