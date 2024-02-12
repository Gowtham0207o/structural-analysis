<?php
class logincheck{
    public static function check(){
    
        $quer="SELECT `login_time`, `token`, `ip`, `id` FROM `session` ORDER BY `login_time` DESC LIMIT 1;";
        $conn = database::get_connection();
        $result = $conn->query($quer);
     

        $row=$result->fetch_assoc();
       
        $old_token=$row['token'];

        $ipaddress = $_SERVER['REMOTE_ADDR'];

        $new_token=session::get('session_token');
        
        if(($new_token==$old_token) && ($ipaddress==$row['ip']) ){
            print("the token has been validated");
            return true;
        }else{
            print("the token is invalid");
          return false;

        }
    }
    public static function loggedin(){
    
            if(session::get('is_loggedin')){
               return true;
            }else{
              return false;
    
            }
        }
        
    }

    


?>