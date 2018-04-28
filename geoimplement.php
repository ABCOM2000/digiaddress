<?php

$data=json_decode(file_get_contents("php://input"));
$result = geocode($data->address);

echo json_encode($result);


function geocode($address){

    // url encode the address
    $address = urlencode($address);

    // google map geocode api url
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$address}&key=AIzaSyAXtUgIJI39fpYsM2y2FwAs0KynuS_qmP8";

    // get the json response
    $resp_json = file_get_contents($url);

    // decode the json
    $resp = json_decode($resp_json, true);

    // response status will be 'OK', if able to geocode given address
    if ($resp['status'] == 'OK') {
        return $resp['results'][0];
    } else {
        return false;
    }
}
