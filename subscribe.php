<?php
include 'libs/load.php';
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve the JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $email = $input['email'] ?? null;

  


    if ($email && Info::newsletter($email) ) {
        

        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email address."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
