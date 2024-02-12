<?php
include 'libs/load.php';
?>
<!doctype html>
<html lang="en">

 <?php load_template("head")?>
 <style>
  body{
background-repeat:repeat-y;
    background-size:100% 100%;
    background-attachment: scroll;
    } 

    .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    }

    .form-signup {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
    }

    .form-signup .checkbox {
    font-weight: 400;
    }

    .form-signup .form-floating:focus-within {
    z-index: 2;
    }
    .form-signup input[name="username"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    }
    .form-signup input[name="phone"] {
    margin-bottom: -1px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    }
    .form-signup input[type="email"] {
    margin-bottom: -1px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    }

    .form-signup input[name="password"] {
    margin-bottom: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    }
  </style>
  <body>
  <header>
<?php
load_template("header");?>

</header>
<br>
<br>
<main>

 <?php load_template("_signup");?>

</main>

<footer class="text-muted py-5">
 <?php load_template("footer");?>
</footer>


    <script src="/app/assets/dist/js/bootstrap.bundle.min.js"></script>


  </body>
</html>