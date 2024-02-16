<?php
include 'libs/load.php';
if(isset($_POST['logout'])){
    session::destroy();
  }
  if(isset($_POST['news_subscribe'])) {
    if(isset($_POST['email'])) {
        $result = user::subscribe(session::get['id'], session::get['username'], $_POST['email']);
        
        // Check if the subscription was successful
        if($result) {
            // Subscription success, redirect back with success message
            header("Location: {$_SERVER['HTTP_REFERER']}?subscribe=success");
            exit;
        } else {
            // Subscription failed, redirect back with failure message
            header("Location: {$_SERVER['HTTP_REFERER']}?subscribe=failed");
            exit;
        }
    }
}
?>