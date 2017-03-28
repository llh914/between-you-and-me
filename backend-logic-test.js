var address1 = "2908+N+Spaulding+Ave+Chicago";

var address2 = "71+East+Division+St+Chicago";

var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1;

var queryURL2 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address2;

var apiKey = "AIzaSyCdhuy2CgWUiYNPHMFduiz4Jp_7xebQbpkz"

var lat1=0;

var lng1=0;

var lat2=0;

var lng2=0;

var map;

var infowindow;

$.ajax({
	url: queryURL1,
	method: "GET"
}).done(function(response) {
	var result = response.results;

	lat1 = result[0].geometry.location.lat;

	lng1 = result[0].geometry.location.lng;
	console.log(lat1)
	console.log(lng1)

	$.ajax({
		url: queryURL2,
		method: "GET"
	}).done(function(response) {
	var result = response.results;

	lat2 = result[0].geometry.location.lat;

	lng2 = result[0].geometry.location.lng;
	console.log(lat2)
	console.log(lng2)

	getMidPoint(lat1,lng1,lat2,lng2);
	});
});

function getMidPoint(lat1,lng1,lat2,lng2) {
	var xPlace = new google.maps.LatLng(lat1, lng1);
	var yPlace = new google.maps.LatLng(lat2, lng2);

	var midpointLat = google.maps.geometry.spherical.interpolate(xPlace, yPlace, 0.5).lat();
	var midpointLng = google.maps.geometry.spherical.interpolate(xPlace, yPlace, 0.5).lng();
	console.log(midpointLat)
	console.log(midpointLng)

	initMap(midpointLat, midpointLng)
}

function initMap(midLat, midLng) {
	console.log(midLat)
	console.log(midLng)
var searchLocation = {lat: midLat, lng: midLng};

map = new google.maps.Map(document.getElementById('map'), {
  center: searchLocation,
  zoom: 15
});

infowindow = new google.maps.InfoWindow();
var service = new google.maps.places.PlacesService(map);
service.textSearch({
	  location: searchLocation,
	  radius: 500,
	  type: ['restaurant']
	}, callback);
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
	  for (var i = 0; i < results.length; i++) {
	    createMarker(results[i]);
	  }
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		var contentString = '<div class="window-title"><h4>' + place.name + '</h4></div>' 
		+ '<div class="window-content"><p>' + place.formatted_address + '</p></div>'
		+ '<div class="window-rating"><p>Rating: ' + place.rating + ' out of 5</p></div>'1;
		infowindow.setContent(contentString);
		infowindow.open(map, this);
	});
}



