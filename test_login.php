<?php
include 'libs/load.php';
try{
    $servername = get_configure("db_server");
    $username = get_configure("db_user");
    $password = get_configure("db_pass");
    $dbname = get_configure("db_name");
    $conn = new mysqli($servername, $username, $password, $dbname);
    if($conn->connect_error){
        print($conn->connect_error);
    }else{
        print("all are fine");
    }

}catch(exception $e){
    print($e);
}



?>