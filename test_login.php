<?php

function modifyArrayAtSupport($v, $inputData, $reaction) {
    $s=$v;
    // Find va (Support-pinned) and vb (Support-fixed) locations
    $va_loc = [null, null];
    $count = 0;

    foreach ($inputData as $key => $item) {
        if ($item['type'] == 'Support-pinned' || $item['type'] == 'Support-fixed' || $item['type'] == 'Support-roller') {
            $va_loc[$count] = intval($item['loc']);
            $count++;
        }
    }

    $va_location = min($va_loc[0], $va_loc[1]);
    $vb_location = max($va_loc[0], $va_loc[1]);
    if ($va_location === null || $vb_location === null) {
        return $s; // If va or vb location not found, return original array
    }

    $va = isset($reaction["va ="]) ? $reaction["va ="] : 0; // Get va value from reaction (default to 0 if not found)
    $vb = isset($reaction["vb ="]) ? $reaction["vb ="] : 0; // Get vb value from reaction (default to 0 if not found)

    // Iterate through the original array $s
    foreach ($s as $key => $item) {
        $current_x = $item['x'];
        $current_y = $item['y'];

      
        if ($current_x == $va_location) {
            
            for ($j = $key ; $j < count($s); $j++) {
              
                $v[$j]['y'] = $va;
                
            }
            // Subtract the existing y value where va or vb occurs
            
        }
        if ($current_x == $vb_location) {
            // Adjust subsequent y values by adding va and vb
            for ($j = $key ; $j < count($s); $j++) {
                $v[$j]['y'] += $vb;
                
            }
            
           
        }
        if(isset($current_y)){
            for ($j = $key ; $j < count($s); $j++) {
            $v[$j]['y'] =  $v[$j]['y'] - $current_y;
        }
        }
        
    }

    return $v;
}

// Example usage:
$s = [
    ["x" => 0, "y" => 0],
    ["x" => 1, "y" => 0],
    ["x" => 2, "y" => 0],
    ["x" => 3, "y" => 4],
    ["x" => 4, "y" => 4],
    ["x" => 5, "y" => 29],
    ["x" => 6, "y" => 4],
    ["x" => 7, "y" => 4],
    ["x" => 8, "y" => 0],
    ["x" => 9, "y" => 0],
    ["x" => 10, "y" => 0]
];

$inputData = [
    "1" => ["type" => "Length", "loc" => "0 | 10", "load" => ""],
    "2" => ["type" => "Support-pinned", "loc" => "0", "load" => ""],
    "3" => ["type" => "Support-fixed", "loc" => "10", "load" => ""],

    "4" => ["type" => "Point Load", "loc" => "5", "load" => "20"],
    "5" => ["type" => "Dt. Load", "loc" => "3 | 8", "load" => "4 | 4"],
    "7" => ["loc" => "m", "load" => "kN"]
];

$reaction = [
    "va =" => 22.5,
    "vb =" => 22.5,
    "H =" => 0
];

$modified_s = modifyArrayAtSupport($s, $inputData, $reaction);
print_r($modified_s);
?>
