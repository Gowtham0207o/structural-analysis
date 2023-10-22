<?php
$jsonData = $_POST['model_data_json'];

// Convert JSON data into a PHP object
$model = json_decode($jsonData);

// Now you can access and work with the $model object
print_r($model);
?>
