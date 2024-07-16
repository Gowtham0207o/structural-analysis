<?php
function calculateShearForce($inputData) {
    // Initialize an array to store shear force points
    $shearForcePoints = [];

    // Parse the input JSON data
    $data = json_decode($inputData, true);

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

// Example usage:
$inputData = '{
    "1": {
        "type": "Length",
        "loc": "0 | 10",
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
 
    "4": {
        "type": "Point Load",
        "loc": "5",
        "load": "25"
    },
    "5": {
        "type": "Dt. Load",
        "loc": "3 | 8",
        "load": "4 | 4"
    },
 
    "7": {
        "loc": "m",
        "load": "kN"
    }
}';

// Calculate shear force points
$shearForcePoints = calculateShearForce($inputData);

// Output the result
echo json_encode($shearForcePoints, JSON_PRETTY_PRINT);
