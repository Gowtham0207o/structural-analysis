<?php

function reaction_calc($data){
    $supportCount = 0;

    // Iterate through the JSON-decoded data and count the supports
    foreach ($data as $element) {
        if (isset($element['type']) && (($element['type'] === "Support-pinned") || ($element['type'] === "Support-fixed") ||($element['type'] === "Support-roller")) ) {
            $supportCount++;
        }
    }
    if($supportCount == 2){   // It is an simply supported beam 
        $va=0;
        $total=0;
        $parts = explode("|", $data[1]['loc']);
            if (count($parts) > 1) {
                $value_after_pipe = trim($parts[1]); // Remove any whitespace
                $total_length = intval($value_after_pipe);
              
            }
           
        foreach ($data as $lelement){ // for point load calculation
            if (isset($lelement['type']) && ($lelement['type'] === "Point Load") ) {
                $va=$va+($lelement['load']*($total_length-$lelement['loc'])/$total_length);
                $total=$total+$lelement['load'];
            }
        }
        foreach ($data as $lelement){ // for dt load calculation
            if (isset($lelement['type']) && ($lelement['type'] === "Dt. Load") ) {
            $parts = explode("|", $lelement['loc']);
            if (count($parts) > 1) {
                $value_before_pipe = trim($parts[0]);
                $value_after = trim($parts[1]);  
                
                $integer_before_pipe = intval($value_before_pipe);
                $integer_after_pipe = intval($value_after);
            }
            
            $parts = explode("|", $lelement['load']);
            if (count($parts) > 1) {
                $value_before_pipe = trim($parts[0]);
                $value_after = trim($parts[1]);  
                
                $load_start= intval($value_before_pipe);
                $load_end = intval($value_after);
            }
           if($load_start == $load_end){ // it is an UDL load
            
            $length=(($integer_after_pipe+$integer_before_pipe)/2);
                $load=($integer_after_pipe-$integer_before_pipe)*$load_start;
                $va=$va+($load*($total_length-$length)/$total_length);
                $total=$total+$load;
           }else{
            $length=(($integer_after_pipe+$integer_before_pipe)/2);
                $load=($integer_after_pipe-$integer_before_pipe)*(($load_start+$load_end)/2);
                $va=$va+($load*($total_length-$length)/$total_length);
                $total=$total+$load;
           }
        }
        }

    $vb=$total-$va;
    $value = ['va' => $va, 'vb' => $vb, 'H' => 0];
    
    return $value;
    }
    
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $model_data_json = $_POST['model_data_json'];
    
    // Decode the JSON data to a PHP array
    $model_data = json_decode($model_data_json, true);

    $reaction=reaction_calc($model_data['model']);

    $response = array(
        'success' => true,
        'result' => $reaction
    );
} else {
    $response = array(
        'success' => false,
        'result' => 'No data received.'
    );
}

// Set the response content type to JSON
header('Content-Type: application/json');

// Return the response as a JSON object
echo json_encode($response);
// $hello='
//   {  "1": {
//         "type": "Length",
//         "loc": "0 | 10",
//         "load": ""
//     },
//     "2": {
//         "type": "Support-pinned",
//         "loc": "0",
//         "load": ""
//     },
//     "3": {
//         "type": "Support-fixed",
//         "loc": "10",
//         "load": ""
//     },
//     "8": {
//         "type": "Dt. Load",
//         "loc": "5 | 10",
//         "load": "4 | 10"
//     },
//     "4": {
//         "type": "Point Load",
//         "loc": "5",
//         "load": "5"
//     },
//     "5": {
//         "loc": "m",
//         "load": "kN"
//     }
// }
// ';
//    $new=json_decode($hello,true);
//    print_r($new);

// $reaction=reaction_calc($new);

// print_r( $reaction);

?>