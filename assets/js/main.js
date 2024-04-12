$(document).ready(function() {

	// Initiate the wowjs animation library
  	new WOW().init()

	// Back to top button
	$(window).scroll(function() {
	    if ($(this).scrollTop() > 100) {
	      $('.back-to-top').fadeIn('slow');
	    } else {
	      $('.back-to-top').fadeOut('slow');
	    }
	});

	$('.back-to-top').click(function() {
	    $('html, body').animate({
	      scrollTop: 0
	    }, 1500, 'easeInOutExpo');
	    return false;
	});

    $(".modal").on('shown.bs.modal', function () {
        $("[data-modalfocus]", this).focus();
    });

    $("#get-quote").click(function() {

   	scroll_to('accounts');

	});

	$("#beam-length").keyup(function(event) {

	    if (event.keyCode == 13) {
	        add_beam_length();
	    }

	});

	$("#end-dload").keyup(function(event) {
		
		if(document.getElementById("end-dload").value == ""){
	    	$("#end-dload").val($('#start-dload').val());
	    	$(this).select();
	    }
	});

	function update_dload() {
  	$("#end-dload").val($('#start-dload').val());
	}

	$('[data-toggle="tooltip"]').tooltip();

	$(".doc-toggle").click(function(){
		$('.doc-toggle').removeClass("active");
		var was_visible = $(this).next("ul").hasClass("dropdown-visible");
		$('#sidebar').find('ul li ul').slideUp();
		$(this).next("ul").toggle();
		$('#sidebar').find('ul li ul').removeClass("dropdown-visible");
		//$('#sidebar').find('ul li ul').removeClass("dropdown-invisible");
		if(!was_visible){
			$(this).next("ul").removeClass("dropdown-invisible");
			$(this).next("ul").addClass("dropdown-visible");
			$(this).addClass("active");
        }else{
        	$(this).next("ul").addClass("dropdown-invisible");
        }
    });

});

$(document).keypress(function(e) {

  	if ($("#add-pinned-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
    	document.getElementById("add-pinned-support").click();
  	}
  	if ($("#add-roller-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
    	document.getElementById("add-roller-support").click();
  	}
  	if ($("#add-fixed-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
    	document.getElementById("add-fixed-support").click();
  	}
  	if ($("#add-point-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
    	document.getElementById("add-point-load").click();
  	}
	if ($("#add-distributed-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
	    document.getElementById("add-distributed-load").click();
	}
	if ($("#add-moment-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
	    document.getElementById("add-moment-load").click();
	}
	if ($("#section-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
	    document.getElementById("add-section").click();
	}
	if ($("#save-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
	    document.getElementById("save-model").click();
	}
	if ($("#saveas-modal").hasClass('in') && (e.keycode == 13 || e.which == 13)) {
	    document.getElementById("saveas-model").click();
	}

});

$("#run-model").click(function() {

	
	setTimeout(function(){
		var variables = inputs_from_table();
		var units = {};
		var length_selection = document.getElementById("select-length");
		var force_selection = document.getElementById("select-force");
		units["loc"] = length_selection.options[length_selection.selectedIndex].value;
		units["load"] = force_selection.options[force_selection.selectedIndex].value;
		variables[Object.keys(variables).length + 1] = units;
		var sections = inputs_from_sections_table();
		var model_data = {};
		model_data['model'] = variables;
		model_data['sections'] = inputs_from_sections_table();
		model_data['structure_type'] =structure_type();
		//download_object_as_json(model_data, 'Example 2');	
		var structure_typ = structure_type();
		if(structure_typ == "unstable"){
			var	error = "The model defined is unstable";
		
			document.getElementById("o-beam-updates").innerHTML = error;
			$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
			
			return;
		}/*else if(structure_typ == "indeterminate"){
			var logged_in = user_logged_in();
			if(logged_in == 0){upgrade_account_modal(); stopSpinner(); return;}
		}*/
		var	error = "The model defined is";
		document.getElementById("o-beam-updates").innerHTML = error.concat(structure_typ);
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		
		var model_output = ajax_call_wcf(model_data);
		console.log(model_output.shearpoints);
		ClearCharts();
		var reactions_output = document.getElementById('reaction-results');
		reactions_output.innerHTML = obj_to_string(model_output.result);
		var fem_output = document.getElementById('moment-results');
		
		for (var i = 0; i < model_output.data.length; i++) {
			fem_output.innerHTML +=  obj_to_string(model_output.data[i]);
		}
		
		var select_length = document.getElementById("select-length");
		var length_text = select_length.options[select_length.selectedIndex].value;
		var select_force = document.getElementById("select-force");
		var force_text = select_force.options[select_force.selectedIndex].value;
		var section_length_elements = document.getElementsByClassName("section-length-unit");// Find the elements
	    var section_length_text =  section_length_elements[0].innerText;
	    var section_stress_elements = document.getElementsByClassName("section-stress-unit");
	    var section_stress_text = section_stress_elements[0].innerText;
	
		var result_sheardata = GenerateShearForceData(model_output.result,10);
		console.log(result_sheardata);
		MakeShearChart(result_sheardata, 'Shear (' + force_text +')');
		MakeMomentChart(model_output.momentPoints, 'Moment (' + force_text + '-' + length_text + ')');
		if(model_output.slopePoints.length !== 0){MakeSlopeChart(model_output.slopePoints, 'Slope (Deg)');}
		if(model_output.deflectionPoints.length !== 0){MakeDeflectionChart(model_output.deflectionPoints, 'Deflection (' + section_length_text +')')};
		if(model_output.shearStressPoints.length !== 0){MakeShearStressChart(model_output.shearStressPoints, 'Shear Stress (' + section_stress_text +')')};
		if(model_output.bendingStressBottomPoints.length !== 0){MakeBendingStressChart(model_output.bendingStressBottomPoints, model_output.bendingStressTopPoints, 'Bend. Stress (' + section_stress_text +')')};
		scroll_to('analysis-results');
		stopSpinner();
	}, 0);

});
function GenerateShearForceData(reactionData, beamLength) {
	var va = reactionData["va = "];
	var vb = reactionData["vb = "];
	var H = reactionData["H = "];
  
	// Initialize an empty array to store shear force data points
	var shearData = [];
  
	// Add the first data point (x=0, y=va)
	shearData.push({ "x": 0, "y": va });
  
	// Calculate and add intermediate data points along the beam
	for (var x = 1; x <= beamLength; x++) {
	  var shear = va - (H / beamLength) * x;
	  shearData.push({ "x": x, "y": shear });
	}
  
	// Add the last data point (x=beamLength, y=vb)
	shearData.push({ "x": beamLength, "y": vb });
  
	return shearData;
  }
  

function structure_type(){
	var supports = supports_from_table();
	var unknowns = 0;
	for (var i = 0; i < supports.length; i++){
		if(supports[i].type == "Support-pinned"){
			unknowns = unknowns + 2;
			continue;
		}else if(supports[i].type == "Support-fixed"){
			unknowns = unknowns + 3;
			continue;
		}else if(supports[i].type == "Support-roller"){
			unknowns = unknowns + 1;
			continue;
		};
	}
	console.log(unknowns);
	var type;
	if(unknowns <= 2){return type = "unstable";}
	if(unknowns == 3){return type = "determinate";}
	if(unknowns > 3){return type = "indeterminate";}
}
function ajax_call_wcf(model_data) {
    var model_data_json = JSON.stringify(model_data);
    var result_and_data = {};

    $.ajax({
        type: 'POST',
        async: false,
        dataType: 'json',
        data: { model_data_json: model_data_json },
        url: "../../model-results.php",
        success: function (data) {
            if (data.success) {
                if (data.result) {
                    console.log('Reaction forces:', data.result);
                    document.getElementById('o-beam-updates').innerHTML = "Reaction forces: " + data.result;
                    var reaction = JSON.stringify(data.result);

                    // Set the result property in the result_and_data object
                    result_and_data.result = JSON.parse(reaction);
                } else {
                    console.log('Invalid response from the server.');
                }

                // Check if data.data exists and set it in the result_and_data object
                if (data.data) {
                    console.log('Additional data:', data.data);
                    result_and_data.data = data.data;
                }
            } else {
                console.log('Invalid response from the success');
            }
			
        }
		
    });

    return result_and_data;
}


function inputs_from_table(){

	var variables = {};
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;

	var input_id = ["type","loc","load"];
	//loops through rows
	var variables = {};
	for (var i = 1; i < row_length; i++){
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;
	   	//create array for cell inputs
	   	var inputs = {};
		//loops through each cell in current row
		for(var j = 0; j < cell_length-1; j++){
			//get your cell info here
			var cell_val = cells.item(j).innerHTML;
			inputs[input_id[j]] = cell_val;
			//inputs.push({'input_id[j]': cell_val});
		}
		variables[i] = inputs;
	}
	return variables;

}

function inputs_from_sections_table(){

	var variables = {};
	//gets table
	var table = document.getElementById('table-section-properties');
	//gets rows of table
	var row_length = table.rows.length;

	var input_id = ["section","loc","properties"];
	//loops through rows
	var variables = {};
	for (var i = 1; i < row_length; i++){
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;
	   	//create array for cell inputs
	   	var inputs = {};
		//loops through each cell in current row
		for(var j = 0; j < cell_length-1; j++){
			//get your cell info here
			var cell_val = cells.item(j).innerHTML;
			inputs[input_id[j]] = cell_val;
			//inputs.push({'input_id[j]': cell_val});
		}
		variables[i] = inputs;
	}
	return variables;

}

function current_unit_system() {

	var length_selection = document.getElementById("select-length");
	var system = "imperial";
	var current_length_unit = length_selection.options[length_selection.selectedIndex].value;
	if (current_length_unit == "m" || current_length_unit == "cm" || current_length_unit == "mm"){
		return system = "metric";
	}
	return system;

}

function switch_unit_system() {

	var length_selection = document.getElementById("select-length");
	var force_selection = document.getElementById("select-force");
	var current_length_unit = length_selection.options[length_selection.selectedIndex].value;
	var length_text;
	var force_text;
	var section_length_text;
	var section_stress_text;
	if (current_length_unit == "m" || current_length_unit == "cm" || current_length_unit == "mm"){
		length_selection.innerHTML =    "<option value='in'>in</option>"
                                            +"<option value='ft'>ft</option>";
        force_selection.innerHTML =    "<option value='lb'>lb</option>"
                                      +"<option value='kip'>kip</option>";
        length_text = 'in';
        force_text = 'lb';
        section_length_text = 'in';
        section_stress_text = 'ksi';
	} else {
		length_selection.innerHTML =    "<option value='m'>m</option>"
                                            +"<option value='cm'>cm</option>"
                                            +"<option value='mm'>mm</option>";
        force_selection.innerHTML =    "<option value='kN'>kN</option>"
                                      +"<option value='N'>N</option>";
        length_text = 'm';
        force_text = 'kN';
        section_length_text = 'mm';
        section_stress_text = 'MPa';
	}
	convert_sections_unit(current_length_unit, length_text, section_length_text, section_stress_text);
	convert_unit_system();

}

function convert_unit_system() {

	change_length_unit();
	change_force_unit();
}

function change_class_units(length_text, force_text, section_length_text, section_stress_text){

	length_text = length_text || '';
	force_text = force_text || '';
	section_length_text = section_length_text || '';
	section_stress_text = section_stress_text || '';

	if(length_text != ''){
		var length_elements = document.getElementsByClassName("length-unit");// Find the elements
	    for(var i = 0; i < length_elements.length; i++){
	    length_elements[i].innerText = length_text;// Change the content
	    }	
	}
	if(force_text != ''){
	    var force_elements = document.getElementsByClassName("force-unit");
	    for(var i = 0; i < force_elements.length; i++){
	    force_elements[i].innerText = force_text;
	    }
	}
	if(section_length_text != ''){
	    var section_length_elements = document.getElementsByClassName("section-length-unit");
	    for(var i = 0; i < section_length_elements.length; i++){
	    section_length_elements[i].innerText = section_length_text;
	    }
	}
	if(section_stress_text != ''){
	    var section_stress_elements = document.getElementsByClassName("section-stress-unit");
	    for(var i = 0; i < section_stress_elements.length; i++){
	    section_stress_elements[i].innerText = section_stress_text;
	    }
	}

}

function convert_sections_unit(current_length_unit, length_text, section_length_text, section_stress_text){

	change_class_units(undefined, undefined, section_length_text, section_stress_text);
	var table = document.getElementById('table-section-properties');
	var row_length = table.rows.length;
	var modulus;
	var inertia;
	var area;
	var y_top;
	var y_bot;
	for (var i = 1; i < row_length; i++){
		var cells = table.rows.item(i).cells;
		var properties_arr = [["E", modulus], ["I", inertia], ["A", area], ["Y-top", y_top], ["Y-bot", y_bot]];
	    var sp = cells.item(2).innerHTML.split('|');
	    for (var j = 0; j < sp.length; j++) {
	        var sub = sp[j].split('=');
	        for (var k = 0; k < properties_arr.length; k++) {
	            if(sub[0].trim() == properties_arr[k][0]){
	            	properties_arr[k][1] = sub[1].trim();
	            	break;
	            }
	        }
	    }
	    properties_arr = convert_section_unit(current_length_unit, properties_arr, section_length_text);
	    var properties = '';
		for(var m=0; m<properties_arr.length; m++){
			if(properties_arr[m][1] != "") {
				properties = properties + properties_arr[m][0] + "=" + properties_arr[m][1] + " | ";
			}
		}
		if(properties !=""){
			properties = properties.slice(0, -3);
		}
		cells.item(2).innerHTML = properties;
	}

}

function convert_section_unit(current_unit, properties_arr, new_unit){

	if(current_unit == "cm" || current_unit == "m"){
		current_unit = "mm";
	}else if(current_unit == "ft"){
		current_unit = "in";
	}
	for(var i=0; i<properties_arr.length; i++){
		if(properties_arr[i][0] == "E") {
			var elasticity;
			if(current_unit == "mm" && new_unit == "in"){
				elasticity = properties_arr[i][1]*0.1450377;
	    		properties_arr[i][1] = elasticity.toFixed(4).replace(/[.,]0000$/, "");
	    	}else if(current_unit == "in" && new_unit == "mm"){
	    		elasticity = properties_arr[i][1]/0.1450377;
	    		properties_arr[i][1] = elasticity.toFixed(4).replace(/[.,]0000$/, "");
	    	}
	    	continue;
		}
		if(properties_arr[i][0] == "I") {
			properties_arr[i][1] = conversion_inertia(current_unit, properties_arr[i][1], new_unit).toFixed(4).replace(/[.,]0000$/, "");
			continue;
		}
		if(properties_arr[i][0] == "A") {
			properties_arr[i][1] = conversion_area(current_unit, properties_arr[i][1], new_unit).toFixed(4).replace(/[.,]0000$/, "");
			continue;
		}
		if(properties_arr[i][0] == "Y-top" || properties_arr[i][0] == "Y-bot") {
			properties_arr[i][1] = conversion_length(current_unit, properties_arr[i][1], new_unit).toFixed(4).replace(/[.,]0000$/, "");
			continue;
		}
	}
	return properties_arr;

}

function convert_section_unit_database(current_length_unit, length_text, section_length_text, section_stress_text){

	change_elasticity();
	var area = document.getElementById("area");
	var modulus = document.getElementById("modulus-of-elasticity");
	var select_material = document.getElementById("select-material");
	var inertia = document.getElementById("moment-of-inertia");
	var y_top = document.getElementById("y-top");
	var y_bottom = document.getElementById("y-bottom");
	var new_area = conversion_area(current_length_unit, area.value, section_length_text);
	var new_y_top = conversion_length(current_length_unit, y_top.value, section_length_text);
	var new_y_bottom = conversion_length(current_length_unit, y_bottom.value, section_length_text);
	var new_inertia = conversion_inertia(current_length_unit, inertia.value, section_length_text);
	area.value = new_area.toFixed(4).replace(/[.,]0000$/, "");
	y_top.value = new_y_top.toFixed(4).replace(/[.,]0000$/, "");
	y_bottom.value = new_y_bottom.toFixed(4).replace(/[.,]0000$/, "");
	inertia.value = new_inertia.toFixed(4).replace(/[.,]0000$/, "");

}


function change_length_unit(){

	var select_length = document.getElementById("select-length");
	var current_length_unit = document.getElementsByClassName("length-unit")[0].innerHTML;
	var new_length_unit = select_length.options[select_length.selectedIndex].value;
	change_class_units(new_length_unit, undefined, undefined, undefined);
	var table = document.getElementById('table-variables');
	var row_length = table.rows.length;
	var beam_length = return_beam_length();
	if(!isNaN(beam_length)){
		document.getElementById('beam-length').value = conversion_length(current_length_unit,  beam_length, 
			new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
	}
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var cells = table.rows.item(i).cells;
		if (cells.item(1).innerHTML.indexOf('|') > -1){
			var location_1 = parseFloat(cells.item(1).innerHTML.split("|")[0].trim());
			var location_2 = parseFloat(cells.item(1).innerHTML.split("|")[1].trim());
			var location_1_convert = conversion_length(current_length_unit,  location_1, 
			new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
			var location_2_convert = conversion_length(current_length_unit,  location_2, 
			new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
			cells.item(1).innerHTML = location_1_convert + ' | ' + location_2_convert;
			if(cells.item(0).innerHTML == "Dt. Load"){
				var load_1 = parseFloat(cells.item(2).innerHTML.split("|")[0].trim());
				var load_2 = parseFloat(cells.item(2).innerHTML.split("|")[1].trim());
				var load_1_convert = force_length_conversion(current_length_unit,  load_1, 
				new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
				var load_2_convert = force_length_conversion(current_length_unit,  load_2, 
			new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
				cells.item(2).innerHTML = load_1_convert + ' | ' + load_2_convert;
			}
		}else if(cells.item(1).innerHTML == ''){
			continue;
		} else{
			cells.item(1).innerHTML = conversion_length(current_length_unit,  parseFloat(cells.item(1).innerHTML), 
				new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
			if(cells.item(0).innerHTML.charAt(0) == "M"){
				cells.item(2).innerHTML = conversion_length(current_length_unit, 
					parseFloat(cells.item(2).innerHTML), new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
			}
		}
	}
    var sections_table = document.getElementById('table-section-properties');
	var sections_row_length = sections_table.rows.length;
	for (var i = 1; i < sections_row_length; i++){
		var cells = sections_table.rows.item(i).cells;
		var location_1 = parseFloat(cells.item(1).innerHTML.split("|")[0].trim());
		var location_2 = parseFloat(cells.item(1).innerHTML.split("|")[1].trim());
		var location_1_convert = conversion_length(current_length_unit,  location_1, 
		new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
		var location_2_convert = conversion_length(current_length_unit,  location_2, 
		new_length_unit).toFixed(4).replace(/[.,]0000$/, "");
		cells.item(1).innerHTML = location_1_convert + ' | ' + location_2_convert;
	}
}

function conversion_length(current_unit, current_value, new_unit){

	if(current_unit == "m" && new_unit == "in"){return current_value/0.0254;
	}else if(current_unit == "m" && new_unit == "cm"){return current_value*100;
	}else if(current_unit == "m" && new_unit == "mm"){return current_value*1000;
	}else if(current_unit == "cm" && new_unit == "in"){return current_value/2.54;
	}else if(current_unit == "cm" && new_unit == "m"){return current_value/100;
	}else if(current_unit == "cm" && new_unit == "mm"){return current_value*10;
	}else if(current_unit == "mm" && new_unit == "in"){return current_value/25.4;
	}else if(current_unit == "mm" && new_unit == "cm"){return current_value/10;
	}else if(current_unit == "mm" && new_unit == "m"){return current_value/1000;
	}else if(current_unit == "in" && new_unit == "m"){return current_value*0.0254;
	}else if(current_unit == "in" && new_unit == "mm"){return current_value*25.4;
	}else if(current_unit == "in" && new_unit == "ft"){return current_value/12;
	}else if(current_unit == "ft" && new_unit == "m"){return current_value*0.3048;
	}else if(current_unit == "ft" && new_unit == "in"){return current_value*12;
	}else if(current_unit == new_unit){return current_value;}

}

function conversion_area(current_unit, current_value, new_unit){

	if(current_unit == "m" && new_unit == "in"){return current_value/Math.pow(25.4,2);
	}else if(current_unit == "cm" && new_unit == "in"){return current_value/Math.pow(25.4,2);
	}else if(current_unit == "mm" && new_unit == "in"){return current_value/Math.pow(25.4,2);
	}else if(current_unit == "in" && new_unit == "mm"){return current_value*Math.pow(25.4,2);
	}else if(current_unit == "ft" && new_unit == "mm"){return current_value*Math.pow(25.4,2);}

}

function conversion_inertia(current_unit, current_value, new_unit){

	if(current_unit == "m" && new_unit == "in"){return current_value/Math.pow(25.4,4);
	}else if(current_unit == "cm" && new_unit == "in"){return current_value/Math.pow(25.4,4);
	}else if(current_unit == "mm" && new_unit == "in"){return current_value/Math.pow(25.4,4);
	}else if(current_unit == "in" && new_unit == "mm"){return current_value*Math.pow(25.4,4);
	}else if(current_unit == "ft" && new_unit == "mm"){return current_value*Math.pow(25.4,4);}

}

function change_force_unit(){

	var select_force = document.getElementById("select-force");
	var current_force_unit = document.getElementsByClassName("force-unit")[0].innerHTML;
	var new_force_unit = select_force.options[select_force.selectedIndex].value;
	change_class_units(undefined, new_force_unit, undefined, undefined);
	var table = document.getElementById('table-variables');
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var cells = table.rows.item(i).cells;
		if(cells.item(2).innerHTML.indexOf('|') > -1){
			var load_1 = parseFloat(cells.item(2).innerHTML.split("|")[0].trim());
			var load_2 = parseFloat(cells.item(2).innerHTML.split("|")[1].trim());
			var load_1_convert = conversion_force(current_force_unit,  load_1, 
			new_force_unit).toFixed(4).replace(/[.,]0000$/, "");
			var load_2_convert = conversion_force(current_force_unit,  load_2, 
			new_force_unit).toFixed(4).replace(/[.,]0000$/, "");
			cells.item(2).innerHTML = load_1_convert + ' | ' + load_2_convert;
		}else if(cells.item(2).innerHTML == ''){
			continue;
		}else{
			cells.item(2).innerHTML = conversion_force(current_force_unit, 
				parseFloat(cells.item(2).innerHTML), new_force_unit).toFixed(4).replace(/[.,]0000$/, "");
		}
	}

}

function conversion_force(current_unit, current_value, new_unit){

	if(current_unit == "kN" && new_unit == "N"){return current_value*1000;
	}else if(current_unit == "kN" && new_unit == "lb"){return current_value/0.004448221628250858;
	}else if(current_unit == "N" && new_unit == "kN"){return current_value/1000;
	}else if(current_unit == "N" && new_unit == "lb"){return current_value/4.448221628250858;
	}else if(current_unit == "lb" && new_unit == "kip"){return current_value/1000;
	}else if(current_unit == "lb" && new_unit == "kN"){return current_value*0.004448221628250858;
	}else if(current_unit == "kip" && new_unit == "lb"){return current_value*1000;
	}else if(current_unit == "kip" && new_unit == "kN"){return current_value*4.448221628250858;}

}

function force_length_conversion(current_unit, current_value, new_unit){

	if(current_unit == "m" && new_unit == "in"){return current_value*0.0254;
	}else if(current_unit == "m" && new_unit == "cm"){return current_value/100;
	}else if(current_unit == "m" && new_unit == "mm"){return current_value/1000;
	}else if(current_unit == "cm" && new_unit == "in"){return current_value*2.54;
	}else if(current_unit == "cm" && new_unit == "m"){return current_value*100;
	}else if(current_unit == "cm" && new_unit == "mm"){return current_value/10;
	}else if(current_unit == "mm" && new_unit == "in"){return current_value*25.4;
	}else if(current_unit == "mm" && new_unit == "cm"){return current_value*10;
	}else if(current_unit == "mm" && new_unit == "m"){return current_value*1000;
	}else if(current_unit == "in" && new_unit == "m"){return current_value/0.0254;
	}else if(current_unit == "in" && new_unit == "mm"){return current_value/25.4;
	}else if(current_unit == "in" && new_unit == "ft"){return current_value*12;
	}else if(current_unit == "ft" && new_unit == "m"){return current_value/0.3048;
	}else if(current_unit == "ft" && new_unit == "in"){return current_value/12;
	}else if(current_unit == new_unit){return current_value;}

}

function user_logged_in(){

	var logged_in;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=check",
	}).done(function(result) {
	   logged_in = JSON.parse(result);
	});
	return logged_in;

}

function user_account_type(){

	var account;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=account",
	}).done(function(result) {
	   account = JSON.parse(result);
	});
	return account;

}

function user_has_access(){

	var access;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=free-access",
	}).done(function(result) {
	   access = JSON.parse(result);
	});
	return access;

}

function user_model_count(){

	var count;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=model-count",
	}).done(function(result) {
	   count = JSON.parse(result);
	});
	return count;

}

function upgrade_account_modal(){

	$.ajax({
	  	type: "GET",
	  	async: false,
	  	url: "server-calls.php?g=upgrade-modal-count",
	});
	$('#upgrade-account-modal').modal('show');
}

function upgrade_modal_button(){
	window.open("pricing.php", "_blank");
	$.ajax({
	  	type: "GET",
	  	async: false,
	  	url: "server-calls.php?g=upgrade-button-count",
	});
}

$('#add-fixed-modal').on('hidden.bs.modal', function () {

	var fixed_location_select = document.getElementById('fixed-location-select');
	fixed_location_select.value = 'Left';
    $(this).find('input').val('0');

});

$('#add-pinned-modal').on('hidden.bs.modal', function () {

	var pinned_location_select = document.getElementById('pinned-location-select');
	pinned_location_select.value = 'Other';
    var support_location = document.getElementById('pinned-location');
	support_location.disabled = false;
	support_location.value = '';

});

$('#add-roller-modal').on('hidden.bs.modal', function () {

	var roller_location_select = document.getElementById('roller-location-select');
	roller_location_select.value = 'Other';
    var support_location = document.getElementById('roller-location');
	support_location.disabled = false;
	support_location.value = '';

});

function edit_input(element){

	//if(beam_length_check() == false){return;}
	var beam_length = document.getElementById('beam-length').value;
	var parent = element.parentNode.parentNode;
	var cells = parent.cells;
	var row_index = parent.rowIndex;
	var type = cells.item(0).innerHTML;
	var location = cells.item(1).innerHTML;
	if(type.charAt(0) == "S"){
		var support_type = type.split('-')[1];
		edit_support(row_index, support_type, location);
		return false;	
	} else if(type.charAt(0) == "P"){
		var load = cells.item(2).innerHTML;
		var load_type = "point";
		edit_load(row_index, load_type, location, load, undefined, undefined);
		return false;
	} else if(type.charAt(0) == "M"){
		var load = cells.item(2).innerHTML;
		var load_type = "moment";
		edit_load(row_index, load_type, location, load, undefined, undefined);
		return false;
	} else if (type.charAt(0) == "D") {
		var load_1 = parseFloat(cells.item(2).innerHTML.split("|")[0].trim());
		var load_2 = parseFloat(cells.item(2).innerHTML.split("|")[1].trim());
		var location_1 = location.split("|")[0].trim();
		var location_2 = location.split("|")[1].trim();
		var load_type = "distributed";
		edit_load(row_index, load_type, location_1, load_1, location_2, load_2);
		return false;
	}
	return false;
}

function edit_support(row_index, support_type, location){

	var beam_length = document.getElementById('beam-length').value;
	$('#add-' + support_type + '-modal').modal('show');
	document.getElementById('add-' + support_type + '-support').innerHTML = 'Update';
	document.getElementById('add-another-' + support_type + '-support').style.visibility = 'hidden';
	document.getElementById('add-' + support_type + '-support').setAttribute( "onClick", "update_support(" + row_index + ")" );
	var location_select = document.getElementById(support_type + '-location-select');
	var location_string = location_select.options[location_select.selectedIndex].value;
	var support_location = document.getElementById(support_type + '-location');
	location_select.value = "Other"
	support_location.disabled = false;
	support_location.value = location;
	support_location.select();
	/*if(location == 0){
		location_select.value = "Left"
		support_location.disabled = true;
		support_location.value = "0";
	}else if(location == beam_length){
		location_select.value = "Right"
		support_location.disabled = true;
		support_location.value = beam_length;
	}else{
	}*/

}

function edit_load(row_index, load_type, location_1, load_1, location_2 , load_2 ){

	if (location_2 === undefined) {
        location_2 = "";
    }
	var beam_length = document.getElementById('beam-length').value;
	$('#add-' + load_type + '-modal').modal('show');
	document.getElementById('add-another-' + load_type + '-load').style.visibility = 'hidden';
	document.getElementById('add-' + load_type + '-load').innerHTML = 'Update';
	if(location_2 == ''){
		document.getElementById(load_type + '-location').value = location_1;
		document.getElementById(load_type + '-load').value = load_1;
		document.getElementById(load_type + '-location').select();
		document.getElementById('add-' + load_type + '-load').setAttribute( "onClick", "update_load(" + row_index + ")" );
	} else{
		document.getElementById('start-dlocation').value = location_1;
		document.getElementById('end-dlocation').value = location_2;
		document.getElementById('start-dload').value = load_1;
		document.getElementById('end-dload').value = load_2;
		document.getElementById('start-dlocation').select();
		document.getElementById('add-' + load_type + '-load').setAttribute( "onClick", "update_distributed_load(" + row_index + ")" );
	}

}

function edit_properties(element){

	var parent = element.parentNode.parentNode;
	var row_index = parent.rowIndex;
	var table = document.getElementById("table-section-properties");
	var cells = table.rows.item(row_index).cells;
	var section_name = cells.item(0).innerHTML;

	document.getElementById('add-section').innerHTML = 'Update Section';
	document.getElementById('add-section').setAttribute( "onClick", "update_beam_section(" + row_index + ")" );
	var area = document.getElementById("area");
	var modulus = document.getElementById("modulus-of-elasticity");
	var select_material = document.getElementById("select-material");
	var inertia = document.getElementById("moment-of-inertia");
	var y_top = document.getElementById("y-top");
	var y_bot = document.getElementById("y-bottom");
	var section_name_modal = document.getElementById("section-name-modal");
	var section_selected = document.getElementById("sel1");
	var section_start_location = document.getElementById('section-start-location');
	var section_end_location = document.getElementById('section-end-location');
	section_selected.value = "New Section";

	var properties_arr = [["E", modulus], ["I", inertia], ["A", area], ["Y-top", y_top], ["Y-bot", y_bot]];
    var sp = cells.item(2).innerHTML.split('|');
    for (var i = 0; i < sp.length; i++) {
        var sub = sp[i].split('=');
        for (var j = 0; j < properties_arr.length; j++) {
            if(sub[0].trim() == properties_arr[j][0]){
            	properties_arr[j][1].value = sub[1].trim();
            	break;
            }
        }
    }

	section_start_location.value = cells.item(1).innerHTML.split('|')[0].trim();
	section_end_location.value = cells.item(1).innerHTML.split('|')[1].trim();;
	section_name_modal.value = section_name;

	var current_system = current_unit_system();
	if(current_system == "imperial"){
		if(modulus.value == "29000"){
			modulus.disabled = true;
			select_material.value = "Steel";
		}else if(modulus.value == "10000"){
			modulus.disabled = true;
			select_material.value = "Aluminium";
		}else if(modulus.value == "1595"){
			modulus.disabled = true;
			select_material.value = "Wood";
		}else{
			modulus.disabled = false;
			select_material.value = "Other";
		}
	}else{
		if(modulus.value == "200000"){
			modulus.disabled = true;
			select_material.value = "Steel";
		}else if(modulus.value == "69000"){
			modulus.disabled = true;
			select_material.value = "Aluminium";
		}else if(modulus.value == "11000"){
			modulus.disabled = true;
			select_material.value = "Wood";
		}else{
			modulus.disabled = false;
			select_material.value = "Other";
		}
	}
	open_modal('section-modal');
	section_retrieve_database();
	var section_selected = document.getElementById("sel1");
	section_selected.value = "";
	return false;

}

function update_support(row_index){

	var beam_length = return_beam_length();
	var table = document.getElementById('table-variables');
	var cells = table.rows.item(row_index).cells;
	var support_type = cells.item(0).innerHTML.split('-')[1];
	var location = document.getElementById(support_type + '-location').value;
	if(is_numeric(location) == false){ return;}
	var check = between(parseFloat(location), 0, beam_length);
	if(check == false){ return;}
	var existing_supports = supports_from_table();
	var exists = false;
	var error = "";
	for (var i = 0; i < existing_supports.length; i++){
		if(existing_supports[i]['location'] == location){
			exists = true;
			error = "There is already a support at that location"
			break;
		}
	}
	if(error != ""){
		document.getElementById("o-beam-updates").innerHTML = error;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return;
	}
	cells.item(1).innerHTML = location;
	ClearCharts();
	canvas_update();

}

function update_load(row_index){

	var table = document.getElementById('table-variables');
	var cells = table.rows.item(row_index).cells;
	var beam_length = return_beam_length();
	var load_type = cells.item(0).innerHTML.split(' ')[0].toLowerCase();
	var location = document.getElementById(load_type + '-location').value;
	var load = document.getElementById(load_type + '-load').value;
	var error = "";
	var check = between(location, 0, beam_length);
	if(is_numeric(location) == false ||  is_numeric(load) == false){ 
		error = "You did not input a valid number";
	} else if(between(Number(location), 0, Number(beam_length)) == false){
		error = "Your location is not within range";
	} else if(load == 0){
		error = "Your load cannot be 0";
	}
	if(error != ""){
		document.getElementById("o-beam-updates").innerHTML = error;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return;
	}
	cells.item(1).innerHTML = location;
	cells.item(2).innerHTML = load;
	ClearCharts();
	canvas_update();

}

function update_distributed_load(row_index){

	var table = document.getElementById('table-variables');
	var cells = table.rows.item(row_index).cells;
	var beam_length = return_beam_length();
	var start_location = document.getElementById('start-dlocation').value;
	var start_load = document.getElementById('start-dload').value;
	var end_location = document.getElementById('end-dlocation').value;
	var end_load = document.getElementById('end-dload').value;
	var error = "";
	if(is_numeric(start_location) == false ||  is_numeric(start_load) == false
		|| is_numeric(end_location) == false ||  is_numeric(end_load) == false){ 
		error = "You did not input a valid number";
	}else if(between(Number(start_location), 0, Number(beam_length)) == false || 
		between(Number(end_location), 0, Number(beam_length)) == false){
		error = "Your location is not within range";
	}else if(sign(start_load)*sign(end_load) < 0){
		error = "Your loads cannot have different signs";
	}
	if(error != ""){
		document.getElementById("o-beam-updates").innerHTML = error;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return;
	}
	var type = 'Dt. Load';
	var location = start_location + " | " + end_location;
	var load = start_load + " | " + end_load;
	cells.item(1).innerHTML = location;
	cells.item(2).innerHTML = load;
	ClearCharts();
	canvas_update();

}

function update_beam_section(row_index){

	var table = document.getElementById("table-section-properties");
	var cells = table.rows.item(row_index).cells;
	var section_name = cells.item(0).innerHTML;
	var properties = [];
    var sp = cells.item(2).innerHTML.split('|');
    for (var i = 0; i < sp.length; i++) {
        var sub = sp[i].split('=');
        for (var j = 0; j < sub.length; j++) {
            properties.push(sub[j]);
        }
    }
	document.getElementById('add-section').innerHTML = 'Update Section';
	document.getElementById('add-section').setAttribute( "onClick", "update_beam_section(" + row_index + ")" );
	var area = document.getElementById("area").value;
	var modulus = document.getElementById("modulus-of-elasticity").value;
	var select_material = document.getElementById("select-material").value;
	var inertia = document.getElementById("moment-of-inertia").value;
	var y_top = document.getElementById("y-top").value;
	var y_bot = document.getElementById("y-bottom").value;
	var start = document.getElementById('section-start-location').value;
	var end = document.getElementById('section-end-location').value;

	var errors = new Array();
	var input_errors_arr = section_inputs_check(modulus, inertia, area, y_top, y_bot, start, end);
	var sections = sections_from_table();
	sections.splice(row_index - 1, 1);
	var range_error_arr = section_range_check(start, end, sections);
	var errors = input_errors_arr.concat(range_error_arr);
	if(errors.length != 0){
		document.getElementById("o-beam-updates").innerHTML = errors;
		var section_modal_error = document.getElementById("section-modal-error");
	    section_modal_error.innerText = errors;
		$('#section-modal-error').fadeIn().delay(3000).fadeOut();
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return;
	}

	var properties_arr = [["E", modulus], ["I", inertia], ["A", area], ["Y-top", y_top], ["Y-bot", y_bot]];
	var location = start + " | " + end;
	var beam_section = document.getElementById('section-name-modal').value;
	var properties = '';
	for(var i=0; i<properties_arr.length; i++){
		if(properties_arr[i][1] != "") {
			properties = properties + properties_arr[i][0] + "=" + properties_arr[i][1] + " | ";
		}
	}
	if(properties !=""){
		properties = properties.slice(0, -3);
	}
	cells.item(0).innerHTML = beam_section;
	cells.item(1).innerHTML = location;
	cells.item(2).innerHTML = properties;
	ClearCharts();
	canvas_update();
	$('#section-modal').modal('hide');

}

function beam_length_from_table(){

	var table = document.getElementById('table-variables');
	var beam_length_index = beam_length_row_index();
	var cells = table.rows.item(beam_length_index).cells; 
	var beam_length = Math.abs(parseFloat(cells.item(1).innerHTML.split("|")[1].trim()));
	return beam_length;

}

function max_load_from_table(){

	var load = [];
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   	
		if(cells.item(0).innerHTML == "Dt. Load"){
			var cell_val1 = Math.abs(parseFloat(cells.item(2).innerHTML.split("|")[0].trim()));
			var cell_val2 =  Math.abs(parseFloat(cells.item(2).innerHTML.split("|")[1].trim()));
			var cell_val = Math.max(cell_val1, cell_val2);
		}else if(cells.item(0).innerHTML == "Moment Load"){
			continue;
		} else {
			var cell_val = Math.abs(cells.item(2).innerHTML);
		}
		load.push(cell_val);
	}
	return Math.max.apply(Math,load);

}

function supports_from_table(){

	var supports = [];
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML.charAt(0) == "S"){
	   		element.location = cells.item(1).innerHTML;
			element.type = cells.item(0).innerHTML;
			element.index = i;
			supports.push(element);
	   	}	
	}
	return supports;

}

function forces_from_table(){

	var loads = [];
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML.charAt(0) == "P"){
	   		element.load = cells.item(2).innerHTML;
	   		element.location = cells.item(1).innerHTML;
			element.type = cells.item(0).innerHTML;
			element.index = i;
			loads.push(element);
	   	}	
	}
	return loads;

}

function point_loads_from_table(){

	var point_loads = [];
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML == "Point Load"){
	   		element.location = cells.item(1).innerHTML;
			element.load = cells.item(2).innerHTML;
			point_loads.push(element);
	   	}	
	}
	return point_loads;

}

function distributed_loads_from_table(){

	var distributed_loads = [];
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML == "Dt. Load"){
	   		element.location = cells.item(1).innerHTML;
			element.load = cells.item(2).innerHTML;
			distributed_loads.push(element);
	   	}	
	}
	return distributed_loads;

}

function moment_loads_from_table(){

	var moment_loads = [];
	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML == "Moment Load"){
	   		element.location = cells.item(1).innerHTML;
			element.load = cells.item(2).innerHTML;
			moment_loads.push(element);
	   	}	
	}
	return moment_loads;

};

function sections_from_table(){

	var sections = [];
	//gets table
	var table = document.getElementById('table-section-properties');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element;
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   	
		element = cells.item(1).innerHTML;
		sections.push(element);	
	}
	return sections;

}

function download_object_as_json(export_obj, export_name){

    var data_str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(export_obj));
    var download_anchor_node = document.createElement('a');
    download_anchor_node.setAttribute("href",     data_str);
    download_anchor_node.setAttribute("download", export_name + ".obm");
    download_anchor_node.click();
    download_anchor_node.remove();

 };

function perform_click(elemId) {
   var elem = document.getElementById(elemId);
   if(elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
   }
};

function scroll_to(id){

	$('html,body').animate({scrollTop: $("#" + id).offset().top},'slow');

};

//Responsive Nav
$('li.dropdown').find('.fa-angle-down').each(function(){

	$(this).on('click', function(){
		if( $(window).width() < 768 ) {
			$(this).parent().next().slideToggle();
		}
		return false;
	});

});

$(document).ready(function () {

    $('.dropdown-toggle').dropdown();
    $('.doc-toggle').dropdown();

});

//Animate Home Page
//$(window).load(function(){
//$('.main-slider').addClass('animate-in');
//});

function update_summary(type, location, load){

	type = type || '';
	location = location || '';
	load = load || '';
	var table = document.getElementById("table-variables");
	var row = "<tr>"
	+"<td>" + type + "</td>"
    +"<td>" + location + "</td>"
    +"<td>" + load + "</td>";
    if(type != "Length"){
    	row = row + "<td><a type ='button' onclick='return remove_from_summary(this)' href=''><i class='fa fa-trash'></i></a> &nbsp;"
    + "<a onclick='return edit_input(this)' href=''><i class='fa fa-edit'></i></a></td></tr>";
    }else{
    	row = row + "<td></td></tr>";
    }
   	$('#table-variables').append(row);

};

function update_section_summary(section, loc, properties){

	section = section || '';
	loc = loc || '';
	properties = properties || '';
	var table = document.getElementById("table-section-properties");
	var row = "<tr>"
	+"<td>" + section + "</td>"
    +"<td>" + loc + "</td>"
    +"<td>" + properties + "</td>"
    + "<td><a type ='button' onclick='return remove_from_section_summary(this)' href=''><i class='fa fa-trash'></i></a> &nbsp;" 
    + "<a onclick='return edit_properties(this)' href=''><i class='fa fa-edit'></i></a></td>" 
    +"</tr>";
   	$('#table-section-properties').append(row);

};

function draw_beam_length(){

	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
    document.getElementById("o-beam-updates").innerHTML = "";
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
    var design_width = parseFloat(c.width) - 150;
    ctx.fillStyle = "#808080"
    ctx.fillRect(75,115, design_width, 20);

};

function draw_beam_section(start_location, end_location){

	var beam_length = return_beam_length();
	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
    document.getElementById("o-beam-updates").innerHTML = "";
 	start_canvas = 75 + (start_location/beam_length)*(ctx.canvas.width-150);
 	end_canvas = 75 + (end_location/beam_length)*(ctx.canvas.width-150);
    ctx.fillStyle = "#666666";
    ctx.fillRect(start_canvas,115, end_canvas - start_canvas, 20);


};

function draw_all_beam_sections(){

	var sections = sections_from_table();
	var start_location;
	var end_location;
	for (var i = 0; i < sections.length; i++) {
		start_location = parseFloat(sections[i].split("|")[0].trim());
		end_location = parseFloat(sections[i].split("|")[1].trim());
		draw_beam_section(start_location, end_location);
	}

};

function beam_length_check(){

	var beam_length = document.getElementById('beam-length').value;
	if(beam_length == "" || is_numeric(beam_length) == false || beam_length <= 0){
		document.getElementById("o-beam-updates").innerHTML = "You did not input a valid beam length";
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return false;
	}
	return true;

}

function return_beam_length(){

	var beam_length = parseFloat(document.getElementById('beam-length').value);
	return beam_length;

}

function add_beam_section(){
	ClearCharts();
	var modulus = document.getElementById('modulus-of-elasticity').value;
	var inertia = document.getElementById('moment-of-inertia').value;
	var area = document.getElementById('area').value;
	var y_top = document.getElementById('y-top').value;
	var y_bot = document.getElementById('y-bottom').value;
	var section_name = document.getElementById('section-name-modal').value;
	var start = document.getElementById('section-start-location').value;
	var end = document.getElementById('section-end-location').value;
	var beam_length = return_beam_length();
	var errors = new Array();
	var input_errors_arr = section_inputs_check(modulus, inertia, area, y_top, y_bot, start, end);
	var range_error_arr = section_range_check(start, end, sections_from_table());
	var errors = input_errors_arr.concat(range_error_arr);
	if(errors.length != 0){
		document.getElementById("o-beam-updates").innerHTML = errors;
		var section_modal_error = document.getElementById("section-modal-error");
	    section_modal_error.innerText = errors;
		$('#section-modal-error').fadeIn().delay(3000).fadeOut();
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return;
	}
	var properties_arr = [["E", modulus], ["I", inertia], ["A", area], ["Y-top", y_top], ["Y-bot", y_bot]];
	var location = start + " | " + end;
	var beam_section = document.getElementById('section-name-modal').value;
	var properties = '';
	for(var i=0; i<properties_arr.length; i++){
		if(properties_arr[i][1] != "") {
			properties = properties + properties_arr[i][0] + "=" + properties_arr[i][1] + " | ";
		}
	}
	if(properties !=""){
		properties = properties.slice(0, -3);
	}
	update_section_summary(beam_section, location, properties);
	draw_beam_section(start, end);
	$('#section-modal').modal('hide');

};

function section_inputs_check(modulus, inertia, area, y_top, y_bot, start, end) {
	var errors = new Array();
	var beam_length = Number(return_beam_length());
	if(is_numeric(modulus) == false || modulus == '0' || modulus == ''){
		errors.push("Modulus incorrect format, only numbers allowed.");
	}
	if(is_numeric(inertia) == false || inertia == '0' || inertia == ''){
		errors.push("Inertia incorrect format, only numbers allowed.");
	}
	if(is_numeric(area) == false && area != '0' && area != ''){
		errors.push("Area incorrect format, only numbers allowed.");
	}
	if(is_numeric(y_top) == false && y_top != '0' && y_top != ''){
		errors.push("y-top incorrect format, only numbers allowed.");
	}
	if(is_numeric(y_bot) == false && y_bot != '0' && y_bot != ''){
		errors.push("y-bottom incorrect format, only numbers allowed.");
	}
	if(!between(parseFloat(start), 0, beam_length) || 
		!between(parseFloat(end), 0, beam_length)){
		errors.push("Specified section location is outside allowed boundary.");
	}
	return errors;
}

function section_range_check(start, end, sections){
	var errors = new Array();
	for (var i = 0; i < sections.length; i++) {
		existing_start = parseFloat(sections[i].split("|")[0].trim());
		existing_end = parseFloat(sections[i].split("|")[1].trim());
		if(in_range(parseFloat(start), existing_start, parseFloat(end), false) ||
		in_range(parseFloat(start), existing_end, parseFloat(end), false)){
			errors.push("Another section already defined in this range.");
			return errors;
		}
		if(in_range(existing_start, parseFloat(start), existing_end, false) ||
		in_range(existing_start, parseFloat(end), existing_end, false)){
			errors.push("Another section already defined in this range.");
			return errors;
		}
		if(in_range(parseFloat(start), existing_start, parseFloat(end), true) &&
		in_range(parseFloat(start), existing_end, parseFloat(end), true)){
			errors.push("Another section already defined in this range.");
			return errors;
		}
	}
	return errors;
}

function in_range(low, num, high, inclusive) {
  inclusive = (typeof inclusive === "undefined") ? false : inclusive;
  if (inclusive && num >= low && num <= high) return true;
  if (num > low && num < high) return true;
  return false;
}

function beam_properties_row_index(){

	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML.charAt(0) == "E"){
	   		return i;
	   	}	
	}
	return 0;

};

function open_modal(id){

	$('#' + id).modal('show');

}

function close_modal(id){

	$('#' + id).modal('hide');

}

function open_support_modal(id){

	if(beam_length_check() == false){return;}
	var support_type = id.split('-')[1];
	document.getElementById('add-' + support_type + '-support').innerHTML = 'Add';
	document.getElementById('add-another-' + support_type + '-support').style.visibility = 'visible';
	document.getElementById('add-' + support_type + '-support').setAttribute( "onClick", "add_support('" + support_type + "')" );
	$('#' + id).modal('show');

}

function open_load_modal(id){

	if(beam_length_check() == false){return;}
	var load_type = id.split('-')[1];
	document.getElementById('add-' + load_type + '-load').innerHTML = 'Add';
	document.getElementById('add-another-' + load_type + '-load').style.visibility = 'visible';
	document.getElementById('add-' + load_type + '-load').setAttribute( "onClick", "add_" + load_type + "_load()" );
	if(load_type != 'distributed'){
		document.getElementById(load_type + '-location').value = "";
		document.getElementById(load_type + '-load').value = "";
	} else{
		document.getElementById('start-dlocation').value = "";
		document.getElementById('end-dlocation').value = "";
		document.getElementById('start-dload').value = "";
		document.getElementById('end-dload').value = "";
	}
	$('#' + id).modal('show');

}

function add_beam_length(){

	var beam_length = return_beam_length();

	if(beam_length_check() == false){ return;}
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_index = beam_length_row_index();
	//var row_length = table.rows.length;
	if(row_index == 0){
		var type = "Length";
		update_summary(type, '0' + " | " + beam_length, undefined);
	}else{
		var cells = table.rows.item(row_index).cells; 
   		cells.item(1).innerHTML = '0' + " | " + beam_length;
   		remove_inputs_beyond();
	}	
	draw_beam_length();
	canvas_update();

};

function beam_length_row_index(){

	//gets table
	var table = document.getElementById('table-variables');
	//gets rows of table
	var row_length = table.rows.length;
	//loops through rows
	for (var i = 1; i < row_length; i++){
		var element = {};
	   	//gets cells of current row
	   	var cells = table.rows.item(i).cells;
	   	//gets amount of cells of current row
	   	var cell_length = cells.length;   

	   	if(cells.item(0).innerHTML.charAt(0) == "L"){
	   		return i;
	   	}	
	}
	return 0;

};

function remove_inputs_beyond(){

	//gets table
	var inputs_table = document.getElementById('table-variables');
	//gets rows of table
	var inputs_row_length = inputs_table.rows.length;
	//loops through rows
	for (var i = 1; i < inputs_row_length; i++){
	   	//gets cells of current row
	   	var cells = inputs_table.rows.item(i).cells;
	   	if(cells.item(0).innerHTML.charAt(0) == "S"){
	   		var result = remove_supports_beyond(i, inputs_row_length, cells);
	   		inputs_row_length = result[0];
	   		i = result[1];
	   	}else if(cells.item(0).innerHTML.charAt(0) == "P" || cells.item(0).innerHTML.charAt(0) == "M"){
	   		var result = remove_loads_beyond(i, inputs_row_length, cells);
	   		inputs_row_length = result[0];
	   		i = result[1];
	   	}else if(cells.item(0).innerHTML.charAt(0) == "D"){
	   		var result = remove_distributed_loads_beyond(i, inputs_row_length, cells);
	   		inputs_row_length = result[0];
	   		i = result[1];
		}
	}
	var sections_table = document.getElementById('table-section-properties');
	var sections_row_length = sections_table.rows.length;
	for (var i = 1; i < sections_row_length; i++){
		var cells = sections_table.rows.item(i).cells;
		var result = remove_sections_beyond(i, sections_row_length, cells);
	   	sections_row_length = result[0];
	   	i = result[1];
	}
}

function remove_sections_beyond(i, row_length, cells) {

	var table = document.getElementById('table-section-properties');
	var beam_length = return_beam_length();
	var location_1 = parseFloat(cells.item(1).innerHTML.split("|")[0].trim());
	var location_2 = parseFloat(cells.item(1).innerHTML.split("|")[1].trim());
	var check_1 = between(location_1, 0, beam_length);
	var check_2 = between(location_2, 0, beam_length);
	if(check_1 == false || check_2 == false){
		table.deleteRow(i);
	 	row_length = row_length - 1;
	 	i = i - 1;
	}
	return [row_length, i];
}

function remove_supports_beyond(i, row_length, cells){

	var table = document.getElementById('table-variables');
	var beam_length = return_beam_length();
	var check = between(parseFloat(cells.item(1).innerHTML), 0, beam_length);
	if(check == false){
	 	table.deleteRow(i);
	 	row_length = row_length - 1;
	 	i = i - 2;
	}else if(cells.item(0).innerHTML == "Support-fixed" && parseFloat(cells.item(1).innerHTML) < beam_length
		&& parseFloat(cells.item(1).innerHTML) > 0){
		table.deleteRow(i);
	 	row_length = row_length - 1;
	 	i = i - 2;
	}
	return [row_length, i];

}

function remove_loads_beyond(i, row_length, cells){

	var table = document.getElementById('table-variables');
	var beam_length = document.getElementById('beam-length').value;
	var check = between(parseFloat(cells.item(1).innerHTML), 0, beam_length);
	if(check == false){
	 	table.deleteRow(i);
	 	row_length = row_length - 1;
	 	i = i - 2;
	}
	return [row_length, i];

}

function remove_distributed_loads_beyond(i, row_length, cells){

	var table = document.getElementById('table-variables');
	var beam_length = document.getElementById('beam-length').value;
	var location_1 = parseFloat(cells.item(1).innerHTML.split("|")[0].trim());
	var location_2 = parseFloat(cells.item(1).innerHTML.split("|")[1].trim());
	var check_1 = between(location_1, 0, beam_length);
	var check_2 = between(location_2, 0, beam_length);
	if(check_1 == false || check_2 == false){
	 	table.deleteRow(i);
	 	row_length = row_length - 1;
	 	i = i - 2;
	}
	return [row_length, i];

}

function location_select(type){

	if(beam_length_check() == false){ return;}
	var beam_length = return_beam_length();
	var roller_location_select = document.getElementById(type + '-location-select');
	var location_string = roller_location_select.options[roller_location_select.selectedIndex].value;
	var support_location = document.getElementById(type + '-location');
	if(location_string == "Left"){
		support_location.disabled = true;
		support_location.value = "0";
	}else if(location_string == "Right"){
		support_location.disabled = true;
		support_location.value = beam_length;
	}else{
		support_location.disabled = false;
		support_location.value = "";
	}

}

function add_support(type){

	if(beam_length_check() == false){ return;}
	var beam_length = return_beam_length();
	var location = document.getElementById(type + '-location').value;
	if(is_numeric(location) == false){ return;}
	var check = between(parseFloat(location), 0, beam_length);
	var support_type = 'Support-' + type;
	if(check == false){ return;}
	ClearCharts();
	var existing_supports = supports_from_table();
	var exists = false;
	var error = "";
	for (var i = 0; i < existing_supports.length; i++){
		if(existing_supports[i]['location'] == location){
			exists = true;
			error = "There is already a support at that location"
			break;
		}
	}
	var location_input = document.getElementById(type + '-location');
	if(error != ""){
		document.getElementById("o-beam-updates").innerHTML = error;
		var support_modal_error = document.getElementsByClassName("support-modal-error");// Find the elements
		for(var i=0; i<support_modal_error.length; i++){
	    	support_modal_error[i].innerText = error;
		}
		$('.support-modal-error').fadeIn().delay(3000).fadeOut();
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		location_input.focus();
		location_input.select();
		return;
	}
	location_input.value = "";
	location_input.focus();
	update_summary(support_type, location, undefined);
	canvas_update();

};

function add_another_support(type){

	add_suopport(type);
	if(error != ""){
		var support_modal_error = document.getElementsByClassName("support-modal-error");// Find the elements
		for(var i=0; i<support_modal_error.length; i++){
	    	support_modal_error[i].innerText = error;
		}
		$('.support-modal-error').fadeIn().delay(3000).fadeOut();
		return;
	}
	document.getElementById(type + '-location').value = "";
	document.getElementById(type + '-location').focus();
	//document.getElementById(type + '-location').select();
	update_summary(support_type, location, undefined);
	canvas_update();

};

function draw_all_supports(){

	var supports = supports_from_table();
	for (var i = 0; i < supports.length; i++) {
		draw_support(supports[i]['type'],supports[i]['location']);
	}

};

function draw_support(type, location){

	var beam_length = return_beam_length();
	if(location == ""){return;}
	document.getElementById("o-beam-updates").innerHTML = "";
	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
	var support_x = 75 + (location/beam_length)*(ctx.canvas.width-150);
	if(type === "Support-pinned"){
	    ctx.moveTo(support_x,135);
	    ctx.lineTo(support_x + 15,165);
	    ctx.lineTo(support_x - 15,165);
	    ctx.fill();
	} else if(type === "Support-fixed"){
	    ctx.moveTo(support_x-10,80);
	    ctx.lineTo(support_x-10, 170);
	    ctx.lineTo(support_x + 10, 170);
	    ctx.lineTo(support_x + 10, 80);
	    ctx.fill();
	} else if(type === "Support-roller"){
	    ctx.moveTo(support_x,135);
	    ctx.lineTo(support_x + 15,165);
	    ctx.lineTo(support_x - 15,165);
	    ctx.fill();
	    ctx.beginPath();
	    ctx.arc(support_x + 10, 169, 4, 0, 2 * Math.PI, false);
	    ctx.arc(support_x, 169, 4, 0, 2 * Math.PI, false);
	    ctx.arc(support_x - 10, 169, 4, 0, 2 * Math.PI, false);
	    ctx.fill();
	}

}

function add_point_load(){

	if(beam_length_check() == false){ return;}
	var beam_length = return_beam_length();
	var location_input = document.getElementById('point-location');
	var load = document.getElementById('point-load').value;
	var error = "";
	var check = between(location_input.value, 0, beam_length);
	if(is_numeric(location_input.value) == false ||  is_numeric(load) == false){ 
		error = "You did not input a valid number";
	} else if(between(Number(location_input.value), 0, Number(beam_length)) == false){
		error = "Your location is not within range";
	} else if(load == 0){
		error = "Your load cannot be 0";
	}
	if(error != ""){
		var load_modal_error = document.getElementsByClassName("load-modal-error");// Find the elements
		for(var i=0; i<load_modal_error.length; i++){
	    	load_modal_error[i].innerText = error;
		}
		$('.load-modal-error').fadeIn().delay(3000).fadeOut();
		document.getElementById("o-beam-updates").innerHTML = error;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		location_input.focus();
		location_input.select();
		return;
	}
	ClearCharts();
	var type = 'Point Load';
	update_summary(type, location_input.value, load);
	canvas_update();
	location_input.value = "";
	location_input.focus();

};

function draw_all_point_loads(){

	var maximum_load = max_load_from_table();
	var point_loads = point_loads_from_table();
	for (var i = 0; i < point_loads.length; i++) {
		draw_point_load(point_loads[i]['load'],point_loads[i]['location'], maximum_load);
	}

};

function draw_point_load(load, location, maximum_load){

	var beam_length = return_beam_length();
	if(location == ""){return;}
	document.getElementById("o-beam-updates").innerHTML = "";
	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
	var point_x = 75 + (location/beam_length)*(ctx.canvas.width-150);
	ctx.fillStyle = "black";
	ctx.beginPath();
	var sign_load = sign(load)*-1;
	var pixel_magnitude;
	if(isNaN(maximum_load)){
		pixel_magnitude = 90;
	} else{
		pixel_magnitude = Math.abs(load)/maximum_load * 90;
	}
	ctx.fillRect(point_x - 2.5, 125 + (20*sign_load), 5, pixel_magnitude*sign_load);
	ctx.moveTo(point_x, 125 + (10*sign_load));
	ctx.lineTo(point_x - 10, 125 + (20*sign_load));
	ctx.lineTo(point_x + 10, 125 + (20*sign_load));
	ctx.fill();

}

function add_distributed_load(){

	if(beam_length_check() == false){ return;}
	var beam_length = return_beam_length();
	var start_location_input = document.getElementById('start-dlocation');
	var start_load = document.getElementById('start-dload').value;
	var end_location_input = document.getElementById('end-dlocation');
	var end_load = document.getElementById('end-dload').value;
	var error = "";
	if(is_numeric(start_location_input.value) == false ||  is_numeric(start_load) == false
		|| is_numeric(end_location_input.value) == false ||  is_numeric(end_load) == false){ 
		error = "You did not input a valid number";
	}else if(between(Number(start_location_input.value), 0, Number(beam_length)) == false || 
		between(Number(end_location_input.value), 0, Number(beam_length)) == false){
		error = "Your location is not within range";
	}else if(sign(start_load)*sign(end_load) < 0){
		error = "Your loads cannot have different signs";
	}
	if(error != ""){
		var load_modal_error = document.getElementsByClassName("load-modal-error");// Find the elements
		for(var i=0; i<load_modal_error.length; i++){
	    	load_modal_error[i].innerText = error;
		}
		$('.load-modal-error').fadeIn().delay(3000).fadeOut();
		document.getElementById("o-beam-updates").innerHTML = error;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		start_location_input.focus();
		start_location_input.select();
		return;
	}
	ClearCharts();
	var type = 'Dt. Load';
	var location = start_location_input.value + " | " + end_location_input.value;
	var load = start_load + " | " + end_load;
	update_summary(type, location, load);
	canvas_update();
	start_location_input.value = "";
	end_location_input.value = "";
	start_location_input.focus();

};

function draw_all_distributed_loads(){

	var maximum_load = max_load_from_table();
	var distributed_loads = distributed_loads_from_table();
	var start_location;
	var start_load;
	var end_location;
	var end_load;
	for (var i = 0; i < distributed_loads.length; i++) {
		start_location = distributed_loads[i]['location'].split("|")[0];
		end_location = distributed_loads[i]['location'].split("|")[1];
		start_load = distributed_loads[i]['load'].split("|")[0];		
		end_load = distributed_loads[i]['load'].split("|")[1];
		draw_distributed_load(start_load, end_load, start_location, end_location);
	}

};

function draw_distributed_load(start_load, end_load, start_location, end_location){

	var beam_length = return_beam_length();
	if(start_location == ""){return;}
	document.getElementById("o-beam-updates").innerHTML = "";
	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
	var start_x = 75 + (start_location/beam_length)*(ctx.canvas.width-150);
	var end_x = 75 + (end_location/beam_length)*(ctx.canvas.width-150);
	var max_load = Math.max(Math.abs(start_load), Math.abs(end_load));
	if (start_load == 0 || end_load == 0){
		var load = Number(start_load) + Number(end_load);
		var sign_start = sign(load)*-1;
		var sign_end = sign_start;
	} else{
		var sign_start = sign(start_load)*-1;
		var sign_end = sign(end_load)*-1;
	}
	var maximum_load = max_load_from_table();
	var pixel_magnitude;
	if(isNaN(maximum_load)){
		pixel_magnitude = 100;
	} else{
		pixel_start_magnitude = Math.abs(start_load)/maximum_load * 100;
		pixel_end_magnitude = Math.abs(end_load)/maximum_load * 100;
	}
	//Boundary for UDL
	ctx.beginPath();
	ctx.moveTo(start_x, 125 + (10*sign_start));
	ctx.lineTo(start_x, 125 + (10*sign_start) + (pixel_start_magnitude*sign_start));
	ctx.lineTo(end_x, 125 + (10*sign_end) + (pixel_end_magnitude*sign_end));
	ctx.lineTo(end_x, 125 + (10*sign_end));
	ctx.strokeStyle = 'blue';
	ctx.lineWidth = 2;
	ctx.stroke();
	// the fill color
	ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
	ctx.fill();
	ctx.closePath();
	//Arrow Head
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.moveTo(start_x, 125 + (10*sign_start));
	ctx.lineTo(start_x - 10, 125 + (20*sign_start));
	ctx.lineTo(start_x + 10, 125 + (20*sign_start));
	ctx.fill();
	ctx.moveTo(end_x, 125 + (10*sign_end));
	ctx.lineTo(end_x - 10, 125 + (20*sign_end));
	ctx.lineTo(end_x + 10, 125 + (20*sign_end));
	ctx.fill();
	ctx.closePath();

}

function add_moment_load(){

	if(beam_length_check() == false){ return;}
	var beam_length = return_beam_length();
	var location_input = document.getElementById('moment-location');
	var load = document.getElementById('moment-load').value;
	var error = "";
	var check = between(location_input.value, 0, beam_length);
	if(is_numeric(location_input.value) == false ||  is_numeric(load) == false){ 
		error = "You did not input a valid number";
	} else if(between(Number(location_input.value), 0, Number(beam_length)) == false){
		error = "Your location is not within range";
	} else if(load == 0){
		error = "Your load cannot be 0";
	}
	if(error != ""){
		var load_modal_error = document.getElementsByClassName("load-modal-error");// Find the elements
		for(var i=0; i<load_modal_error.length; i++){
	    	load_modal_error[i].innerText = error;
		}
		$('.load-modal-error').fadeIn().delay(3000).fadeOut();
		document.getElementById("o-beam-updates").innerHTML = error;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		location_input.focus();
		location_input.select();
		return;
	}

	ClearCharts();
	var type = 'Moment Load';
	update_summary(type, location_input.value, load);
	canvas_update();
	location_input.value = "";
	location_input.focus();

};

function draw_all_moment_loads(){

	var moment_loads = moment_loads_from_table();
	for (var i = 0; i < moment_loads.length; i++) {
		draw_moment_load(moment_loads[i]['load'],moment_loads[i]['location']);
	}

};

function draw_moment_load(load, location){

	var beam_length = return_beam_length();
	if(location == ""){return;}
	document.getElementById("o-beam-updates").innerHTML = "";
	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
	var point_x = 75 + (location/beam_length)*(ctx.canvas.width-150);
	var sign_load = sign(load)*-1;
	ctx.strokeStyle = "#FF00FF";
	ctx.beginPath();
	ctx.arc(point_x, 125, 25, 1.5*Math.PI, 0.5*Math.PI, false);
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle = "#FF00FF";
	ctx.moveTo(point_x,125 - (30*sign_load));
	ctx.lineTo(point_x, 125 - (20*sign_load));
	ctx.lineTo(point_x - 10, 125 - (25*sign_load));
	ctx.fill();

}

function remove_from_summary(element) {

	var parent = element.parentNode.parentNode;
	var cells = parent.cells;
	var type = cells.item(0).innerHTML;
	if(type.charAt(0) == "E"){
		var section_selected = document.getElementById("sel1");
		var section_name =  document.getElementById("section-name");
		section_name.value = "";
		section_selected.value = "New Section";
		change_section_properties();
	}
	if(type.charAt(0) == "L"){
		return false;
	}
	ClearCharts();
	parent.parentNode.removeChild(parent);
	//parent.remove();
	canvas_update();
	return false;

};

function remove_from_section_summary(element) {

	var parent = element.parentNode.parentNode;
	var cells = parent.cells;
	var type = cells.item(0).innerHTML;
	var section_selected = document.getElementById("sel1");
	//var section_name =  document.getElementById("section-name");
	//section_name.value = "";
	section_selected.value = "New Section";
	change_section_properties();
	ClearCharts();
	parent.parentNode.removeChild(parent);
	canvas_update();
	return false;

};

function obj_to_string (obj) {

    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + obj[p] + '<br>';
        }
    }
    return str;

}

function canvas_update() {

	canvas_reset();
	draw_all_supports();
	draw_all_point_loads();
	draw_all_distributed_loads();
  	draw_all_moment_loads();
  	draw_all_beam_sections();

}

function canvas_initializer() {

	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
	//c.style.width='100%';
	//c.style.height = '100%';
	c.width  = c.offsetWidth - 30;
	c.height = 250;
    var design_width = parseFloat(c.width) - 150;
    ctx.strokeRect(75,105, design_width, 20);

}

function canvas_reset(){

	var c = document.querySelector("#c");
    var ctx = c.getContext("2d");
    ctx.clearRect(0,0, c.width, 165);
    ctx.clearRect(0,185, c.width, 350);
    ctx.clearRect(0,0, 100, 350);
    ctx.clearRect(c.width - 150, 0, c.width, 350);
    var beam_length = return_beam_length()
    if(beam_length == "" || is_numeric(beam_length) == false || beam_length <= 0){ return;}
	draw_beam_length();

}

function beam_length_reset(){

	document.getElementById("beam-length").value = "";

}

function table_reset(){

	//var table = document.getElementById('table-variables');
	$("#table-variables").find("tr:gt(0)").remove();

}

function section_reset(){

	//var table = document.getElementById('table-section-properties');
	$("#table-section-properties").find("tr:gt(0)").remove();
	var	database_sections = document.getElementById('sel1');
	database_sections.value = "New Section";
	change_section_properties();

}

function model_name_reset(){

	document.getElementById("model-name").innerHTML = "";
	document.getElementById("model-path").value = "";

}

function is_numeric(n) {

  return !isNaN(parseFloat(n)) && isFinite(n);

}

function between(x, min, max) {

  return x >= min && x <= max;

}

function sign(x) { return x >= 0 ? 1 : x <= 0 ? -1 : 0; }

function change_elasticity(){

	var elasticity_input = document.getElementById('modulus-of-elasticity');
	var select_material = document.getElementById("select-material");
	var material = select_material.options[select_material.selectedIndex].value;
	var length_selection = document.getElementById("select-length");
	var new_length_unit = length_selection.value;
	
	if(new_length_unit == "m" || new_length_unit == "cm" || new_length_unit == "mm"){
		new_length_unit = "mm";
	}else{
		new_length_unit = "in";
	}

	if(material == "Steel"){
		elasticity_input.disabled = true;
		if(new_length_unit == "mm"){
			elasticity_input.value = 200000;
		}else{
			elasticity_input.value = 29000;
		}
	};
	if(material == "Aluminium"){
		elasticity_input.disabled = true;
		if(new_length_unit == "mm"){
			elasticity_input.value = 69000;
		}else{
			elasticity_input.value = 10000;
		}		
	};
	if(material == "Wood"){
		elasticity_input.disabled = true;
		if(new_length_unit == "mm"){
			elasticity_input.value = 11000;
		}else{
			elasticity_input.value = 1595;
		}
	};
	if(material == "Other"){
		if(elasticity_input.disabled == true){
			elasticity_input.disabled = false;
			elasticity_input.value = "";
		} /*else{
			var section_length_elements = document.getElementsByClassName("section-length-unit");// Find the elements
	    	var current_section_length =  section_length_elements[0].innerText;
	    	if(current_section_length == "mm" && new_length_unit == "in"){
	    		elasticity_input.value = elasticity_input.value*0.1450377;
	    	}else if(current_section_length == "in" && new_length_unit == "mm"){
	    		elasticity_input.value = elasticity_input.value/0.1450377;
	    	}
		}*/
	};

};

function cancel_stripe_subscription(){
	var days;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "stripe-update.php?g=cancel",
	}).done(function(result) {
	  days = JSON.parse(result);
	});
	alert("Your subscription has been cancelled, it will end in " + Math.floor(parseInt(days, 10)) + " days");
	var cancel_button = document.getElementById("cancel-subscription");
	cancel_button.innerHTML = "Resume";
	cancel_button.setAttribute( "onClick", "resume_stripe_subscription()" );
}

function resume_stripe_subscription(){
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "stripe-update.php?g=resume",
	});
	alert("Your subscription has been resumed");
	var cancel_button = document.getElementById("cancel-subscription");
	cancel_button.innerHTML = "Cancel";
	cancel_button.setAttribute( "onClick", "cancel_stripe_subscription()" );
}

function open_update_subscription_modal(){
	var account_type = document.getElementById("account-type");
	var plans_selection = document.getElementById("plans-available");
	var plan_description = document.getElementById("plan-description");
	if(account_type.value == "Pro Plan"){
		plans_selection.innerHTML =    "<option value='3.1'>Pro Plan - Monthly</option>"
											+"<option value='3.2'>Pro Plan - Yearly</option>"
                                            +"<option value='1'>Limited Plan</option>";
        plan_description.innerHTML = "US$9.99 per month, full access to features " 
        								+ "<a target='_blank' href = 'pricing.php'>Read More</a>";
        //plan_description.innerHTML = "Limited plan is free with limited features " + "<a target='_blank' href = 'pricing.php'>Read More</a>";
    }else if(account_type.value == "Limited Plan"){
     	plans_selection.innerHTML =    "<option value='3.1'>Pro Plan - Monthly</option>"
                                            +"<option value='3.2'>Pro Plan - Yearly</option>";
        plan_description.innerHTML = "US$9.99 per month, full access to features " 
        								+ "<a target='_blank' href = 'pricing.php'>Read More</a>";
    }
    $.ajax({
	  	type: "GET",
	  	async: false,
	  	url: "server-calls.php?g=update-subscription-count",
	});
	$('#update-account-modal').modal('show');
}

function subscription_pricing_selector(){
	var plans_selection = document.getElementById("plans-available");
	var plan_description = document.getElementById("plan-description");
	var plan_selected = plans_selection.options[plans_selection.selectedIndex].value;
	if(plan_selected == "1"){
        plan_description.innerHTML = "Limited plan is free with limited features " 
        								+ "<a target='_blank' href = 'pricing.php'>Read More</a>";
     }else if(plan_selected == "3.1"){
        plan_description.innerHTML = "US$9.99 per month, full access to features " 
        								+ "<a target='_blank' href = 'pricing.php'>Read More</a>";
     }else if(plan_selected == "3.2"){
        plan_description.innerHTML = "US$83.88 per year, full access to features " 
        								+ "<a target='_blank' href = 'pricing.php'>Read More</a>";
     }
}

function account_description(account_type){
	if(account_type == 1){
		return "Limited Plan";
	}else if(account_type == 2){
		return "Basic Plan";
	}else if(account_type == 3.1){
		return "pro-monthly Plan";
	}else if(account_type == 3.2){
		return "pro-yearly Plan";
	}else if(account_type == 4){
		return "Admin";
	}
}

function update_subscription(){
	var plans_selection = document.getElementById("plans-available");
	var plan_selected = plans_selection.options[plans_selection.selectedIndex].value;
	var current_account_type = user_account_type();
	if(plan_selected == "1"){
		cancel_stripe_subscription();
	}else if(current_account_type == "3.1" || current_account_type == "3.2"){//else if (stripe registered & active)
	    $.ajax({
		  type: "GET",
		  async: false,
		  url: "stripe-update.php?g=" + plan_selected,
		});
		//window.location.href="settings.php?success";
	}else if(current_account_type == "1"){
		window.location.href="register.php?mode=" + account_description(plan_selected).split(" ")[0].toLowerCase();
	}
}

function register_pro(timeline){
	var account_type = user_account_type();
	if(user_logged_in() && account_type == 2){
		window.location.href="settings.php" + "?updatemodal=1";;
	}else if(timeline == 'yearly'){
		window.location.href="register.php?mode=pro-yearly";
	}else if(timeline == 'monthly'){
		window.location.href="register.php?mode=pro-monthly";
	}
}

function register_basic(){
	var account_type = user_account_type();
	if(user_logged_in() && account_type == 3){
		window.location.href="settings.php" + "?updatemodal=1";;
	}else{
		window.location.href="register.php?mode=basic";
	}
}

function free_trial_button(){
	window.location.href="register.php?mode=limited";
	$.ajax({
	  	type: "GET",
	  	async: false,
	  	url: "server-calls.php?g=free-trial-count",
	});
}

function features_button(){
	$.ajax({
	  	type: "GET",
	  	async: false,
	  	url: "server-calls.php?g=features-count",
	});
	scroll_to('specific-features');
}

function promo_code_message(){

	var promo_message;
	var promo_code = document.getElementById("promo-code").value;
	var promo_code_json = JSON.stringify(promo_code);
	$.ajax({
	  	type: 'post',
	  	dataType: 'json',
		async: false,
		data: {promo_code_json: promo_code_json},
	  	url: "server-calls.php?g=promo-message",
	}).done(function(result) {
	  promo_message = result;
	});
	document.getElementById("promo-message").innerHTML = promo_message;
	
}

function new_model(){

	beam_length_reset();
	canvas_reset();
	canvas_initializer();
	table_reset();
	section_reset();
	model_name_reset();
	ClearCharts();

}

function remove_section_from_database(){

	var section_selected = document.getElementById("sel1");
	var value = section_selected.options[section_selected.selectedIndex].value;
	$.ajax({
	  type: "post",
	  async: false,
	  data: {section_json: JSON.stringify(value)},
	  url: "retrieve-sections.php?g=remove",
	});
	section_retrieve_database();
	var section_selected = document.getElementById("sel1");
	section_selected.value = "New Section";
	change_section_properties();

}

function add_section_to_database(){

	var sections_quantity = document.getElementById("sel1").options.length;
	var account_type = user_account_type();
	if(account_type == 2 && sections_quantity >= 3){upgrade_account_modal(); return;}
	var section_properties = get_section_properties();
	var section_properties_json = JSON.stringify(section_properties);
	$.ajax({
	  	type: 'post',
	  	dataType: 'json',
		async: false,
		data: {section_properties_json: section_properties_json},
	  	url: "retrieve-sections.php?g=add",
	});
	section_retrieve_database();
	var section_selected = document.getElementById("sel1");
	var section_name =  section_properties['section_name'];
	section_selected.value = section_name;
	change_section_properties();

}

function new_section_modal() {

	var logged_in = user_logged_in();
	var account_type = user_account_type();
	if(logged_in == 0){upgrade_account_modal(); return;}
	if(account_type == 1){
		var has_access = user_has_access();
		if(has_access == false){
			upgrade_account_modal(); 
			return;
		}
	}
	if(beam_length_check() == false){return;}
	var section_start_location = document.getElementById("section-start-location");
	var section_end_location = document.getElementById("section-end-location");
	section_start_location.value = "0";
	section_end_location.value = return_beam_length();
	open_modal('section-modal');
	document.getElementById('add-section').innerHTML = 'Add Section';
	document.getElementById('add-section').setAttribute( "onClick", "add_beam_section()" );
	section_retrieve_database();
	var section_selected = document.getElementById("sel1");
	section_selected.value = "New Section";
	change_section_properties();

}

function section_retrieve_database() {

	var sections;
	var sections_html;
	var sections_sample_html;
	var section_selected = document.getElementById("sel1");
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "retrieve-sections.php?g=store",
	}).done(function(result) {
	  sections = JSON.parse(result);
	});
	if(sections	== 	""){
		sections_sample_html = "<option value='Sample-W10x54'>Sample-W10x54</option>";
		sections.unshift("New Section");
	}else{
		sections_html = "<option value='New Section'>New Section</option>";
	}
	for(var i = 0; i < sections.length; i++){
		 sections_html = sections_html + "<option value='" + sections[i] +"'>" + sections[i] + "</option>";
	}
	sections_html = sections_html + sections_sample_html;
	section_selected.innerHTML	= sections_html;

}

function change_section_properties(){

	var section_selected = document.getElementById("sel1");
	var value = section_selected.options[section_selected.selectedIndex].value;
	var area = document.getElementById("area");
	var modulus = document.getElementById("modulus-of-elasticity");
	var select_material = document.getElementById("select-material");
	var inertia = document.getElementById("moment-of-inertia");
	var y_top = document.getElementById("y-top");
	var y_bottom = document.getElementById("y-bottom");
	var start_location = document.getElementById("section-start-location");
	var end_location = document.getElementById("section-end-location");
	var section_name_modal = document.getElementById("section-name-modal");
	var section_properties;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "retrieve-sections.php?g=retrieveSection-" + value,
	}).done(function(result) {
	  	section_properties = JSON.parse(result);
	});
	var select_length = document.getElementById("select-length");
	var current_length_unit = document.getElementsByClassName("length-unit")[0].innerHTML;
	var model_system;
	var section_length_text;
	var section_stress_text;
	if(current_length_unit == "mm" || current_length_unit == "cm" || current_length_unit == "m"){
		model_system = "metric";
		section_length_text = "mm";
		section_stress_text = "MPa"
	}else{
		model_system = "imperial";
		section_length_text = "in";
		section_stress_text = "ksi"
	}
	if(section_properties !== null){
		area.value = section_properties.area;
		modulus.value = section_properties.modulus;
		select_material.value = section_properties.select_material;
		inertia.value = section_properties.inertia;
		y_bottom.value = section_properties.y_bottom;
		y_top.value = section_properties.y_top;
		section_name_modal.value = section_properties.section_name;
		if(model_system != section_properties.units){
			if(model_system == "metric"){
				convert_section_unit_database("in", current_length_unit, section_length_text, section_stress_text);
			}else{
				convert_section_unit_database("mm", current_length_unit, section_length_text, section_stress_text);
			}
		}
	}else if(value == "New Section"){
		var shape_sel = document.getElementById("steel-shape");
	    if(shape_sel){
	    	shape_sel.parentElement.removeChild(shape_sel);
	    }
	    var category_sel = document.getElementById("steel-category");
	    if(category_sel){
	    	category_sel.parentElement.removeChild(category_sel);
	    }
		document.getElementById("steel-shape-standard").value = "";
		document.getElementById("")
		area.value = "";
		select_material.value = "Steel";
		if(model_system == "metric"){
			modulus.value = 200000;
		}else{
			modulus.value = 29000;	
		}
		inertia.value = "";
		y_bottom.value = "";
		y_top.value = "";
		section_name_modal.value = "";
	}else if(value == "Sample-W10x54"){
		select_material.value = "Steel";
		var select_length = document.getElementById("select-length");
		var current_length_unit = select_length.options[select_length.selectedIndex].value;
		if(model_system == "metric"){
			area.value = 10193;
			modulus.value = 200000;
			inertia.value = 126118122;
			y_bottom.value = 127.6;
			y_top.value = 127.6;
		}else{
			area.value = 15.8;
			modulus.value = 29000;	
			inertia.value = 303;
			y_bottom.value = 5.045;
			y_top.value = 5.045;
		}
		section_name_modal.value = "Sample-W10x54";
	}

}

function change_shape_standard(element){

	var	database_sections = document.getElementById('sel1');
	var steel_category = document.getElementById('steel-category');
	var shape_sel = document.getElementById("steel-shape");
    if(shape_sel){
    	shape_sel.parentElement.removeChild(shape_sel);
    }
	if(steel_category){
    	steel_category.parentElement.removeChild(steel_category);
	}
	database_sections.value = "";
	var shape_standard_selected = document.getElementById("steel-shape-standard");
	var value = shape_standard_selected.options[shape_standard_selected.selectedIndex].value;
	var new_sel = document.createElement("div");
	var sel_html = "<div class='col-sm-3'>"
                         + "<select class='form-control' id='steel-category' onchange='change_steel_category(this)'>"
                         + "<option style='display:none;''></option>";
    var category;
    var database_name = section_database_name();
    $.ajax({
	  type: "GET",
	  async: false,
	  url: "retrieve-sections.php?g=" + database_name + "-category",
	}).done(function(result) {
	  	category = JSON.parse(result);
	});
    for(var i = 0; i < category.length; i++){
    	sel_html = sel_html + "<option value='" + category[i] + "'>" + category[i] + "</option>";
    }
    new_sel.innerHTML = sel_html + "</select></div>";
	var shape_standard_div = element.parentNode;
	shape_standard_div.parentNode.insertBefore(new_sel, shape_standard_div.nextSibling);

}

function change_steel_category(element){

	var	database_sections = document.getElementById('sel1');
	database_sections.value = "";
	var steel_category_selected = document.getElementById("steel-category");
	var value = steel_category_selected.options[steel_category_selected.selectedIndex].value;
	var new_sel = document.createElement("div");
	var shape_sel = document.getElementById("steel-shape");
    if(shape_sel){
    	shape_sel.parentElement.removeChild(shape_sel);
    }
	var sel_html = "<div class='col-sm-3'>"
                         + "<select class='form-control' id='steel-shape' onchange='change_steel_properties()'>"
                         + "<option style='display:none;''></option>";
    var category_json = JSON.stringify(value);
    var shape;
    var database_name = section_database_name();
    $.ajax({
	  type: 'post',
	  dataType: 'json',
	  async: false,
	  data: {category_json: category_json},
	  url: "retrieve-sections.php?g=" + database_name + "-shape",
	}).done(function(result) {
	  shape = result;
	});
    for(var i = 0; i < shape.length; i++){
    	sel_html = sel_html + "<option value='" + shape[i] + "'>" + shape[i] + "</option>";
    }
    new_sel.innerHTML = sel_html + "</select></div>";
	var steel_category_div = element.parentNode;
	steel_category_div.parentNode.insertBefore(new_sel, steel_category_div.nextSibling);

}

function change_steel_properties(element){
	var	database_sections = document.getElementById('sel1');
	database_sections.value = "";
	var shape_selected = document.getElementById("steel-shape");
	var value = shape_selected.options[shape_selected.selectedIndex].value;
	var area = document.getElementById("area");
	var modulus = document.getElementById("modulus-of-elasticity");
	var select_material = document.getElementById("select-material");
	var inertia = document.getElementById("moment-of-inertia");
	var y_top = document.getElementById("y-top");
	var y_bottom = document.getElementById("y-bottom");
	var section_name_modal = document.getElementById("section-name-modal");
	var shape_json = JSON.stringify(value);
	var section_properties;
	var database_name = section_database_name();
	$.ajax({
	  type: 'post',
	  dataType: 'json',
	  async: false,
	  data: {shape_json: shape_json},
	  url: "retrieve-sections.php?g=" + database_name + "-properties",
	}).done(function(result) {
	  section_properties = result;
	});

	area.value = section_properties.area;
	modulus.value = section_properties.modulus;
	select_material.value = section_properties.select_material;
	inertia.value = section_properties.inertia;
	y_bottom.value = section_properties.y_bottom;
	y_top.value = section_properties.y_top;
	section_name_modal.value = section_properties.section_name;

	var select_length = document.getElementById("select-length");
	var current_length_unit = document.getElementsByClassName("length-unit")[0].innerHTML;
	var model_system;
	var section_length_text;
	var section_stress_text;
	if(current_length_unit == "mm" || current_length_unit == "cm" || current_length_unit == "m"){
		model_system = "metric";
		section_length_text = "mm";
		section_stress_text = "MPa"
	}else{
		model_system = "imperial";
		section_length_text = "in";
		section_stress_text = "ksi"
	}
	if(model_system != section_properties.units){
		if(model_system == "metric"){
			convert_section_unit_database("in", current_length_unit, section_length_text, section_stress_text);
		}else{
			convert_section_unit_database("mm", current_length_unit, section_length_text, section_stress_text);
		}
	}
}

function get_section_properties(){

	var section_properties = {};
	section_properties['area'] = document.getElementById("area").value;
	section_properties['modulus'] = document.getElementById("modulus-of-elasticity").value;
	section_properties['select_material'] = document.getElementById("select-material").value;
	section_properties['inertia'] = document.getElementById("moment-of-inertia").value;
	section_properties['y_top'] = document.getElementById("y-top").value;
	section_properties['y_bottom'] = document.getElementById("y-bottom").value;
	section_properties['section_name'] = document.getElementById("section-name-modal").value;
	section_properties['start_location'] = document.getElementById("section-start-location").value;
	section_properties['end_location'] = document.getElementById("section-end-location").value;
	var select_length = document.getElementById("select-length");
	var current_length_unit = select_length.options[select_length.selectedIndex].value;
	if(current_length_unit == "mm" || current_length_unit == "cm" || current_length_unit == "m"){
		section_properties['units'] = "metric";
	}else{
		section_properties['units'] = "imperial";
	}
	return section_properties;

}

function section_database_name(){
	var database_name
    var shape_standard = document.getElementById("steel-shape-standard");
	if(shape_standard.options[shape_standard.selectedIndex].value == 'America'){
	    return database_name = "aisc";
	}else if (shape_standard.options[shape_standard.selectedIndex].value == 'Canada') {
    	return database_name = "cisc";
    }else if (shape_standard.options[shape_standard.selectedIndex].value == 'Australia') {
    	return database_name = "australia";
    }else if (shape_standard.options[shape_standard.selectedIndex].value == 'Europe') {
    	return database_name = "europe";
    }else if (shape_standard.options[shape_standard.selectedIndex].value == 'British') {
    	return database_name = "british";
    }
}

function account_type_monthly(){
	document.getElementById('yearly').checked = false;
	account_type = document.getElementById('account_type');
	subscription = account_type.value.split(' ')[0];
	if(subscription == "Basic"){
		account_type.value = "Basic - US$5.49 / Billed Monthly";
	}else if(subscription == "Pro"){
		account_type.value = "Pro - US$9.99 / Billed Monthly";
	}
}

function account_type_yearly(){
	document.getElementById('monthly').checked = false;
	account_type = document.getElementById('account_type');
	subscription = account_type.value.split(' ')[0];
	if(subscription == "Basic"){
		account_type.value = "Basic - US$83.88 / Billed Yearly";
	}else if(subscription == "Pro"){
		account_type.value = "Pro - US$83.88 / Billed Yearly";
	}
}

function decode_html(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function check(){
	console.log("Its working");
}
$(function () {
	$('[data-toggle="tooltip"]').tooltip();
  });