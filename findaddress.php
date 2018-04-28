<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>

    <title>Find Address</title>
</head>

<body ng-app="findAddressApp" ng-controller="findControl">
<div class="container">
    <label>Find Digital Address</label>
    <div class="row row-allign">
        <div class="col-sm-4">
            <div class="form-border spacing-top">

                <div class="card-header" style="background:#cc0001; color:#ffff">
                    <h5>Enter Digital Address</h5>
                </div>

                <div class="extra-padding">

                    <form ng-submit="fetchadd()" class="custom-form">
                        <br>
                        <div class="form-group input-group-sm">
                            <input type="text" class="form-control rounded-0 textbox-depth textbox-border"
                                   id="digiadd" ng-model="digiaddress"/>
                        </div>

                        <button type="submit" class="btn btn-color btn-block rounded-0"
                                style="background-color: #cc0001;color:#ffff">Find
                        </button>
                    </form>
                </div>
            </div>
            <br>
        </div>
        <div class="col-sm-8 map-align" ng-init="initMap()">
            <div id="map" class="extra-padding" style="height: 100%;margin-bottom: 15px;"></div>
        </div>

    </div>
</div>


<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAXtUgIJI39fpYsM2y2FwAs0KynuS_qmP8">
</script>
<script src="js/app.js">
</script>
<script src="//code.jquery.com/jquery-1.10.2.js"></script>
<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
</body>
</html>