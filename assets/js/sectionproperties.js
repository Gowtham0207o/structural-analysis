function reset_section_properties(){
	reset_inputs('section-input');
	document.getElementById('form-error').innerHTML = "";
	var myTable = document.getElementById('section-properties-table');
	var index;
	for(index = 0; index < myTable.rows.length-1; ++index){
		myTable.rows[index+1].cells[1].innerHTML = '-';
	}
}

function reset_inputs(id){
	var container = document.getElementById(id);
    var inputs = container.getElementsByTagName('input');
    for (var index = 0; index < inputs.length; ++index) {
        inputs[index].value = '';
    }
}

function validate_activity(form)
{
    var inputs, index;
    inputs = form.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
        // deal with inputs[index] element.
        if (inputs[index].value==null || inputs[index].value=="" || !is_number(inputs[index].value))
        {
            document.getElementById('form-error').innerHTML = "Not a Valid Input";
            return false;
        }
    }
}

function is_number(n) {
  	return !isNaN(parseFloat(n)) && isFinite(n);
}

function I_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var bf1 = parseFloat(document.getElementById('I_bf1').value);
		var bf2 = parseFloat(document.getElementById('I_bf2').value);
		var hf1 = parseFloat(document.getElementById('I_hf1').value);
		var hf2 = parseFloat(document.getElementById('I_hf2').value);
		var tw = parseFloat(document.getElementById('I_tw').value);
		var hw = parseFloat(document.getElementById('I_hw').value);
		var area = bf1*hf1 + bf2*hf2 + tw*hw;
		var centroid_x = Math.max(bf1,bf2) / 2;
		var centroid_y = ((hf2/2*bf2*hf2) + ((hf2 + hw/2)*(hw*tw)) + ((hf2 + hw + hf1/2)*(bf1*hf1))) / area;
		var y_top = hf1 + hf2 + hw - centroid_y;
		var inertia_x = (1/12*bf2*Math.pow(hf2,3)) + (bf2*hf2*Math.pow(centroid_y - hf2/2,2))
						+ (1/12*tw*Math.pow(hw,3)) + Math.abs((hw*tw*Math.pow(hf2 + hw/2 - centroid_y,2)))
						+ (1/12*bf1*Math.pow(hf1,3)) + (bf1*hf1*Math.pow(hf2 + hw + hf1/2 - centroid_y,2));
		var inertia_y = (1/12*hf2*Math.pow(bf2,3))
						+ (1/12*hw*Math.pow(tw,3))
						+ (1/12*hf1*Math.pow(bf1,3));
		var smodulus_x = inertia_x/Math.max(y_top, centroid_y);
		var smodulus_y = inertia_y/centroid_x;
		var rgyration_x = Math.sqrt(inertia_x/area);
		var rgyration_y = Math.sqrt(inertia_y/area);
		var pmodulus_x = (bf2*hf2)*(centroid_y - hf2/2) + (bf1*hf1)*(y_top - hf1/2) 
						+ ((centroid_y-hf2)*tw)*((centroid_y-hf2)/2) + ((y_top-hf1)*tw)*((y_top-hf1)/2);
		var pmodulus_y = (2*(bf2/2*hf2)*(bf2/4)) + (2*(bf1/2*hf1)*(bf1/4));
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid_x;
		myTable.rows[3].cells[1].innerHTML = centroid_y;
		myTable.rows[4].cells[1].innerHTML = inertia_x;
		myTable.rows[5].cells[1].innerHTML = inertia_y;
		myTable.rows[6].cells[1].innerHTML = smodulus_x;
		myTable.rows[7].cells[1].innerHTML = smodulus_y;
		myTable.rows[8].cells[1].innerHTML = pmodulus_x;
		myTable.rows[9].cells[1].innerHTML = pmodulus_y;
		myTable.rows[10].cells[1].innerHTML = rgyration_x;
		myTable.rows[11].cells[1].innerHTML = rgyration_y;
		calculate_properties_count();
	}
};

function C_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var bf1 = parseFloat(document.getElementById('C_bf1').value);
		var bf2 = parseFloat(document.getElementById('C_bf2').value);
		var hf1 = parseFloat(document.getElementById('C_hf1').value);
		var hf2 = parseFloat(document.getElementById('C_hf2').value);
		var tw = parseFloat(document.getElementById('C_tw').value);
		var hw = parseFloat(document.getElementById('C_hw').value);
		var area = bf1*hf1 + bf2*hf2 + tw*hw;
		var centroid_x = ((bf2/2*bf2*hf2) + (tw/2*hw*tw) + (bf1/2*bf1*hf1)) / area;
		var centroid_y = ((hf2/2*bf2*hf2) + ((hf2 + hw/2)*(hw*tw)) + ((hf2 + hw + hf1/2)*(bf1*hf1))) / area;
		var y_top = hf1 + hf2 + hw - centroid_y;
		var inertia_x = (1/12*bf2*Math.pow(hf2,3)) + (bf2*hf2*Math.pow(centroid_y - hf2/2,2))
						+ (1/12*tw*Math.pow(hw,3)) + Math.abs((hw*tw*Math.pow(hf2 + hw/2 - centroid_y,2)))
						+ (1/12*bf1*Math.pow(hf1,3)) + (bf1*hf1*Math.pow(hf2 + hw + hf1/2 - centroid_y,2));
		var inertia_y = (1/12*hw*Math.pow(tw,3)) + (hw*tw*Math.pow(centroid_x - tw/2,2))
						+ (1/12*hf2*Math.pow(centroid_x,3)) + (centroid_x*hf2*Math.pow(centroid_x/2,2))
						+ (1/12*hf1*Math.pow(centroid_x,3)) + (centroid_x*hf1*Math.pow(centroid_x/2,2))
						+ (1/12*hf2*Math.pow(bf2-centroid_x,3)) + ((bf2-centroid_x)*hf2*Math.pow((bf2-centroid_x)/2,2))
						+ (1/12*hf2*Math.pow(bf1-centroid_x,3)) + ((bf1-centroid_x)*hf2*Math.pow((bf1-centroid_x)/2,2))
		var smodulus_x = inertia_x/Math.max(y_top, centroid_y);
		var smodulus_y = inertia_y/Math.max(centroid_x, Math.max(bf1,bf2)-centroid_x);
		var rgyration_x = Math.sqrt(inertia_x/area);
		var rgyration_y = Math.sqrt(inertia_y/area);
		var pmodulus_x = "-";
		var pmodulus_y = "-";
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid_x;
		myTable.rows[3].cells[1].innerHTML = centroid_y;
		myTable.rows[4].cells[1].innerHTML = inertia_x;
		myTable.rows[5].cells[1].innerHTML = inertia_y;
		myTable.rows[6].cells[1].innerHTML = smodulus_x;
		myTable.rows[7].cells[1].innerHTML = smodulus_y;
		myTable.rows[8].cells[1].innerHTML = pmodulus_x;
		myTable.rows[9].cells[1].innerHTML = pmodulus_y;
		myTable.rows[10].cells[1].innerHTML = rgyration_x;
		myTable.rows[11].cells[1].innerHTML = rgyration_y;
		calculate_properties_count();
	}
};

function T_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var bf = parseFloat(document.getElementById('T_bf').value);
		var hf = parseFloat(document.getElementById('T_hf').value);
		var tw = parseFloat(document.getElementById('T_tw').value);
		var hw = parseFloat(document.getElementById('T_hw').value);
		var area = bf*hf + tw*hw;
		var centroid_x = ((bf/2*bf*hf) + (bf/2*hw*tw)) / area;
		var centroid_y = ((hw/2*hw*tw) + ((hw + hf/2)*(bf*hf))) / area;
		var y_top = hf + hw - centroid_y;
		var inertia_x = (1/12*tw*Math.pow(hw,3)) + (hw*tw*Math.pow(centroid_y - hw/2,2))
						+ (1/12*bf*Math.pow(hf,3)) + (bf*hf*Math.pow(hw + hf/2 - centroid_y,2));
		var inertia_y = (1/12*hw*Math.pow(tw,3))
						+ (1/12*hf*Math.pow(bf,3));
		var smodulus_x = inertia_x/Math.max(y_top, centroid_y);
		var smodulus_y = inertia_y/centroid_x;
		var rgyration_x = Math.sqrt(inertia_x/area);
		var rgyration_y = Math.sqrt(inertia_y/area);
		var pmodulus_x = "-";
		var pmodulus_y = "-";
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid_x;
		myTable.rows[3].cells[1].innerHTML = centroid_y;
		myTable.rows[4].cells[1].innerHTML = inertia_x;
		myTable.rows[5].cells[1].innerHTML = inertia_y;
		myTable.rows[6].cells[1].innerHTML = smodulus_x;
		myTable.rows[7].cells[1].innerHTML = smodulus_y;
		myTable.rows[8].cells[1].innerHTML = pmodulus_x;
		myTable.rows[9].cells[1].innerHTML = pmodulus_y;
		myTable.rows[10].cells[1].innerHTML = rgyration_x;
		myTable.rows[11].cells[1].innerHTML = rgyration_y;
		calculate_properties_count();
	}
};

function A_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var a = parseFloat(document.getElementById('A_aw').value);
		var b = parseFloat(document.getElementById('A_bw').value);
		var t1 = parseFloat(document.getElementById('A_t1').value);
		var t2 = parseFloat(document.getElementById('A_t2').value);
		
		var area = a*t1 + (b-t1)*t2;
		var centroid_x = ((a/2*a*t1) + (t2/2*(b-t1)*t2)) / area;
		var centroid_y = ((t1/2*a*t1) + ((t1 + (b-t1)/2)*((b-t1)*t2))) / area;
		var y_top = b - centroid_y;
		var inertia_x = (1/12*a*Math.pow(t1,3)) + (a*t1*Math.pow(centroid_y - t1/2,2))
						+ (1/12*t2*Math.pow(b-t1,3)) + ((b-t1)*t2*Math.pow(t1 + (b-t1)/2 - centroid_y,2));
		var inertia_y = (1/12*t1*Math.pow(a,3)) + (a*t1*Math.pow(a/2 - centroid_x,2))
						+ (1/12*(b-t1)*Math.pow(t2,3)) + ((b-t1)*t2*Math.pow(centroid_x - t2/2,2));
		var smodulus_x = inertia_x/Math.max(y_top, centroid_y);
		var smodulus_y = inertia_y/Math.max(centroid_x, a - centroid_x);
		var rgyration_x = Math.sqrt(inertia_x/area);
		var rgyration_y = Math.sqrt(inertia_y/area);
		var pmodulus_x = "-";
		var pmodulus_y = "-";
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid_x;
		myTable.rows[3].cells[1].innerHTML = centroid_y;
		myTable.rows[4].cells[1].innerHTML = inertia_x;
		myTable.rows[5].cells[1].innerHTML = inertia_y;
		myTable.rows[6].cells[1].innerHTML = smodulus_x;
		myTable.rows[7].cells[1].innerHTML = smodulus_y;
		myTable.rows[8].cells[1].innerHTML = pmodulus_x;
		myTable.rows[9].cells[1].innerHTML = pmodulus_y;
		myTable.rows[10].cells[1].innerHTML = rgyration_x;
		myTable.rows[11].cells[1].innerHTML = rgyration_y;
		calculate_properties_count();
	}
};

function CI_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var d = parseFloat(document.getElementById('CI_d').value);		
		var area = Math.PI*Math.pow(d/2,2);
		var centroid = d/2;
		var inertia = (1/4*Math.PI*Math.pow(d/2,4));
		var smodulus = inertia/centroid;
		var rgyration = Math.sqrt(inertia/area);
		var pmodulus = Math.pow(d,3)/6;
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid;
		myTable.rows[3].cells[1].innerHTML = centroid;
		myTable.rows[4].cells[1].innerHTML = inertia;
		myTable.rows[5].cells[1].innerHTML = inertia;
		myTable.rows[6].cells[1].innerHTML = smodulus;
		myTable.rows[7].cells[1].innerHTML = smodulus;
		myTable.rows[8].cells[1].innerHTML = pmodulus;
		myTable.rows[9].cells[1].innerHTML = pmodulus;
		myTable.rows[10].cells[1].innerHTML = rgyration;
		myTable.rows[11].cells[1].innerHTML = rgyration;
		calculate_properties_count();
	}
};

function HC_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var d_inner = parseFloat(document.getElementById('HC_di').value);
		var d_outer = parseFloat(document.getElementById('HC_do').value);			
		var area = Math.PI*Math.pow(d_outer/2,2) - Math.PI*Math.pow(d_inner/2,2);
		var centroid = d_outer/2;
		var inertia = (1/4*Math.PI*(Math.pow(d_outer/2,4) - Math.pow(d_inner/2,4)));
		var smodulus = (2*inertia)/ d_outer;
		var rgyration = Math.sqrt(inertia/area);
		var pmodulus = (Math.pow(d_outer,3) - Math.pow(d_inner,3))/6;
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid;
		myTable.rows[3].cells[1].innerHTML = centroid;
		myTable.rows[4].cells[1].innerHTML = inertia;
		myTable.rows[5].cells[1].innerHTML = inertia;
		myTable.rows[6].cells[1].innerHTML = smodulus;
		myTable.rows[7].cells[1].innerHTML = smodulus;
		myTable.rows[8].cells[1].innerHTML = pmodulus;
		myTable.rows[9].cells[1].innerHTML = pmodulus;
		myTable.rows[10].cells[1].innerHTML = rgyration;
		myTable.rows[11].cells[1].innerHTML = rgyration;
		calculate_properties_count();
	}
};

function R_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var b = parseFloat(document.getElementById('R_b').value);
		var d = parseFloat(document.getElementById('R_d').value);
		var area = b*d;
		var centroid_x = b/2;
		var centroid_y = d/2;
		var inertia_x = (1/12*b*Math.pow(d,3));
		var inertia_y = (1/12*d*Math.pow(b,3));
		var smodulus_x = inertia_x/centroid_y;
		var smodulus_y = inertia_y/centroid_x;
		var rgyration_x = Math.sqrt(inertia_x/area);
		var rgyration_y = Math.sqrt(inertia_y/area);
		var pmodulus_x = b*Math.pow(d,2) / 4;
		var pmodulus_y = d*Math.pow(b,2) / 4;
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid_x;
		myTable.rows[3].cells[1].innerHTML = centroid_y;
		myTable.rows[4].cells[1].innerHTML = inertia_x;
		myTable.rows[5].cells[1].innerHTML = inertia_y;
		myTable.rows[6].cells[1].innerHTML = smodulus_x;
		myTable.rows[7].cells[1].innerHTML = smodulus_y;
		myTable.rows[8].cells[1].innerHTML = pmodulus_x;
		myTable.rows[9].cells[1].innerHTML = pmodulus_y;
		myTable.rows[10].cells[1].innerHTML = rgyration_x;
		myTable.rows[11].cells[1].innerHTML = rgyration_y;
		calculate_properties_count();
	}
};

function HR_section_calculate(form_id){
	var form=document.getElementById(form_id);
	if(validate_activity(form) !== false){
		document.getElementById('form-error').innerHTML = "";
		var myTable = document.getElementById('section-properties-table');
		var b_outer = parseFloat(document.getElementById('HR_bo').value);
		var d_outer = parseFloat(document.getElementById('HR_do').value);
		var b_inner = parseFloat(document.getElementById('HR_bi').value);
		var d_inner = parseFloat(document.getElementById('HR_di').value);
		var area = b_outer*d_outer - b_inner*d_inner;
		var centroid_x = b_outer/2;
		var centroid_y = d_outer/2;
		var inertia_x = (1/12*b_outer*Math.pow(d_outer,3)) - (1/12*b_inner*Math.pow(d_inner,3));
		var inertia_y = (1/12*d_outer*Math.pow(b_outer,3)) - (1/12*d_inner*Math.pow(b_inner,3));
		var smodulus_x = inertia_x/centroid_y;
		var smodulus_y = inertia_y/centroid_x;
		var rgyration_x = Math.sqrt(inertia_x/area);
		var rgyration_y = Math.sqrt(inertia_y/area);
		var pmodulus_x = (b_outer*Math.pow(d_outer,2) / 4) - (b_inner*Math.pow(d_inner,2) / 4);
		var pmodulus_y = (d_outer*Math.pow(b_outer,2) / 4) - (d_inner*Math.pow(b_inner,2) / 4);
		myTable.rows[1].cells[1].innerHTML = area;
		myTable.rows[2].cells[1].innerHTML = centroid_x;
		myTable.rows[3].cells[1].innerHTML = centroid_y;
		myTable.rows[4].cells[1].innerHTML = inertia_x;
		myTable.rows[5].cells[1].innerHTML = inertia_y;
		myTable.rows[6].cells[1].innerHTML = smodulus_x;
		myTable.rows[7].cells[1].innerHTML = smodulus_y;
		myTable.rows[8].cells[1].innerHTML = pmodulus_x;
		myTable.rows[9].cells[1].innerHTML = pmodulus_y;
		myTable.rows[10].cells[1].innerHTML = rgyration_x;
		myTable.rows[11].cells[1].innerHTML = rgyration_y;
		calculate_properties_count();
	}
};


function calculate_properties_count(){
	$.ajax({
	  	type: "GET",
	  	async: false,
	  	url: "server-calls.php?g=calculate-properties-count",
	});
}

function change_section_input(){
	var myTable = document.getElementById('section-properties-table');
	var index;
	for(index = 0; index < myTable.rows.length-1; ++index){
		myTable.rows[index+1].cells[1].innerHTML = '-';
	}
	var input_required = document.getElementById("select-input");
	var value = input_required.options[input_required.selectedIndex].value;
	var section_input = get_section_inputs(value); 
							
	document.getElementById('section-input').innerHTML = "";
	$('#section-input').append(section_input);	
};

function get_section_inputs(section){
	if(section === "I_Section"){
		section = 	"<img src='images/isection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'I-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Top Flange Width - bf1:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='I_bf1' class='form-control' placeholder='bf1'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Top Flange Thickness - hf1:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='I_hf1' class='form-control' placeholder='hf1'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Bottom Flange Width - bf2:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='I_bf2' class='form-control' placeholder='bf2'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Bottom Flange Thickness - hf2:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='I_hf2' class='form-control' placeholder='hf2'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Web Height - hw:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='I_hw' class='form-control' placeholder='hw'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Web Thickness - tw:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='I_tw' class='form-control' placeholder='tw'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='I_section_calculate(\"I-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
	if(section === "C_Section"){
		section = 	"<img src='images/csection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'C-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Top Flange Width - bf1:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='C_bf1' class='form-control' placeholder='bf1'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Top Flange Thickness - hf1:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='C_hf1' class='form-control' placeholder='hf1'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Bottom Flange Width - bf2:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='C_bf2' class='form-control' placeholder='bf2'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Bottom Flange Thickness - hf2:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='C_hf2' class='form-control' placeholder='hf2'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Web Height - hw:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='C_hw' class='form-control' placeholder='hw'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Web Thickness - tw:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='C_tw' class='form-control' placeholder='tw'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='C_section_calculate(\"C-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
	if(section === "T_Section"){
		section = 	"<img src='images/tsection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'T-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Top Flange Width - bf:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='T_bf' class='form-control' placeholder='bf'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Top Flange Thickness - hf:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='T_hf' class='form-control' placeholder='hf'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Web Height - hw:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='T_hw' class='form-control' placeholder='hw'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Web Thickness - tw:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='T_tw' class='form-control' placeholder='tw'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='T_section_calculate(\"T-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
	if(section === "A_Section"){
		section = 	"<img src='images/asection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'A-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Leg Width - a:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='A_aw' class='form-control' placeholder='a'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Leg Width - b:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='A_bw' class='form-control' placeholder='b'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Leg 'a' Thickness - t1:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='A_t1' class='form-control' placeholder='t1'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Leg 'b' Thickness - t2:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='A_t2' class='form-control' placeholder='t2'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='A_section_calculate(\"A-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
	if(section === "CI_Section"){
		section = 	"<img src='images/cisection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'CI-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Diameter - d:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='CI_d' class='form-control' placeholder='d'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='CI_section_calculate(\"CI-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
		if(section === "HC_Section"){
		section = 	"<img src='images/hcsection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'HC-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Outer Diameter - do:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='HC_do' class='form-control' placeholder='do'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Inner Diameter - di:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='HC_di' class='form-control' placeholder='di'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='HC_section_calculate(\"HC-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
	if(section === "R_Section"){
		section = 	"<img src='images/rsection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'R-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Width - b:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='R_b' class='form-control' placeholder='b'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Depth - d:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='R_d' class='form-control' placeholder='d'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='R_section_calculate(\"R-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
	if(section === "HR_Section"){
		section = 	"<img src='images/hrsection.png' class='center-block' style='margin-top: 20px;'>"
			                +"<form id = 'HR-section-input' action='' method='post' class='form-horizontal' style='margin-top: 20px;'>"
			                +	 "<p id='form-error'></p>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Outer Width - bo:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='HR_bo' class='form-control' placeholder='bo'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Inner Width - bi:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='HR_bi' class='form-control' placeholder='bi'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Outer Depth - do:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='HR_do' class='form-control' placeholder='do'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<label class='control-label col-sm-6'>Inner Depth - di:</label>"
			                +        "<div class='col-sm-4'>"
			                +            "<input type='text' id='HR_di' class='form-control' placeholder='di'>"
			                +        "</div>"
			                +    "</div>"
			                +    "<div class='form-group'>"
			                +        "<div class='col-sm-offset-2 col-m-offset-2 col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-danger' onclick='reset_section_properties()'>Clear</button>"
			                +        "</div>"
			                +        "<div class='col-md-4 col-xs-4'>"
			                +            "<button type='button' class='btn btn-block btn-primary' onclick='HR_section_calculate(\"HR-section-input\")'>Calculate</button>"
			                +        "</div>"
			                +    "</div>"
			                +"</form>";
		return section;
	}
}