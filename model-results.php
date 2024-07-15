<?php
if(isset($_POST['logout'])){
    session::destroy();
  }
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
            // $minLocationValue = $total_length; // Initialize with a large number

            // // Iterate through the array
            // foreach ($data as $support) {
            //     if(($support['type']==="Point Load") || ($support['type']==="Dt. Load") || ($support['type']==="Moment Load")){
            //         continue;
            //     }
            //     $loc = $support['loc'];
                
            //     // Extract numeric values from "loc" propertys
            //     $numericLoc = filter_var($loc, FILTER_SANITIZE_NUMBER_INT);
            
            //     if (is_numeric($numericLoc) && $numericLoc < $minLocationValue) {
            //         $minLocationValue = $numericLoc;
            //     }
            // }
           
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
           }else{ // It is an uvl load
            $length=(($integer_after_pipe+$integer_before_pipe)/3);
            if($load_end>$load_start){
$length = $length+($length-$integer_before_pipe);
            }
                $load=($integer_after_pipe-$integer_before_pipe)*(($load_start+$load_end)/2);
                $va=$va+($load*($total_length-$length)/$total_length);
                $total=$total+$load;
           }
        }
        }

    $vb=$total-$va;
    $value = [
        "va =" => $va,
        "vb =" => $vb,
        "H =" => 0
    ];
    
    return $value;
    }
}

// Fixed end moment calculation

function fixedendmoment($length,$load,$end,$start){
    $type=$load['type'];
   if($type=="Dt. Load"){
     $parts = explode("|", $load['loc']);
     if (count($parts) > 1) {
         $value_before_pipe = trim($parts[0]);
         $value_after = trim($parts[1]);  
         
         $integer_before_pipe = intval($value_before_pipe); // the values are taken from the pipe
         $integer_after_pipe = intval($value_after);
     }
     $part = explode("|", $load['load']);
     if (count($part) > 1) {
         $value_before_pipe = trim($part[0]);
         $value_after = trim($part[1]);  
         
         $load_start= intval($value_before_pipe);
         $load_end = intval($value_after);     // the values are taken from the pipe
     }
     $flag=$integer_after_pipe-$integer_before_pipe;
 
     if(($integer_before_pipe==$start) && ($integer_after_pipe==$end)){
         $moment = ($load_start * $length**2) / 12;   // calculation of fixed end moment for udl throught the entire span
         return [-$moment, $moment];
     }elseif ($start==$integer_before_pipe) {
         $w = $load_start;
         $a = $integer_after_pipe;   // for load start at begin and load within the span at the start of the span
         $l = $length;
         $formula1 = "((-(w*a^2)/(12*l^2))*((6*l^2) - (8*l*a) + (3*a^2)))";
         $formula2 = "((w*a^3)/(12*l^2)*((4*l) - (3*a)))";
         $formula1 = str_replace(['w', 'a', 'l'], [$w, $a, $l], $formula1);
         $formula2 = str_replace(['w', 'a', 'l'], [$w, $a, $l], $formula2);
         $result1 = eval("return $formula1;");
         $result2 = eval("return $formula2;");
         return [$result1,$result2];
     }else{
        print("the value is after the start"); //here we have to change for the exceptional cases formula
   
     }
 
   }elseif($type=="Point Load"){
     if((($start+$end)/2) == $load['loc']){
         $result=($load['load']*$length)/8;
         return [-$result,$result];
     }else{
         $a=$load['loc']-$start;
         $b=$end-$load['loc'];
         $result1=($load['load']*$a*$b**2)/($length**2);
         $result2=($load['load']*$a*$b**2)/($length**2);
         return[-$result1,$result2];
     }
 
 }
 }
 function moment_calculation($data){
     $supports = [];
     $lengths = [];
     $loads = [];
     
     foreach ($data as $id => $element) {
         if (strpos($element['type'], 'Support') !== false) {
             $supports[$id] = $element;
         } elseif ($element['type'] == 'Length') {
             $lengths[$id] = $element;
         } else {
             $loads[$id] = $element;
         }
     }
     
     // here determining the spans based on supports and lengths
     $spans = []; // Each element is a span defined by two supports
     $previousSupport = null;
     
     foreach ($supports as $id => $support) {
         if ($previousSupport !== null) {
             $spanId = "Span_" . $previousSupport . "_" . $id;
             $spans[$spanId] = [
                 'start' => $previousSupport,
                 'end' => $id,
                 'length' => $lengths[$id]['loc'],
                 'loads' => $loads,
             ];
         }
     
         $previousSupport = $id;
     }
     $supportPositions = [];
     foreach ($supports as $support) {
         $supportPositions[] = $support['loc'];
     }
     
     // Step 2: Sort Support Positions
     sort($supportPositions);
     
     // Step 3: Determine Spans
     $spans = [];
     for ($i = 0; $i < count($supportPositions) - 1; $i++) {
         $spanStart = $supportPositions[$i];
         $spanEnd = $supportPositions[$i + 1];
         $spans[] = ['start' => $spanStart, 'end' => $spanEnd];
     }
     
     // Step 4: Assign Loads to Spans
     $loadsInSpans = [];
     foreach ($loads as $loadId => $load) {
         if (isset($load['loc']) && isset($load['type'])) {
             $loadPosition = floatval($load['loc']);
             foreach ($spans as $spanIndex => $span) {
                 if ($loadPosition >= $span['start'] && $loadPosition < $span['end']) {
                     $loadsInSpans[$spanIndex][$loadId] = $load;
                     break;
                 }
             }
         }
     }
     $results = [];
     
 foreach ($spans as $spanIndex => $span) {
     $lengthOfspan=$span['end']-$span['start'];
     $moment=[];
    
    
     foreach ($loadsInSpans[$spanIndex] as $loadId => $load) {
         
         $fixedEndMoment = fixedendmoment($lengthOfspan,$load,$span['end'],$span['start']);
         $moment[0] += round($fixedEndMoment[0],2);
         $moment[1] += round($fixedEndMoment[1],2);
      
     }
     $results['span'.$spanIndex+1]=$moment;
 
 }
 return $results;
     
 
 }

 function calculateShearForce($inputData) {
    // Initialize an array to store shear force points
    $shearForcePoints = [];

    // Parse the input JSON data

$data =$inputData;
    // Check if input data is valid
    if (!$data || !is_array($data)) {
        return $shearForcePoints; // Return empty array if input is invalid
    }

    // Initialize variables to store support types and locations
    $supports = [];

    // Iterate through each item in the data
    foreach ($data as $key => $item) {
        if (isset($item['type']) && strpos($item['type'], 'Support') !== false) {
            $supports[] = [
                'loc' => intval($item['loc']),
                'type' => $item['type']
            ];
        }
    }

    // Sort supports by location
    usort($supports, function($a, $b) {
        return $a['loc'] - $b['loc'];
    });

    // Calculate shear force points
    $prevLoc = 0;
    foreach ($supports as $support) {
        $loc = $support['loc'];
        for ($x = $prevLoc; $x <= $loc; $x++) {
            $shearForcePoints[] = [
                'x' => $x,
                'y' => calculateShearAt($x, $data)
            ];
        }
        $prevLoc = $loc + 1; // Move past the current support location
    }

    // Calculate shear force at the end of the span
    $lastLoc = $data['1']['loc'];
    for ($x = $prevLoc; $x <= $lastLoc; $x++) {
        $shearForcePoints[] = [
            'x' => $x,
            'y' => calculateShearAt($x, $data)
        ];
    }

    return $shearForcePoints;
}

function calculateShearAt($x, $data) {
    // Initialize shear force
    $shearForce = 0;

    // Iterate through each load to calculate shear force
    foreach ($data as $key => $item) {
        switch ($item['type']) {
            case 'Point Load':
                if ($item['loc'] == $x) {
                    $shearForce += intval($item['load']);
                }
                break;
            case 'Dt. Load':
                $loadLocs = explode(' | ', $item['loc']);
                $loadVals = explode(' | ', $item['load']);
                $loadStart = intval($loadVals[0]);
                $loadEnd = intval($loadVals[1]);
                $loadStartLoc = intval($loadLocs[0]);
                $loadEndLoc = intval($loadLocs[1]);

                if ($x >= $loadStartLoc && $x <= $loadEndLoc) {
                    $length = $loadEndLoc - $loadStartLoc;
                    $shearForce += $loadStart + (($loadEnd - $loadStart) / $length) * ($x - $loadStartLoc);
                }
                break;
        }
    }

    return $shearForce;
}

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $model_data_json = $_POST['model_data_json'];
    
    // Decode the JSON data to a PHP array
    $model_data = json_decode($model_data_json, true);

    $reaction=reaction_calc($model_data['model']);
    $EndMoment=moment_calculation($model_data['model']);
    $ForcePoints = calculateShearForce($model_data['model']);
    $shearpoints =modifyArrayAtSupport($ForcePoints,$model_data['model'],$reaction);
   
    $response = array(
        'success' => true,
        'result' => $reaction,
        'data' => array($EndMoment),
        'shearpoints' => array($shearpoints)
    );
} else {
    $response = array(
        'success' => false,
        'result' => 'No data received.',
        'data' => "hello"
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
   
//     "4": {
//         "type": "Point Load",
//         "loc": "5",
//         "load": "25"
//     },
//     "5": {
//         "loc": "m",
//         "load": "kN"
//     }
// }
// ';

// $reactions = [
//     "va =" => 12.5,
//     "vb =" => 12.5,
//     "H =" => 0
// ];

// $array_hello = json_decode($hello, true);
// $ForcePoints = calculateShearForce($hello);
// $reaction=reaction_calc($array_hello);
// $shearpoints =modifyArrayAtSupport($ForcePoints,$array_hello,$reaction);
// print_r($shearpoints);

?>