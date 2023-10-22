<?php

class database
{
    public static $conn = null;
    public static function get_connection()
    {
        if (database::$conn == null) {
            $servername = get_configure("db_server");
            $username = get_configure("db_user");
            $password = get_configure("db_pass");
            $dbname = get_configure("db_name");

            // Create connection
            $conn = new mysqli($servername, $username, $password, $dbname);
            if ($conn->connect_error) {
                
                print("the connection hass been failed");
              throw new exception($conn->connect_error); //todo handle connecction with exception handling

            } else {
                database::$conn = $conn;
              
                return database::$conn;

            }
        } else {
           
            return database::$conn;
        }
    }
    public function __destruct()
    {

        database::$conn->close();
    }
}
?>