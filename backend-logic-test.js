var address1 = "2908+N+Spaulding+Ave+Chicago";

var address2 = "71+East+Division+St+Chicago";

var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1;

var queryURL2 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address2;

var apiKey = "AIzaSyCdhuy2CgWUiYNPHMFduiz4Jp_7xebQbpkz"

var lat1=0;

var lng1=0;

var lat2=0;

var lng2=0;

$.ajax({
	url: queryURL1,
	method: "GET"
}).done(function(response) {
	var result = response.results;

	lat1 = result[0].geometry.location.lat;

	lng1 = result[0].geometry.location.lng;

	$.ajax({
		url: queryURL2,
		method: "GET"
	}).done(function(response) {
	var result = response.results;

	lat2 = result[0].geometry.location.lat;

	lng2 = result[0].geometry.location.lng;

	getMidPoint(lat1,lng1,lat2,lng2);
	});
});

function getMidPoint(lat1,lng1,lat2,lng2) {
	var xPlace = new google.maps.LatLng(lat1, lng1);
	var yPlace = new google.maps.LatLng(lat2, lng2);

	var midpointLat = google.maps.geometry.spherical.interpolate(xPlace, yPlace, 0.5).lat();
	var midpointLong = google.maps.geometry.spherical.interpolate(xPlace, yPlace, 0.5).lng();

	getZip(midpointLat,midpointLong);
};

function getZip(midpointLat,midpointLong) {
	$.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
		+ midpointLat 
		+ "," 
		+ midpointLong,
		method: "GET"
	}).done(function(response){
		var result = response.results;

		var midAddress = result[0].formatted_address;
		console.log(midAddress);
	})

}