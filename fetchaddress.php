<?php
//error_reporting(0);
header("Access-Control-Allow-Origin: *");
$postdata = file_get_contents("php://input");
$from_data = json_decode($postdata);
$data = array();
$error = array();
include("general.php");
$obj = new dags();
if(empty($from_data->digiaddress))
    $error["add"] = "Please Enter Digital Address";

if(!empty($error))
    $data["error"] = $error;
else
{
    $conn = $obj->dbconnectDags();
    $data["latlong"] = $obj->fetchlatlong($conn, $from_data->digiaddress);
}
echo json_encode($data);
?>