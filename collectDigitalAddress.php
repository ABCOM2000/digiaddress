<?php
include("general.php");

$data = json_decode(file_get_contents("php://input"));

$lat = $data->lat;
$long = $data->long;

$obj = new dags();
$conn = $obj->dbconnectDags();

$digitaldata = file_get_contents("https://api.mapcode.com/mapcode/codes/".$lat.",".$long."?include=territory,alphabet&allowLog=true&client=web");

$digitalAddress["status"] = json_decode($digitaldata, TRUE)['local']['territory']." ".json_decode($digitaldata, TRUE)['local']['mapcode'];

$obj->insertLocation($conn, $digitalAddress["status"],$data->state,$data->zip,$data->street,$data->town,$data->house,$lat,$long);

echo json_encode($digitalAddress);