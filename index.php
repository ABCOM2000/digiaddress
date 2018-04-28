<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>

    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAXtUgIJI39fpYsM2y2FwAs0KynuS_qmP8">
    </script>

    <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="js/app.js"/>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

</head>

<body ng-app="digitalAddressApp" ng-controller="digiAddressGenerator">

<div class="container">
    <label>Generate Digital Address</label>
    <div class="row row-allign">
        <div class="col-sm-4">

            <div class="form-border spacing-top">
                <div class="card-header" style="background:#cc0001; color:#ffff">
                    <h5>Enter Address</h5>
                </div>
                <div class="extra-padding">

                    <form ng-submit="processForm()" class="custom-form">
                            <div class="form-group input-group-sm">
                                <label for="state">State</label>
                                <input type="text" class="form-control rounded-0 textbox-border" id="state"
                                       placeholder="" ng-model="address.state"
                                       ng-blur="geocodeAddress(address,'state')" required=""/>
                            </div>
                            <div class="form-group input-group-sm">
                                <label for="zip" class="animated-label">Zip</label>
                                <input type="text" class="form-control rounded-0 textbox-depth textbox-border"
                                       id="zip" ng-model="address.zip" disabled="disabled"
                                       ng-blur="geocodeAddress(address,'zip')" required=""/>
                            </div>
                            <div class="form-group input-group-sm">
                                <label for="town">Town</label>
                                <input type="text" class="form-control rounded-0 textbox-border "
                                       id="town" ng-model="address.town" disabled="disabled"
                                       ng-blur="geocodeAddress(address,'town')" required=""/>
                            </div>
                            <div class="form-group input-group-sm">
                                <label for="street">Street</label>
                                <input type="text" class="form-control rounded-0 textbox-border" id="street"
                                       placeholder="" ng-model="address.street" disabled="disabled"
                                       ng-blur="geocodeAddress(address,'street')" required=""/>
                            </div>

                            <div class="form-group input-group-sm">
                                <label for="house">House</label>
                                <input type="text" class="form-control rounded-0 textbox-border" id="house"
                                       placeholder="" ng-model="address.house" disabled="disabled"
                                       ng-blur="geocodeAddress(address,'house')" required=""/>
                            </div>
                            <div class="form-group input-group-sm">
                                <input type="hidden" ng-model="address.lat"/>
                            </div>
                            <div class="form-group input-group-sm">
                                <input type="hidden" ng-model="address.long"/>
                            </div>
                            <button type="submit" disabled="disabled" class="btn btn-color btn-block rounded-0" id="generate"
                                    style="color:#ffff;background-color: #cc0001;">Generate
                            </button>
                    </form>
                </div>
            </div>
            <br>
        </div>
        <div class="col-sm-8 map-align" ng-init="initMap()">
            <div id="map" class="extra-padding" style="height: 100%;
            margin-bottom: 15px;"></div>
            <div class="alert alert-color rounded-0"">
            <label id="lt" ng-show="latlng" ng-model="lt"></label><br/>
                <label id="padd" ng-show="address" ng-model="padd"></label>
            </div>
        </div>

    </div>

    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content rounded-0 form-border">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="printbody">
                    <div class="row">
                        <div class="col-sm-7"></br></br></br>
                            <div class="align-middle">
                                <h2><span ng-model="digiaddlabel" ng-bind="digiaddlabel"></span></h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>