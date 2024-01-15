<?php
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
        print($span['start']);
        
        $fixedEndMoment = fixedendmoment($lengthOfspan,$load,$span['end'],$span['start']);
        $moment[0] += $fixedEndMoment[0];
        $moment[1] += $fixedEndMoment[1];
     
    }
    $results[$spanIndex]=$moment;

}
    

}


$hello='
  {  "1": {
        "type": "Length",
        "loc": "0 | 20",
        "load": ""
    },
    "2": {
        "type": "Support-pinned",
        "loc": "0",
        "load": ""
    },
    "3": {
        "type": "Support-fixed",
        "loc": "10",
        "load": ""
    },
    "7": {
        "type": "Support-roller",
        "loc": "20",
        "load": ""
    },
    "8": {
        "type": "Dt. Load",
        "loc": "0 | 10",
        "load": "10 | 10"
    },
    "4": {
        "type": "Point Load",
        "loc": "7",
        "load": "5"
    },
    "6": {
        "type": "Point Load",
        "loc": "15",
        "load": "10"
    },
    "5": {
        "loc": "m",
        "load": "kN"
    }
}
';
$new=json_decode($hello,true);
$s=moment_calculation($new);
?>
