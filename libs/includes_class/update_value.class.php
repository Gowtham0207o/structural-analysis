<?php
class Info{


public static function updateinfo($value)
{
    print_r($value);

}

public static function newsletter($value){
    database::get_connection();
    $username = session::get('username');
    // $quer = "SELECT * FROM `credentials` WHERE `email` = '$user'";
    // $res = $conn->query($quer);
    // $num = $res->num_rows;
    // $id = NULL;
    // if($nums == 1){
    //     $row = $result->fetch_assoc();
    //     $id = $row[id];
    // }
    //----todo----// complete the id to connect here by saving the assoc in the session
 
 
 
 $sql = "INSERT INTO `newsletter` (`username`,`email`,`time`)
    VALUES ('$username','$value', now());";    
    
    $result = false;                                     
    if(database::$conn->query($sql) == 1) {
        $result = true;
    } else {
        $result = false;
    }

    database::$conn->close();
    return $result;
}

}







?>