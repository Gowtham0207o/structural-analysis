<?php
class session
{
    public static function start()
    {
        session_start();

    }
    public static function set($key, $value)
    {
        $_SESSION[$key] = $value;

    }

    public static function get($key)
    {
        if (session::isset($key, $default = false)) {
            return $_SESSION[$key];
        } else {
            return $default;
        }

    }
  public static function isset($key) {
        return isset($_SESSION[$key]);

    }
    public static function destroy()
    {
        session_destroy();
        header('location:/login.php');
         print("the session has been destroyed......");

    }public static function delete($key)
    {

        session_unset($_SESSION[$key]);   


    }function unset() {
        session_unset();

    }


}
