<?php
/**
 * Created by PhpStorm.
 * User: TechSutra
 * Date: 4/25/18
 * Time: 3:05 PM
 */
class dags
{
    function dbconnectDags()
    {
        $dbname = "patralayam";
        $servername = "localhost";
        $username = "root";
        $pass = "";
        $conn = mysqli_connect($servername, $username, $pass, $dbname);

        if ($conn === false) {
            die(mysql_error());
        } else {
            return $conn;
        }
    }


    function insertLocation($conn, $digitaladdress, $state, $zip, $street, $town, $house, $lat, $long)
    {
        $stmt = mysqli_stmt_init($conn);
        $qry = "INSERT INTO `locations`(`digitaladdress`, `state`, `zip`, `street`, `town`, `house`, `latitude`, `longitude`)
 								 VALUES (?,?,?,?,?,?,?,?)";


        if (mysqli_stmt_prepare($stmt, $qry)) {
            mysqli_stmt_bind_param($stmt, "ssssssss", $digitaladdress, $state, $zip, $street, $town, $house, $lat, $long);
            mysqli_stmt_execute($stmt) or die(mysqli_stmt_error($stmt));
        }
    }
    function fetchlatlong($conn, $digiadd)
    {
        $query = "select * from locations where digitaladdress='$digiadd' LIMIT 1";
        $result = mysqli_query($conn, $query) or die(mysqli_error());
        if(mysqli_num_rows($result)==1)
            return json_encode(mysqli_fetch_object($result));
        else
            return false;
    }
}