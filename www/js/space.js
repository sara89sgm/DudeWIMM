var nameSongSelected='';
var hrefSong='';

var placeId='';
var placeName='';
var idSongObj='';

/* FOURSQUARE */

var config = {
apiKey: 'T453P2YRIR0F3EAT4EHD2NX3RAUJIAJATTCJX2DM5H3CYHVY',
authUrl: 'http://www.dudewimm.com',
apiUrl: 'https://api.foursquare.com/'
};

/* Attempt to retrieve access token from URL. */
function doAuthRedirect() {
    var redirect = window.location.href.replace(window.location.hash, '');
    var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id=' + config.apiKey +
    '&redirect_uri=' + encodeURIComponent(redirect) +
    '&state=' + encodeURIComponent($.bbq.getState('req') || 'users/self');
    window.location.href = url;
};

if ($.bbq.getState('access_token')) {
    // If there is a token in the state, consume it
    var token = $.bbq.getState('access_token');
    $.bbq.pushState({}, 2)
} else if ($.bbq.getState('error')) {
} else {
    doAuthRedirect();
}



function searchSong(){ 
    var name= $("#songName").val();
    alert("name");
    var url="http://ws.spotify.com/search/1/track.json?q="+name;
    url=encodeURI(url);
    $.ajax({
           url: url,
           dataType: "json",
           success: function(data, textStatus, jqXHR){
           
           fillResults(data);
           },
           error: function(jqXHR, textStatus, errorThrown){
           alert('login error: ' + textStatus);
           }
           });
    
}


function fillResults(data){
    var track=data.tracks[0];
    var i=0;
    
    while(((typeof(track)) != 'undefined') && (i<10)){
        var pars="'"+track.name+"','"+track.href+"'";
        $("#listResults").append('<li><a href="#location" onclick="saveSong('+pars+');"><h3>'+track.name+' ('+track.artists[0].name+') </h3></a></li>');
        i++;
        track=data.tracks[i];
        
    }
    $("#listResults").listview('refresh');
    
    
}

function saveSong(name, href){
    
    nameSongSelected=name;
    hrefSong=href;
    getPlaces();
}





function getLocations()
{
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(data) {
                                                  localStorage.lat = data['coords']['latitude'];
                                                 localStorage.lng = data['coords']['longitude'];
                                                 getPlaces();}
                                                 );
      
    } else {
        error('Geolocation is not supported.');
    }
}







function getPlaces(){
    
    /* Query foursquare API for venue recommendations near the current location. */
    $.getJSON(config.apiUrl + 'v2/venues/explore?ll=' + localStorage.lat + ',' + localStorage.lng + '&oauth_token=' + window.token, {}, function(data) {
              venues = data['response']['groups'][0]['items'];
              /* Place marker for each venue. */
              for (var i = 0; i < venues.length; i++) {
              /* Get marker's location */
              var latLng = new L.LatLng(
                                        venues[i]['venue']['location']['lat'],
                                        venues[i]['venue']['location']['lng']
                                        );
              alert("venue"+venues[i]['venue']['name']);
              }
              });

    
                
}

function savePlace(id,name,latitude,longitude){
    
    placeId=id;
    placeName=name;
    lat=localStorage.lat;
    long=localStorage.long;
    setValuestoShow();
    
}

function setValuestoShow(){
    alert(nameSongSelected+placeName);
    $("#songNameShow").append(""+nameSongSelected);
    $("#placeShow").append(""+placeName);
    $("#titleSong").val(nameSongSelected);
    
    $("#idPlace").val(placeId);
    $("#urlSong").val(hrefSong);
}

function sendAction(){
    saveTrack();
    
}

function saveTrack(){
    var Track = Parse.Object.extend("Track");
    var track = new Track();
    track.save({title: nameSongSelected,
               url: hrefSong,
               idPlace: placeId,
               namePlace: placeName}, {
               success: function(object,result) {
               
               $("#idSongH").val(result.objectId);
               idSongObj=result.objectId;
               alert("yay! You are dancing in the DB!!!");
               
               return true;
               }
               });
}




