var nameSongSelected='';
var hrefSong='';

var placeId='';
var placeName='';
var idSongObj='';

function showMap(){
navigator.geolocation.getCurrentPosition(function(data) {
                                         localStorage.lat = data['coords']['latitude'];
                                         localStorage.lng = data['coords']['longitude']; 
                                         getPlacesMap();
                                         });
}


function getPlacesMap(){
   
    alert("localStorage.lat"+localStorage.lat);
    var myLatlng = new google.maps.LatLng(localStorage.lat, localStorage.lng);
    
    var myOptions = {
    center: myLatlng,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map_element = document.getElementById("map_canvas");
    var map2 = new google.maps.Map(map_element, myOptions);
   
    
    FB.api('search?center='+localStorage.lat+','+localStorage.lng, { limit: 10, type: 'place', distance : 1000 }, function(response) {
           
           var place=response.data[0];
           var i=0;
           
           while(((typeof(place)) != 'undefined') && (i<10)){
           
           
           var latitudeAndLongitudeOne = new google.maps.LatLng(place.location.latitude,place.location.longitude);
           
           var markerOne = new google.maps.Marker({
                                                  position: latitudeAndLongitudeOne,
                                                  map: map2
                                                  });
           
                      
           showGenre(place.id, place.name);
      
           
           
           i++;
           place=response.data[i];
           
           }
        
           
           }); 
    
    
    
}

function showGenre(venueID, placeName){
   
    var VenuesGenre = Parse.Object.extend("VenuesGenre");
    var query = new Parse.Query(VenuesGenre);
    query.equalTo("venueID", venueID);
    query.find({
                success: function(results) {
                
                if(results.length>0){
               
                $("#listPlacesNow").append('<li><a href="#" ><h3>'+results[0].get("venueID")+' ('+results[0].get("genre")+')</h3></a></li>');
                }else{
                var venuesTracks = Parse.Object.extend("VenuesTracksTest");
                var query = new Parse.Query(venuesTracks);
                query.equalTo("venueID", venueID); //add to the query "only the last 20 songs"
                
                query.find({
                           success: function(results) {
                           if(results.length>0){
                           
                           getTopGenreForSpecificVenue(venueID);
                           setTimeout('showGenre('+venueID+','+placeName+')', 1000);
                           }else{
                           
                           $("#listPlacesNow").append('<li><a href="#" ><h3>'+placeName+'</h3></a></li>');
                             $("#listPlacesNow").listview('refresh');
                           }
                           
                           },
                           error: function(error) {
                           alert("Error: " + error.code + " " + error.message);
                           }
                           });
                }
                
                },
                error: function(error) {
                
                
                
                

                }
                });
    
    
    
    
    
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
    $("#listResults").empty();
    var track=data.tracks[0];
    var i=0;
    
    while(((typeof(track)) != 'undefined') && (i<10)){
       
        var artistString= track.artists[0].href;
       
       artistStringA=artistString.split(":");
       
        artistID=artistStringA[2];
        
        var pars="'"+track.name+"','"+track.href+"','"+artistID+"'";
        $("#listResults").append('<li><a href="#location" onclick="saveSong('+pars+');"><h3>'+track.name+' ('+track.artists[0].name+') </h3></a></li>');
        i++;
        track=data.tracks[i];
        
    }
    $("#listResults").listview('refresh');
    
    
}

function saveSong(name, href, artistID){
    
     localStorage.nameSongSelected=name;
     localStorage.trackID=href;
    localStorage.artistID=artistID;
    getLocations();
}





function getLocations()
{
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(data) {
                                                  localStorage.lat = data['coords']['latitude'];
                                                 localStorage.lng = data['coords']['longitude'];
                                                 alert("Lat"+localStorage.lat+"Long"+localStorage.lng);
                                                 getPlaces();}
                                                 );
      
    } else {
        error('Geolocation is not supported.');
    }
}







function getPlaces(){
    $("#listResultsLocations").empty();
    FB.api('search?center='+localStorage.lat+','+localStorage.lng, { limit: 10, type: 'place', distance : 1000 }, function(response) {
           
           var place=response.data[0];
           var i=0;
           
           while(((typeof(place)) != 'undefined') && (i<10)){
           var pars="'"+place.id+"','"+place.name+"','"+place.location.latitude+"','"+place.location.longitude+"'";
           $("#listResultsLocations").append('<li><a href="#presend" onclick="savePlace('+pars+');"><h3>'+place.name+' </h3></a></li>');
           i++;
           place=response.data[i];
           
           }
           $("#listResultsLocations").listview('refresh');
           
           }); 

    
                
}

function savePlace(id,name,latitude,longitude){
    
    localStorage.venueId=id;
    localStorage.venueName=name;
    lat=localStorage.lat;
    long=localStorage.long;
    setValuestoShow();
    
}

function setValuestoShow(){
    
    $("#songNameShow").append(""+localStorage.nameSongSelected+"at "+localStorage.venueName);
   
}



function saveTrackMusic(){
    var VenuesTracksTest = Parse.Object.extend("VenuesTracksTest");
    var venueTrack = new VenuesTracksTest();
    venueTrack.set("artistID", localStorage.artistID);
    venueTrack.set("trackID", localStorage.trackID);
    venueTrack.set("venueID", localStorage.venueId);
    venueTrack.set("venueName", localStorage.venueName);
    
    venueTrack.save(null, {
                   success: function(venueTrack) {
                    return true;
                   },
                   error: function(venueTrack, error) {
                    alert("error");
                    return false;
                   }
                   });
}




