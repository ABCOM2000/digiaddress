var geocoder = null;
var locationMap = null;
var marker = null;
var rectangle = null;
var lat, lng;

var latitude = 37.387474;
var longitude = -122.05754339999999;

var app = angular.module('digitalAddressApp', []);

app.controller('digiAddressGenerator', function ($scope, $http) {

    $scope.initMap = function () {
        $(window).load(function () {
            locationMap = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: {lat:latitude, lng: longitude}
            });
            geocoder = new google.maps.Geocoder();
        });

    };

    function removeMarker() {
        if (marker !== null) {
            marker.setMap(null);
        }
    }

    function removeRectangle() {
        if (rectangle !== null) {
            rectangle.setMap(null);
        }
    }

    /**
     *  invoked after lost focus from  html attributed files
     * @param address
     * @param field
     */
    $scope.geocodeAddress = function (address, field) {

        if (address[field]) {

            if (address !== null) {

                var fullAddress = "";

                if (address ['house']) {

                    angular.element(document.getElementById('generate'))[0].disabled = false;
                    fullAddress = address ['house'] + ",";
                }
                if (address ['town']) {
                    angular.element(document.getElementById('street'))[0].disabled = false;
                    // angular.element(document.getElementById('street')).focus();
                    fullAddress = fullAddress + address ['town'] + ",";
                }
                if (address ['street']) {
                    angular.element(document.getElementById('house'))[0].disabled = false;
                    // angular.element(document.getElementById('house')).focus();
                    fullAddress = fullAddress + address ['street'] + ",";
                }
                if (address ['state']) {
                    angular.element(document.getElementById('zip'))[0].disabled = false;
                    // angular.element(document.getElementById('zip')).focus();
                    fullAddress = fullAddress + address ['state'] + " ";
                }
                if (address ['zip']) {
                    angular.element(document.getElementById('town'))[0].disabled = false;
                    // angular.element(document.getElementById('town')).focus();
                    fullAddress = fullAddress + address ['zip'];
                }
                console.log("address: " + fullAddress);
                /**
                 *  invoked Post method with geoimplement.php , geoimplement.php return address latlong  and geo location geometry area,
                 *
                 *  {"address_components":[{"long_name":"Illinois","short_name":"IL","types":["administrative_area_level_1","political"]},
                 *  {"long_name":"United States","short_name":"US","types":["country","political"]}],
                 *  "formatted_address":"Illinois, USA",
                 *  "geometry":{"bounds":{"northeast":{"lat":42.5083379,"lng":-87.019935},"southwest":{"lat":36.970298,"lng":-91.5130789}},
                 *  "location":{"lat":40.6331249,"lng":-89.3985283},
                 *  "location_type":"APPROXIMATE",
                 *  "viewport":{"northeast":{"lat":42.5083379,"lng":-87.019935},"southwest":{"lat":36.970298,"lng":-91.5130789}}},
                 *  "place_id":"ChIJGSZubzgtC4gRVlkRZFCCFX8",
                 *  "types":["administrative_area_level_1","political"]}
                 */
                if (fullAddress !== "") {
                    $http({
                        method: 'POST',
                        url: 'geoimplement.php',
                        data: {address: fullAddress},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).then(function successCallback(results) {

                        if (results.data !== "false") {
                            removeMarker();
                            removeRectangle();

                            $scope.address.lat = lat;
                            $scope.address.lng = lng;

                            lat = results.data.geometry.location.lat;
                            lng = results.data.geometry.location.lng;

                            marker = new google.maps.Marker({
                                map: locationMap,
                                position: results.data.geometry.location
                            });

                            geoCoordLabel = angular.element(document.querySelector('#lt'));
                            geoCoordLabel.html("Geo Coordinate: " + lat + "," + lng);


                            geoAddressLabel = angular.element(document.querySelector('#padd'));
                            geoAddressLabel.html("Geo Address: " + fullAddress);


                            // $scope.latlng = true;
                            // $scope.addr = true;

                            if (results.data.geometry.viewport) {

                                rectangle = new google.maps.Rectangle({
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 0.5,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35,
                                    map: locationMap,
                                    bounds: {
                                        north: results.data.geometry.viewport.northeast.lat,
                                        south: results.data.geometry.viewport.southwest.lat,
                                        east: results.data.geometry.viewport.northeast.lng,
                                        west: results.data.geometry.viewport.southwest.lng
                                    }
                                });

                                var googleBounds = new google.maps.LatLngBounds(results.data.geometry.viewport.southwest, results.data.geometry.viewport.northeast);

                                locationMap.setCenter(new google.maps.LatLng(lat, lng));
                                locationMap.fitBounds(googleBounds);
                            }
                        } else {
                            errorLabel = angular.element(document.querySelector('#lt'));
                            errorLabel.html("Place not found.");
                            $scope.latlng = true;
                            removeRectangle();
                        }

                    }, function errorCallback(results) {
                       console.log(results);
                    });
                }
            }
        }
    };

    //
    // function getAddress(latlong) {
    //     geocoder.geocode({
    //         'latLng': latlong
    //     }, function (results, status) {
    //         if (status === google.maps.GeocoderStatus.OK) {
    //             if (results[1]) {
    //                 console.log(results[1].formatted_address);
    //                 myEl = angular.element(document.querySelector('#padd'));
    //                 myEl.html("GeoAddress: " + results[1].formatted_address);
    //                 $scope.addr = true;
    //             } else {
    //                 console.log('No results found');
    //             }
    //         } else {
    //             console.logs('Geocoder failed due to: ' + status);
    //         }
    //     });
    // };

    $scope.processForm = function () {

        var digiAddress = "";
        $http({
            method: 'POST',
            url: 'collectDigitalAddress.php',
            data: $scope.address,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
                if (!response.data.status) {
                    $scope.status = "Failed ";
                    console.log(response);
                }
                else if (response.data.status) {

                    digiAddress = response.data.status;

                    $scope.digiaddlabel = response.data.status;

                    $scope.state = null;
                    $scope.zip = null;
                    $scope.street = null;
                    $scope.town = null;
                    $scope.house = null;

                    // $scope.digiadd = digiAddress;

                    $('#exampleModalCenter').modal('show');
                }
            },
            function (response) {
                console.log(response.statusText);
            });


    };
});


var addapp = angular.module('findAddressApp',[]);

addapp.controller('findControl', function($scope, $http){
    $scope.initMap = function () {
        $(window).load(function (){
            locationMap = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: {lat: 37.387474, lng: -122.05754339999999}
            });
            geocoder = new google.maps.Geocoder();
        });

    };

    $scope.fetchadd = function(){
        var lat;
        var long;
        var qrcode;
        $http({
            method : 'POST',
            url : 'fetchaddress.php',
            data : {digiaddress: $scope.digiaddress}
        }).then(function(response){
                console.log(response);
                if(response.data.error)
                {
                    $scope.adderror = response.data.error.add;
                    console.log(response.data.error.add);
                }
                else
                {
                    console.log(response.data);
                    if(!response.data.latlong)
                    {
                        console.log("1");
                        $scope.qrcode = "";
                        $scope.qrcode = false;
                        $scope.adderror = "Digital Address not found";
                        locationMap.setZoom(5);
                        locationMap.setCenter(new google.maps.LatLng(37.387474, -122.05754339999999));
                    }
                    else if (response.data.latlong)
                    {
                        $scope.adderror = "";
                        $scope.adderror = false;
                        console.log("2");
                        var jsonlatlong = JSON.parse(response.data.latlong);
                        $scope.lat = jsonlatlong.latitude;
                        $scope.long = jsonlatlong.longitude;

                        //console.log(response.data);
                        console.log(jsonlatlong.latitude);
                        console.log(jsonlatlong.longitude);
                        console.log(jsonlatlong.digital_address);
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(jsonlatlong.latitude, jsonlatlong.longitude),
                            map: locationMap
                        });

                        locationMap.setCenter(new google.maps.LatLng(jsonlatlong.latitude, jsonlatlong.longitude));
                        locationMap.setZoom(18);
                        $scope.qrcode = "qroutput/"+jsonlatlong.digital_address+".png";
                    }

                }
            },
            function(response){
                console.log(response.statusText);
            });
    };
});
