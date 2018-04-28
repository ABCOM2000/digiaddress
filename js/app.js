var geocoder = null;
var resmap = null;
var marker = null;
var rectangle = null;
var tempadd = null;
var add1 = "";
var lat, long;
var latlong;

var latvalue = 37.387474;
var lngvalue = -122.05754339999999;

var app = angular.module('digitalAddressApp', []);

app.controller('digiAddressGenerator', function ($scope, $http) {

    $scope.initMap = function () {
        $(window).load(function () {
            resmap = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: {lat:latvalue, lng: lngvalue}
            });
            geocoder = new google.maps.Geocoder();
        });

    };

    function addMarker(location) {
        removeMarker();
        removeRectangle();
        latlong = null;
        //console.log(location);
        lat = location.lat();
        long = location.lng();
        $scope.address.lat = lat;
        $scope.address.long = long;
        latlong = lat + ", " + long;
        myEl = angular.element(document.querySelector('#lt'));
        myEl.html("GeoCoordinates: " + latlong);
        $scope.latlong = true;
        console.log("lat " + latlong);
        marker = new google.maps.Marker({
            position: location,
            map: resmap
        });
        getAddress(location);
    }

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

                var add = "";
                var arr = [];

                for (var key in address) {
                    if (key !== 'lat' && key !== 'long')
                        arr.push(address[key].toString());
                }

                for (var i = arr.length - 1; i >= 0; i--) {
                    if (add === "")
                        add = arr[i].toString();
                    else
                        add = add + ',' + arr[i].toString();
                }

                var fullAddress = "";

                if (!address ['house']) {
                    fullAddress = address ['house'] + ",";
                }
                if (address ['town']) {
                    fullAddress = fullAddress + address ['town'] + ",";
                }
                if (address ['street']) {
                    fullAddress = fullAddress + address ['street'] + ",";
                }
                if (address ['state']) {
                    fullAddress = fullAddress + address ['state'] + " ";
                }
                if (address ['zip']) {
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
                if (add !== "") {
                    $http({
                        method: 'POST',
                        url: 'geoimplement.php',
                        data: {address: add},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).then(function successCallback(results) {

                        if (results.data !== "false") {
                            // console.log(results);
                            removeMarker();
                            removeRectangle();

                            $scope.address.lat = lat;
                            $scope.address.long = long;

                            lat = results.data.geometry.location.lat;
                            long = results.data.geometry.location.lng;

                            marker = new google.maps.Marker({
                                map: resmap,
                                position: results.data.geometry.location
                            });

                            myEl = angular.element(document.querySelector('#lt'));
                            myEl.html("Geo Coordinate: " + lat + "," + long);

                            $scope.latlong = true;
                            myEl = angular.element(document.querySelector('#padd'));
                            myEl.html("Geo Address: " + add);

                            $scope.addr = true;
                            console.log(JSON.stringify(results.data));

                            if (results.data.geometry.viewport) {

                                rectangle = new google.maps.Rectangle({
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 0.5,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35,
                                    map: resmap,
                                    bounds: {
                                        north: results.data.geometry.viewport.northeast.lat,
                                        south: results.data.geometry.viewport.southwest.lat,
                                        east: results.data.geometry.viewport.northeast.lng,
                                        west: results.data.geometry.viewport.southwest.lng
                                    }
                                });

                                resmap.setCenter(new google.maps.LatLng(lat, long));

                                var googleBounds = new google.maps.LatLngBounds(results.data.geometry.viewport.southwest, results.data.geometry.viewport.northeast);

                                resmap.fitBounds(googleBounds);
                            }

                        } else {
                            myEl = angular.element(document.querySelector('#lt'));
                            myEl.html("Place not found.Please select location on map");
                            $scope.latlong = true;
                            removeRectangle();

                        }

                    }, function errorCallback(results) {
                    });

                }
                ;
            }
        }
    };


    function getAddress(latlong) {
        geocoder.geocode({
            'latLng': latlong
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log(results[1].formatted_address);
                    myEl = angular.element(document.querySelector('#padd'));
                    myEl.html("GeoAddress: " + results[1].formatted_address);
                    $scope.addr = true;
                } else {
                    console.log('No results found');
                }
            } else {
                console.logs('Geocoder failed due to: ' + status);
            }
        });
    };

    $scope.processForm = function () {

        var digiAdd = "";
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
                    digiadd = response.data.status;
                    $scope.digiaddlabel = response.data.status;
                    $scope.state = null;
                    $scope.zip = null;
                    $scope.street = null;
                    $scope.town = null;
                    $scope.house = null;

                    $scope.digiadd = digiadd;
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
            resmap = new google.maps.Map(document.getElementById('map'), {
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
                        resmap.setZoom(5);
                        resmap.setCenter(new google.maps.LatLng(37.387474, -122.05754339999999));
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
                            map: resmap
                        });

                        resmap.setCenter(new google.maps.LatLng(jsonlatlong.latitude, jsonlatlong.longitude));
                        resmap.setZoom(18);
                        $scope.qrcode = "qroutput/"+jsonlatlong.digital_address+".png";
                    }

                }
            },
            function(response){
                console.log(response.statusText);
            });
    };
});
