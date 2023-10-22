<?php
include 'libs/load.php';

?>

<!DOCTYPE html>
<html lang="en">

<?php load_template("head");?>

<body>
 <?php load_template("header");?>

  <div class="container-fluid">
    <div class="row">
<?php load_template("navbar");?>

<main class="col-md-9 ms-sm-auto col-lg-10 pb-5 px-md-4">
<?php load_template("dashboard");?>
</main>
    </div>
  </div>

 
<?php load_template("footer");?>
 
</body>

</html>