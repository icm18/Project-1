
$("#mcTable").hide();

var markers = [];

function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            console.log("markers", markers[i]);
        markers[i].setMap(null);
    }
}
setMapOnAll(null);



var e = document.getElementById("genre");
    var strUser = e.options[e.selectedIndex].value;
    console.log(strUser);



$("#genre").change(function() {
    $("#genreValue").val($(this).val());
    var genre = $("#genreValue").val();
    String(genre);
    console.log(genre);
    });

var x = document.getElementById("onPage");
    var value = x.options[x.selectedIndex].value;
    JSON.stringify(value);
    console.log(value);



$("#perPage").val(10);

$("#onPage").change(function() {
    $("#perPage").val($(this).val());
    var onPage = $("#perPage").val();
    String(onPage);
    console.log(onPage);
    });





function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.772, lng: -122.42 },
        zoom: 10,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            
            
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location

            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            var lat = place.geometry.viewport.l.l;
            var lng = place.geometry.viewport.j.j;
            console.log(place.geometry.viewport.l.l)
            console.log(place.geometry.viewport.j.j)


            //getting date for search query? idk
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = yyyy + '-' + mm + '-' + dd;
            console.log(today);
            //end of get date

            call();

            function call() {
            //call to seatgeek api
            var queryURL = 'https://api.seatgeek.com/2/events?client_id=MTA1MzUxMzF8MTU0MTQ3OTE5OC43Ng&client_secret=ad4b1c6a4b3061a665dba3bd148f7894263e0c91a75dc7df6e9dea034ea6487b&lat=' + lat + '&lon=' + lng + '&listing_count.gt=0&type=concert&per_page=' + $("#perPage").val() + '&page=1' + '&range=20mi' + $("#genreValue").val(); //&datetime_utc.gt=' + today;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                console.log(response.events.length);

                setMapOnAll(null);

                var table = $('#table');
                
                
                table.empty();

                for (var i = 0; i < response.events.length; i++) {
                    
                    var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(response.events[i].venue.location.lat,response.events[i].venue.location.lon),
                    title:response.events[i].venue.name,
                    zoom: 4,
                    map:map
                });

                markers.push(marker);

                    var eventName = response.events[i].short_title;
                    console.log(eventName);
                    var ticketUrl = response.events[i].url;
                    console.log(ticketUrl);
                    var venue = response.events[i].venue.name;
                    console.log(venue);
                    var eventTime = response.events[i].datetime_local;
                    console.log(eventTime);
                    var date = new Date(eventTime);
                    console.log(date);




                    var tr = document.createElement('tr');
                    $("#instructions").hide();
                    $("#addResults").show();
                    $("#mcTable").show();



                    tr.innerHTML =
                        '<td>' + eventName + '</td>' +
                        '<td>' + '<a href = ' + ticketUrl + ">Buy Tickets!" + '</td>' +
                        '<td>' + venue + '</td>' +
                        '<td>' + date + '</td>';


                    table.append(tr);
                }
            });
        }
        });
        map.fitBounds(bounds);
    });
}

