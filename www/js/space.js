var nameSongSelected='';
var hrefSong='';
var lat='51.523777878854176';
var long='-0.04055500030517578';
var placeId='';
var placeName='';
var idSongObj='';





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
        
        navigator.geolocation.getCurrentPosition(savePosition);
    } else {
        error('Geolocation is not supported.');
    }
}


function savePosition(position)
{
    alert("inside");
    localStorage.lat= position.coords.latitude;
    localStorage.long= position.coords.longitude;	
    
    getPlaces();
    
}




function getPlaces(){
    
    
    
                
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




