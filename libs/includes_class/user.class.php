<?php

class user
{
//here the login can be performed on both with the user name as well as id
    public function __construct($username)
    {

        $this->conn = database::get_connection();
        $this->username = $username;
        $this->id = null;
        $sql = "SELECT * FROM `credentials` WHERE `email` = '$username' OR `id`= '$username' LIMIT 1";
        $result = $this->conn->query($sql);
        if ($result->num_rows) {
            $rows = $result->fetch_assoc();
            $this->id = $rows['id'];

        }

    }

    public static function signup($email,$pass)
    {
        database::get_connection();
        $options = [

            'cost' => 12,
        ];
        $pass = password_hash($pass, PASSWORD_BCRYPT, $options);
        $sql = " INSERT INTO `credentials` ( `email`,`password`)
    VALUES ('$email','$pass');";
        $result = true;
        //here the database error should be treated with try catch
        if(database::$conn->query($sql) == 1) {
            $result = true;
        } else {
            throw new exception(database::$conn->error);

        }

        database::$conn->close();
        return $result;

    }
    public static function login($user, $pass)
    {

        $quer = "SELECT * FROM `credentials` WHERE `email` = '$user'";
        $conn = database::get_connection();

        $result = $conn->query($quer);
        $num = $result->num_rows;

        if ($num == 1) {

            $row = $result->fetch_assoc();

            if (password_verify($pass, $row["password"])) {

                /*
                1.generate a token
                2.insert the token to the database
                3.build session and give session to the user
                */

                return $row;
            } else {
               throw new exception("please check the user credential");

            }
        } else {
           throw new exception("please signup before login");
        }

        database::$conn->close();
    }
    public static function upload($array){
        database::get_connection();
        $sql = " INSERT INTO `user_credentials` (`firstname`, `lastname`, `email`, `phone`, `aadhar_number`, `dob`, `gender`, `address1`, `address2`, `father_name`, `occupation`, `phone_parent`, `school_name`, `board_of_study`, `chem_mark`, `phy_mark`, `maths_mark`, `cuttoff`, `community`, `preference1`, `preference2`, `preference3`)
        VALUES ('".$array['firstname']."', '".$array ['lastname']."', '".$array['email']."', '".$array['studphone']."', '".$array['aadhar']."','".$array['dob']."', '".$array['gender']."', '".$array['add1']."', '".$array['add2']."', '".$array['fathername']."', '".$array['occupation']."', '".$array['parentphone']."', '".$array['school']."', '".$array['board']."', '".$array['chem_mark']."', '".$array['phy_mark']."', '".$array['maths_mark']."', '".$array['cuttoff']."', '".$array['community']."', '".$array['pref1']."', '".$array['pref2']."', '".$array['pref3']."');";

        $result = true;

        //here the database error should be treated with try catch

        if(database::$conn->query($sql) == 1) {
            $result = false;
        } else {
            $result = database::$conn->error;

        }

        database::$conn->close();
        return $result;

    }

    public function __call($name, $arguments)
    {
        $property = preg_replace("/[^0-9a-zA-Z]/", "", substr($name, 3));
        $property = strtolower(preg_replace('/\B([A-Z])/', '_$1', $property));
        if (substr($name, 0, 3) == "get") {
            return $this->get_data($property);
        } elseif (substr($name, 0, 3) == "set") {
            return $this->set_data($property, $arguments[0]);
        }else{
            throw new exception("user::__call() -> $name is not available");
        }
    }

    private function get_data($var)
    {
        if (!$this->conn) {
            $this->conn = database::get_connection();
        }
        $quer = "SELECT `$var` FROM `user_credentials` WHERE `id` = $this->id LIMIT 1";
        $result = $this->conn->query($quer);

        if ($result and $result->num_rows == 1) {
$assoc=$result->fetch_assoc();
           return $assoc[$var];
        } else {
            return null;
        }

    }
    private function set_data($var, $value)
    {
        if (!$this->conn) {
            $this->conn = database::get_connesction();
        }
        $sql = "UPDATE `users` SET `$var`='$data' WHERE `id`=$this->id";
        if ($this->conn->query($sql)) {
            return true;
        } else {
            return false;
        }
    }
// public function getavatar(){
// return $this->get_data('avatar');
// }
// public function setavatar($value){
//  return $this->set_data('avatar',$value);
// }
// public function setbio($value){
//   return $this->set_data('bio',$value);
// }
// public function getbio(){
//   return $this->get_data('bio');
// }
// public function setfirstname($value){
//   return $this->set_data('firstname',$value);
// }
// public function getfirstname(){
//   return $this->get_data('firstnmae');
// }
// public function getlastname(){
//   return $this->get_data('lastname');
// }
// public function setlastname($value){
//   return $this->set_data('lastname',$value);
// }
// public function getdob(){
//   return $this->get_data('dob');
// }
// public function setdob($value){
//   return $this->set_data('dob',$value);
// }
// public function getinstaid(){
//   return $this->get_data('instagram');
// }
// public function setinstaid($value){
//   return $this->set_data('instagram',$value);
// }
// public function gettwitterid(){
//   return $this->get_data('twitter');
// }
// public function settwitterid($value){
//   return $this->set_data('twitter',$value);
// }
// public function setlinkedinid(){
//   //todo update this option
// }
// public function getlinkedinid(){

// }
    public function __destruct()
    {
        $this->conn->close();
    }

}
