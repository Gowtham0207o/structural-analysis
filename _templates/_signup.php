<?
$check = false;
if (isset($_POST["email_id"]) and isset($_POST["password"])) {
  
    $email_id = $_POST["email_id"];
 
    $password = $_POST["password"];
    $check = true;
}
if ($check) {
    try {
      $result = user::signup($email_id,$password);
        ?><main class="container">
    <div class="bg-light p-4"  style=margin:-1px;>
      <h1 style=color:black;>signup success</h1>
      <p class="lead" style=color:black;> now you can signin and enjoy our app please use the below signin</p>
      <a class="btn btn-lg btn-primary hvr-shrink" href="/studinfo/login.php" role="button">sign in »</a>
    </div>
  </main>
  <?
    } catch(exception $result) {
      $result="The email is already in use please try again with an another email";
        ?>


    <main class="container">
    <div class="bg-light p-4"  style=margin:-1px;>
      <h1 style=color:black;>signup failed</h1>
      <p class="lead" style=color:black;> <?echo "$result"; ?></p>
    </div>
  </main>
 <?}

}

?>
<main class="form-signup">
  <form method="POST" action="signup.php">
  <center><img class="mb-5" src="/image/logo.png" alt=""height="200" ></center>
<h1 class="h3 mb-3 fw-normal" style="color:black;">Signup here</h1>
    <div class="form-floating">
      <input name="email_id" type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
      <input name="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required>
      <label for="floatingPassword">Password</label>
</div>
    <button class="w-100 btn btn-lg btn-primary hvr-shrink"type="submit">Sign up</button>
    <br>
    <br>
    <p style="color:black;">already a user??</p>
    <a class="w-80 btn btn-primary hvr-shrink" href="login.php" role="button">Sign in</a>
    <p class="mt-5 mb-3 text-muted">© 2023-2028</p>
  </form>
</main>
