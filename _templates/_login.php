<?php
$check=false;
if (isset($_POST['submit']))
{
$emailId = $_POST['email_id'];
$password = $_POST['password'];
$check=true;
}
if ($check){
    try{
      $result = user::login($emailId,$password);
      header('location:/index.php');
      session::set('is_loggedin',true);


}catch(exception $result){
  $result="please enter the valid credentials , If you're a new user please signup and try again!".$result;
  ?>
  <main class="container">
  <div class="bg-light p-3"  style=margin:-1px;>
    <h1>login failed</h1>
    <p class="lead"> <?echo $result;?></p>
  </div>
</main>
<? 
}
}
?>
<main class="form-signin">
  <form method="POST" action="login.php">
    <center><img class="mb-5" src="/image/logo.png" alt=""height="200" ></center>
  
<div class="container m">
<h1 class="h3 mb-3 fw-normal" style="color:black;">Please sign in</h1>
    <div class="form-floating">
      <input name="email_id" type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
      <input name="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" required>
      <label for="floatingPassword" >Password</label>
    
      <!-- add the eye button -->

    </div>

    <div class="checkbox mb-3" style="color:black;">
      <label>
        <input type="checkbox" value="remember-me"> Remember me &nbsp;&nbsp;&nbsp;
      </label>
      <a href="#">forgetten password?</a>
    </div>
    <button class="w-100 btn btn-lg btn-primary hvr-shrink" name="submit"type="submt">Sign in</button>
    <br>
    <br>
    <p style="color:black;">New user??</p>
    <a class="w-80 btn btn-primary hvr-shrink" href="signup.php" role="button">Sign up</a>
    <p class="mt-5 mb-3 text-muted">© 2023-2028</p>
  </form>
</div>
</main>
<script>
        const togglePassword = document.querySelector("togglePassword");
        const password = document.querySelector("password");

        togglePassword.addEventListener("click", function () {
            // toggle the type attribute
            const type = password.getAttribute("type") === "password" ? "text" : "password";
            password.setAttribute("type", type);
            
            // toggle the icon
            this.classList.toggle("bi-eye");
        });

        // prevent form submit
        const form = document.querySelector("form");
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    </script>










