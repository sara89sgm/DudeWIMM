//require idpub
//returns top genre played in the pub
function getTopGenreForSpecificVenue(venueID) {
	 
	var artists[] = getArtistsForSpecificVenue(venueID);
	var genres[][] = getGenres(artists);
	return topGenres(genres);
}

//require venueID
//returns array containing the artists of last 20 songs played in a specific venue
function getArtistsForSpecificVenue(venueID) {

	//do some magic with the database and get the list of artists played in a specific venue
	var VenueTracks = Parse.Object.extend("VenuesTracksTest");
	var query = new Parse.Query(VenuesTracks);
	query.equalTo("venue", venueID); //add "the last 20 songs"
	
	query.find({
  		success: function(results) {
    		alert("Successfully retrieved " + results.length + " scores.");
  		},
  		error: function(error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});
	
	//get just the artists from the Object and put them in artists[]
	
}

//require array of artists
//returns array[][] of the first 5 genres for every artist
function getGenres(artists[]) {
	
	//artists[] --> genres[artist][genre]
}


//require array[][] of the first 5 genres for every artist
//returns the most common genre accross all the artists
function topGenres(genres[][]) {
	
	//count which genre has more occurrences
}


