<?php
include 'libs/load.php';
try{
user::signup("admin@mail.me","password");

}catch(exception $e){
    print($e);
}

?>