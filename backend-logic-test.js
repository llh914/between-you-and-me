//Setting intial variables.
var lat1=0;

var lng1=0;

var lat2=0;

var lng2=0;

var map;

var infowindow;

var favName = JSON.parse(localStorage.getItem("keyName"));

var favAddress = JSON.parse(localStorage.getItem("keyAddress"));

var favRating = JSON.parse(localStorage.getItem("keyRating"));

var favDirections = JSON.parse(localStorage.getItem("keyDirections"));

var directionsURL;

//Checking for previously saved Favorites; if there are some, populate favorites list
if (favName === null) {
    favName = [];
    favAddress = [];
    favRating = [];
    favDirections= [];
} else {
    for (var i=0; i<favName.length; i++){
    $("#saved-favorites").append('<div class="saved-fav" data-index="' + [i] + '""><p id="saved-fav-title"><button type="button" class="close" id="delete">&times;</button>'+ favName[i] + "</p>"
        + "<p>" + favAddress[i] + "</p>"
        + "<p>Rating: " + favRating[i] + "/5</p>"
        + '<a href="'+ favDirections[i] + '" target="_blank">Get Directions</a></div>')
    }
};

//jQuery selector on submit button
$("#button-submit").click(function() {
	var address1 = $("#autocomplete").val().trim();
	var address2 = $("#autocomplete2").val().trim();

    var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1;
    var queryURL2 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address2;

    //Ajax call to Google geometry API to gather latitude and longitudes of addresses.
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

    //Midpoint function using Google's Geometry API to calculate midpoint between two locations.
    function getMidPoint(lat1,lng1,lat2,lng2) {
    	var xPlace = new google.maps.LatLng(lat1, lng1);
    	var yPlace = new google.maps.LatLng(lat2, lng2);

    	var midpointLat = google.maps.geometry.spherical.interpolate(xPlace, yPlace, 0.5).lat();
    	var midpointLng = google.maps.geometry.spherical.interpolate(xPlace, yPlace, 0.5).lng();

    	newMap(midpointLat, midpointLng)
    };

    //Creates map using midpoint latitude/longitude as search location.
    function newMap(midLat, midLng) {
    	var searchLocation = {lat: midLat, lng: midLng};

    	map = new google.maps.Map(document.getElementById('map'), {
    	  center: searchLocation,
    	  zoom: 15
    	});

    	//Create marker for Address 1
    	var marker1 = new google.maps.Marker({
        position: {lat: lat1, lng: lng1},
        map: map,
        title: 'Me',
        icon:  {
        	path: google.maps.SymbolPath.CIRCLE,
        	scale: 10,
        	strokeColor: "#00b7ce"
        	}
        });

        google.maps.event.addListener(marker1, 'click', function() {
    		var contentString = "<span class='info-title'>Me: </span>" + address1;

    		infowindow.setContent(contentString);
    		
    		infowindow.open(map, this);
    	});

    	//Create marker for Address 2
        var marker2 = new google.maps.Marker({
        position: {lat: lat2, lng: lng2},
        map: map,
        title: 'You',
        icon:  {
        	path: google.maps.SymbolPath.CIRCLE,
        	scale: 10,
        	strokeColor: "#00b7ce"
        	}
      	});

      	google.maps.event.addListener(marker2, 'click', function() {
    		var contentString = "<span class='info-title'>You: </span>" + address2;

    		infowindow.setContent(contentString);
    		
    		infowindow.open(map, this);
    	});

    	//Call to Google's text search API to search mipoint location with user-specified search parameters.
    	infowindow = new google.maps.InfoWindow();

    	var service = new google.maps.places.PlacesService(map);

    	var placeType = $("#place-dropdown").val();

    	service.textSearch({
    		location: searchLocation,
    	  	radius: 500,
    	  	type: placeType
    	}, callback);

	//Map styling
  	var styledMapType = new google.maps.StyledMapType(

        [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6195a0"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": "0"
                    },
                    {
                        "saturation": "0"
                    },
                    {
                        "color": "#f5f5f2"
                    },
                    {
                        "gamma": "1"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": "-3"
                    },
                    {
                        "gamma": "1.00"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                  {
                      "hue": "#6fc6ca"
                  },
                ]
            },
            {
                "featureType": "poi.restaurant",
                "elementType": "all",
                "stylers": [
                  {
                      "hue": "#6fc6ca"
                  },
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#bae5ce"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#fac9a9"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#787878"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "hue": "#0a00ff"
                    },
                    {
                        "saturation": "-77"
                    },
                    {
                        "gamma": "0.57"
                    },
                    {
                        "lightness": "0"
                    }
                ]
            },
            {
                "featureType": "transit.station.rail",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#43321e"
                    }
                ]
            },
            {
                "featureType": "transit.station.rail",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "hue": "#ff6c00"
                    },
                    {
                        "lightness": "4"
                    },
                    {
                        "gamma": "0.75"
                    },
                    {
                        "saturation": "-68"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#eaf6f8"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c7eced"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": "-49"
                    },
                    {
                        "saturation": "-53"
                    },
                    {
                        "gamma": "0.79"
                    }
                ]
            }
        ],
        {name: 'Styled Map'});
    	map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
    };

    //Callback to confirm successful API call.
    function callback(results, status) {
    	if (status === google.maps.places.PlacesServiceStatus.OK) {
    	  for (var i = 0; i < results.length; i++) {
    	    createMarker(results[i]);
    	  }
    	}
    };

    //Create map markers.
    function createMarker(place) {
    	directionsURL = "https://www.google.com/maps?q=" + place.formatted_address + '"';
    	var marker = new google.maps.Marker({
    	  map: map,
    	  position: place.geometry.location
    	});

    	//Insert name, address, rating, and directions into marker info-windows. Revealed when clicked.
    	google.maps.event.addListener(marker, 'click', function() {
            var data = 'data-name="' + place.name + '" data-address="' + place.formatted_address + '" data-rating="' + place.rating + '" data-directions="'+ directionsURL + '" data-saved="false"';
    		var contentString = '<div class="window-title">' + place.name + '</div>' 
    		+ '<div class="window-content"><p>' + place.formatted_address + '</p></div>'
    		+ '<div class="window-rating"><p>Rating: ' + place.rating + ' out of 5</p></div>'
    		+ '<div class="window-directions"><a href="' + directionsURL + '" target="_blank">Get Directions</a></div>'
            + '<div class="window-favorites"' + data + '><a>Save to Favorites</a></div>';

    		infowindow.setContent(contentString);
    		
    		infowindow.open(map, this);
    	});
    }
});

//Save to Favorites
$(document).on("click", ".window-favorites", function() {
    $('#favorites-tab, #favorites').addClass('active');
    $('#search-tab, #search').removeClass('active');

    if ($(this).attr("data-saved") === "false"){
        var newDiv = $('<div>');
        newDiv.addClass('saved-fav');
        newDiv.attr('data-index', favName.length);
        newDiv.html('<p id="saved-fav-title"><button type="button" class="close" id="delete">&times;</button>' + $(this).attr("data-name") + '</p>' 
            + '<p>' + $(this).attr("data-address") + '</p>'
            + '<p>Rating: ' + $(this).attr("data-rating")  + '/5</p>'
            + '<a href="'+ $(this).attr('data-directions') + '" target="_blank">Get Directions</a>')

        $("#saved-favorites").append(newDiv);

        favName.push($(this).attr("data-name"));
        favAddress.push($(this).attr("data-address"));
        favRating.push($(this).attr("data-rating"));
        favDirections.push($(this).attr('data-directions'))

        localStorage.setItem("keyName", JSON.stringify(favName));
        localStorage.setItem("keyAddress", JSON.stringify(favAddress));
        localStorage.setItem("keyRating", JSON.stringify(favRating));
        localStorage.setItem('keyDirections', JSON.stringify(favDirections));

        $(this).attr("data-saved", "true");
    }
});

$(document).on('click', '#delete', function() {
    var currentIndex = $(this).parent().parent().attr('data-index');

    $(this).parent().parent().remove();

    favName.splice(currentIndex, 1);
    favAddress.splice(currentIndex, 1);
    favRating.splice(currentIndex, 1);
    favDirections.splice(currentIndex, 1);

    localStorage.setItem("keyName", JSON.stringify(favName));
    localStorage.setItem("keyAddress", JSON.stringify(favAddress));
    localStorage.setItem("keyRating", JSON.stringify(favRating));
    localStorage.setItem("keyDirections", JSON.stringify(favDirections));
})