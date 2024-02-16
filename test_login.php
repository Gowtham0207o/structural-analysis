<?php
include 'libs/load.php';
if(isset($_POST['logout'])){
    session::destroy();
  }
?>