$(document).on("keyup", "#manager-model-modal input[type='text']", function (event) {

    if (event.keyCode == 13) {
        //add_folder_database();
        $(this).blur();
    }

});

$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
  label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$(document).on("click", '#file-list li', function() { 

    $that = $(this);   
    $('#file-list').find('li').removeClass('file-active');
    $('#folder-list').find('li').removeClass('file-active');
    $that.addClass('file-active');
    
});

$(document).on("click", '#folder-list li', function() { 

    $that = $(this);   
    $('#file-list').find('li').removeClass('file-active');
    $('#folder-list').find('li').removeClass('file-active');
    $that.addClass('file-active');
    
});

function save_modal(){

	if(check_upgrade_account() == true){upgrade_account_modal(); return;}
	var model_name = document.getElementById("model-name").innerHTML;
	if(model_name == ""){
		$('#manager-model-modal').modal('show');
		document.getElementById("manager-model-title").innerHTML = "Save Model";
		model_retrieve_database();
		document.getElementById("manager-action").innerHTML = "Save";
		document.getElementById("model-input-save").innerHTML = "<label class='control-label'>Model Name:</label>"
                        										+ "<input type='text' class='form-control' name='area'" 
                       											+ "id='model-name-save' autocomplete='off' data-modalfocus>";
        document.getElementById("manager-action").setAttribute("onClick", "save_model('model-name-save', 'save')");
	}else{
		save_model('model-name', 'save');
	}

}

function save_as_modal(){
	
	if(check_upgrade_account() == true){upgrade_account_modal(); return;}
	$('#manager-model-modal').modal('show');
	document.getElementById("manager-model-title").innerHTML = "Save As Model";
	model_retrieve_database();
	document.getElementById("manager-action").innerHTML = "Save As";
	document.getElementById("model-input-save").innerHTML = "<label class='control-label'>Model Name:</label>"
                        										+ "<input type='text' autocomplete='off' class='form-control' name='area'" 
                        										+ "id='model-name-save' value='' data-modalfocus>";
    document.getElementById("manager-action").setAttribute("onClick", "save_model('model-name-save', 'saveas')");

}

function open_model_modal(){
	
	if(check_upgrade_account() == true){upgrade_account_modal(); return;}
	$('#manager-model-modal').modal('show');
	document.getElementById("manager-model-title").innerHTML = "Open Model";
	model_retrieve_database();
	document.getElementById("manager-action").innerHTML = "Open";
	document.getElementById("manager-action").setAttribute("onClick", "open_saved_model()");
	document.getElementById("model-input-save").innerHTML = "";

}

function check_upgrade_account(){
	
	var logged_in = user_logged_in();
	var account_type = user_account_type();
	if(logged_in == 0){return true;}
	if(account_type == 1){
		var has_access = user_has_access();
		if(has_access == false){
			return true;
		}
	}

}

$('#save-modal').on('hidden.bs.modal', function () {

    $(this).find('input').val('');

});

$('#saveas-modal').on('hidden.bs.modal', function () {

    $(this).find('input').val('');

});

function model_retrieve_database() {

	var logged_in = user_logged_in();
	var account_type = user_account_type();
	if(account_type == 1){
		var has_access = user_has_access();
		if(has_access == false){
			upgrade_account_modal(); 
			return false;
		}
	}
	if(logged_in == 0){upgrade_account_modal(); return;}
	
	var items;
	//$('#manager-model-modal').modal('show');
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "retrieve-models.php?g=store",
	}).done(function(result) {
	  //alert(result);
	  items = JSON.parse(result);
	});
	
	var files = items[0];
	var folders = items[1];
	add_folder_rows(folders);
	add_file_rows(files);
	document.getElementById("folder-button").disabled = false;
	return false;

}

function create_folder() {

	var	database_folders = document.getElementById('folder-list');
	var add_row =   "<div class='row display-flex'>"
					   + "<div class='col-sm-1 center-block'>"
					   + "<i class='fa fa-folder'></i>"
					   + "</div>"
					   + "<div class='col-sm-9'>"
					   + "<input type='text' id='new-optimal-folder' value ='New Folder' onblur='add_folder_database(this)' autocomplete='off'>"
					   + "</div>"
					   + "<div class='col-sm-1 center-block'>"
					   + "<a onclick='return edit_folder_name(this);' href=''><i class='fa fa-edit'></i></a>"
					   + "</div>"
					   + "<div class='col-sm-1 center-block'>"
					   + "<a type ='button' onclick='return remove_folder_database(this);' href=''><i class='fa fa-trash'></i></a>"
					   + "</div>"
					   + "</div>";
	database_folders.innerHTML = database_folders.innerHTML + add_row;
	$('#file-list').find('li').removeClass('file-active');
	document.getElementById('new-optimal-folder').select();

}

function add_folder_rows(folder_names){
	
	var	folder_div = document.getElementById('folder-list');
	var folder_html = "";
	for(var i = 0; i < folder_names.length; i++){
		folder_html = folder_html 
		 				+ "<div class='row display-flex'>"
	 				   	+ "<div class='col-sm-1 center-block'>"
						+ "<i class='fa fa-folder'></i>"
					   	+ "</div>"
						+ "<div class='col-sm-9'>" 
						+ "<li class='list-group-item model-list' ondblclick='open_folder_models(this)'>"
						+ folder_names[i]
		 				+ "</li>"
						+ "</div>"
						+ "<div class='col-sm-1 center-block'>"
						+ "<a onclick='return edit_folder_name(this)' href=''><i class='fa fa-edit'></i></a>"
						+ "</div>"
						+ "<div class='col-sm-1'>"
						+ "<a type ='button' onclick='return remove_folder_database(this)' href=''><i class='fa fa-trash'></i></a>"
						+ "</div>"
						+ "</div>";
	}
	folder_div.innerHTML = folder_html;

}

function add_file_rows(file_names){

	var	files_div = document.getElementById('file-list');
	var files_html="";
	for(var i = 0; i < file_names.length; i++){
		 files_html = files_html 
		 				+ "<div class='row display-flex'>"
	 				  	+ "<div class='col-sm-1 center-block'>"
						+ "<i class='fa fa-file'></i>"
					   	+ "</div>"
						+ "<div class='col-sm-9'>" 
						+ "<li class='list-group-item model-list' ondblclick='open_saved_model()'>"
						//+ "<i class='fa fa-file' style='padding-right:10px'></i>"
						+ file_names[i]
						+ "</li>"
						+ "</div>"
						+ "<div class='col-sm-1'>"
						+ "<a onclick='return edit_file_name(this)' href=''><i class='fa fa-edit'></i></a>"
					   	+ "</div>"
					   	+ "<div class='col-sm-1'>"
					   	+ "<a type ='button' onclick='return remove_model_database(this)' href=''><i class='fa fa-trash'></i></a>"
					   	+ "</div>"
					   	+ "</div>";
	}
	files_div.innerHTML = files_html;

}

function open_folder_models(element){

	var parent = element.parentNode.parentNode;
	var folder_name = parent.innerText.trim();
	var folder_html = "<div class='row display-flex'>"
					+ "<div class='col-sm-1 center-block'>"
					+ "<a onclick='return model_retrieve_database()' href=''><i class='fa fa-arrow-circle-left fa-lg'></i></a>"
					+ "</div>"
					+ "<div class='col-sm-11 center-block'>"
					+ "<h3 id='folder-title'>"
					+ folder_name
					+ "</h3>"
					+ "</div>"
					+ "</div>"
					+ "<hr style='height:2px;margin:0;color:gray;background-color:gray'>";
	var	folder_div = document.getElementById('folder-list');
	folder_div.innerHTML = folder_html;


	var files;
	$.ajax({
	  type: "post",
	  async: false,
	  data: {folder_name: JSON.stringify(folder_name)},
	  url: "retrieve-models.php?g=store-folder",
	}).done(function(result) {
	  files = JSON.parse(result);
	});
	add_file_rows(files);
	document.getElementById("folder-button").disabled = true;

}

function add_folder_database(element){
	
	var parent = element.parentNode;
	var folder_name = parent.lastChild.value;
	var errors_folder = new Array();
	errors_folder = check_before_adding_folder(folder_name);
	if(errors_folder.length != 0){
		document.getElementById("file-manager-updates").innerHTML = errors_folder;
		$('#file-manager-updates').fadeIn().delay(3000).fadeOut();
		parent.parentNode.remove(); 
		return;
	}
	$.ajax({
	  type: "post",
	  async: false,
	  data: {folder_name: JSON.stringify(folder_name)},
	  url: "retrieve-models.php?g=add-folder",
	});
	parent.innerHTML = 	"<li class='list-group-item model-list' ondblclick='open_folder_models(this)'>"
						+ folder_name
		 				+ "</li>";

}

function edit_folder_database(element){
	
	//var folder = document.getElementById('new-optimal-folder');
	var old_folder_name = element.id.split("optimalFolder-")[1];
	var parent = element.parentNode;
	var new_folder_name = parent.lastChild.value;
	$.ajax({
	  type: "post",
	  async: false,
	  data: {new_folder_name: JSON.stringify(new_folder_name), old_folder_name: JSON.stringify(old_folder_name)},
	  url: "retrieve-models.php?g=edit-folder",
	});
	parent.innerHTML = 	"<li class='list-group-item model-list' ondblclick='open_folder_models(this)'>"
						+ new_folder_name
		 				+ "</li>";

}

function edit_file_database(element){
	
	//var folder = document.getElementById('new-optimal-folder');
	var old_file_name = element.id.split("optimalFile-")[1];
	var parent = element.parentNode;
	var new_file_name = parent.lastChild.value;
	var folder_element = document.getElementById("folder-title");
	var folder_name = "";
	if(folder_element){
        folder_name = folder_element.innerHTML;
    }
	$.ajax({
	  type: "post",
	  async: false,
	  data: {new_file_name: JSON.stringify(new_file_name), old_file_name: JSON.stringify(old_file_name), folder_name: JSON.stringify(folder_name)},
	  url: "retrieve-models.php?g=edit-file",
	});
	parent.innerHTML = 	"<li class='list-group-item model-list' ondblclick='open_saved_model()'>"
						+ new_file_name
		 				+ "</li>";

}

function remove_model_database(element){

	var parent = element.parentNode.parentNode;
	var file_name = parent.innerText.trim();
	var folder_element = document.getElementById("folder-title");
	var folder_name = "";
	if(folder_element){
        folder_name = folder_element.innerHTML;
    }
	$.ajax({
	  type: "post",
	  async: false,
	  data: {file_name: JSON.stringify(file_name), folder_name: JSON.stringify(folder_name)},
	  url: "retrieve-models.php?g=remove",
	});
	parent.parentNode.removeChild(parent);
	return false;
	//model_retrieve_database();

}

function remove_folder_database(element){

	var parent = element.parentNode.parentNode;
	var folder_name = parent.innerText.trim();
	$.ajax({
	  type: "post",
	  async: false,
	  data: {folder_name: JSON.stringify(folder_name)},
	  url: "retrieve-models.php?g=remove-folder",
	});
	parent.parentNode.removeChild(parent);
	return false;

}

function edit_folder_name(element){

	var parent = element.parentNode.parentNode;
	var folder_name = parent.innerText.trim();
	var folder_html = "<div class='col-sm-1 center-block'>"
					+ "<i class='fa fa-folder'></i>"
					+ "</div>"
					+ "<div class='col-sm-9'>"
					+ "<input type='text' id= 'optimalFolder-" + folder_name + "' value ='" + folder_name + "' onblur='edit_folder_database(this)' autocomplete='off'>"
					+ "</div>"
					+ "<div class='col-sm-1 center-block'>"
					+ "<a onclick='return edit_folder_name(this)' href=''><i class='fa fa-edit'></i></a>"
					+ "</div>"
					+ "<div class='col-sm-1'>"
					+ "<a type ='button' onclick='return remove_folder_database(this)' href=''><i class='fa fa-trash'></i></a>"
					+ "</div>";
	parent.innerHTML = folder_html;
	parent.getElementsByTagName('input')[0].select();
	return false;

}

function edit_file_name(element){

	var parent = element.parentNode.parentNode;
	var file_name = parent.innerText.trim();
	var file_html = "<div class='col-sm-1 center-block'>"
					+ "<i class='fa fa-file'></i>"
					+ "</div>"
					+ "<div class='col-sm-9'>"
					+ "<input type='text' id= 'optimalFile-" + file_name + "' value ='" + file_name + "' onblur='edit_file_database(this)' autocomplete='off'>"
					+ "</div>"
					+ "<div class='col-sm-1 center-block'>"
					+ "<a onclick='return edit_file_name(this)' href=''><i class='fa fa-edit'></i></a>"
					+ "</div>"
					+ "<div class='col-sm-1'>"
					+ "<a type ='button' onclick='return remove_file_database(this)' href=''><i class='fa fa-trash'></i></a>"
					+ "</div>";
	parent.innerHTML = file_html;
	parent.getElementsByTagName('input')[0].select();
	return false;
	
}

function open_saved_model(){
	
	var logged_in = user_logged_in();
	if(logged_in == 0){upgrade_account_modal(); return;}
	var	file_name = document.getElementsByClassName("file-active")[0].innerText.trim();

	var folder_element = document.getElementById("folder-title");
	var folder_name = "";
	if(folder_element){
        folder_name = folder_element.innerHTML;
    }
	new_model();
	var model_data;
	$.ajax({
	  	type: 'post',
	  	dataType: 'json',
		async: false,
		data: {file_name: JSON.stringify(file_name), folder_name: JSON.stringify(folder_name)},
	  	url: "retrieve-models.php?g=open",
	}).done(function(result) {
	  	model_data = result;
	});
	var model_name_html = document.getElementById("model-name");
	document.getElementById("model-path").value = folder_name + '/' + model_data['file_name'];
	model_name_html.innerHTML = model_data['file_name'];
	var length_selection = document.getElementById("select-length");
	var force_selection = document.getElementById("select-force");
	var section_inputs = JSON.parse(model_data['section_json']);
	var model_inputs = JSON.parse(model_data['model_json']);

	var units = model_inputs[Object.keys(model_inputs).length];
	var saved_model_units;
	if(units["loc"] == "mm" || units["loc"] == "cm" || units["loc"] == "m"){
		saved_model_units = "metric";
	}else{
		saved_model_units = "imperial";
	}

	var current_system = current_unit_system();

	if(saved_model_units != current_system)
	{
		if(current_system == "imperial"){
			document.getElementById("myonoffswitch").checked = true;
		}else{
			document.getElementById("myonoffswitch").checked = false;
		}
		switch_unit_system();
	}
	length_selection.value = units["loc"];
	force_selection.value = units["load"];
	change_class_units(units["loc"], units["load"], undefined, undefined);

	for(var i = 1; i < Object.keys(model_inputs).length; i++){
	    if(model_inputs[i].type.charAt(0) == "E"){continue;}
		update_summary(model_inputs[i].type, model_inputs[i].loc, model_inputs[i].load);
	}
	var beam_length = beam_length_from_table();
	for(var i = 1; i <= Object.keys(section_inputs).length; i++){
		if(section_inputs.hasOwnProperty("section_name")){
			if(section_inputs["inertia"] == ""){break;}
			var properties_arr = [["E", "modulus"], ["I", "inertia"], ["A","area"], ["Y-top", "y_top"], ["Y-bot", "y_bottom"]];
			var location = 0 + " | " + beam_length;
			var properties = '';
			for(var j=0; j<properties_arr.length; j++){
				if(section_inputs[properties_arr[j][1]] != "") {
					properties = properties + properties_arr[j][0] + "=" + section_inputs[properties_arr[j][1]] + " | ";
				}
			}
			if(properties !=""){
				properties = properties.slice(0, -3);
			}
			update_section_summary(section_inputs.section_name, location, properties);
			break;
		}else{
			update_section_summary(section_inputs[i].section, section_inputs[i].loc, section_inputs[i].properties);
		}
	}
	document.getElementById("beam-length").value = beam_length;
	canvas_update();
	ClearCharts();
	close_modal("manager-model-modal");

}

function save_model(id, save_type){
	
	var account_type = user_account_type();
	var model_count = user_model_count();
	if(account_type <= 2 && model_count >=5){upgrade_account_modal(); return;}
	var model_data = {};
	var variables = inputs_from_table();
	var units = {};
	var length_selection = document.getElementById("select-length");
	var force_selection = document.getElementById("select-force");
	units["type"] = "Units";
	units["loc"] = length_selection.options[length_selection.selectedIndex].value;
	units["load"] = force_selection.options[force_selection.selectedIndex].value;
	variables[Object.keys(variables).length + 1] = units;
	var variables_json = JSON.stringify(variables);
	var section_json = JSON.stringify(inputs_from_sections_table());
	
	var model_name_html = document.getElementById("model-name");
	model_data['model_json'] = variables_json;
	if(id=="model-name-save"){
		model_data['file_name'] = decode_html(document.getElementById(id).value);
	}else{
		model_data['file_name'] = decode_html(document.getElementById(id).innerHTML);
	}
	var folder_name = "";
	var model_path = document.getElementById("model-path").value;
	if(save_type == "saveas"){
		if(document.getElementById("folder-title")){
			folder_name = document.getElementById("folder-title").innerHTML;
		}
	}else if(model_path != ""){
		folder_name = document.getElementById("model-path").value.split('/')[0];
	}else if(document.getElementById("folder-title")){
		folder_name = document.getElementById("folder-title").innerHTML;
	}
    model_data['folder_name'] = folder_name;
    var errors_saving = check_before_saving(model_data['file_name'], model_data['folder_name']);
	if(errors_saving.length != 0){
		document.getElementById("o-beam-updates").innerHTML = errors_saving;
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		return;
	}
	model_data['section_json'] = section_json;
	var data;
	var model_data_json = JSON.stringify(model_data);
	$.ajax({
	  	type: 'post',
	  	dataType: 'text',
		async: false,
		data: {model_data_json: model_data_json},
	  	url: "retrieve-models.php?g=save",
	}).done(function(result) {
		data = JSON.parse(result);
	});
	var file_name = data.name;
	if(data.error == false){
		model_name_html.innerHTML = model_data['file_name'];
		document.getElementById("o-beam-updates").innerHTML = "Save Successful!";
		document.getElementById("model-path").value = model_data['folder_name'] + '/' + model_data['file_name'];
		$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
	}

}

function check_before_saving(file_name, folder_name){

	var errors = new Array();
	if(check_special_characters(file_name) == true){
		errors.push("File name can't contain special characters");
	}
	if(check_name_length(file_name) == true){
		errors.push("File name too long, maximum 120 characters");
	}
	if(check_name_length(folder_name) == true){
		errors.push("Folder name too long, maximum 120 characters");
	}
	if(check_file_name_exists(file_name, folder_name) == true){
		errors.push("File name already exists");
	}
	return errors;

}

function check_before_adding_folder(folder_name) {

	var errors = new Array();
	if(check_special_characters(folder_name) == true){
		errors.push("Folder name can't contain special characters");
	} 
	if(check_folder_name_exists(folder_name) == true){
		errors.push("Folder name already exists");
	}
	return errors;

}

function check_special_characters(string){
	
	var format = /[|&;$%@"<>()+,]/;
	if(format.test(string)){
	  return true;
	} else {
	  return false;
	}

}

function check_name_length(string){
	
	if(string.length > 120){
	  return true;
	} else {
	  return false;
	}

}

function check_file_name_exists(file_name, folder_name){
	
	if(document.getElementById("model-name").innerHTML != ""){return false;}
	var exists;
	$.ajax({
	  	type: 'post',
	  	dataType: 'json',
		async: false,
		data: {file_name: JSON.stringify(file_name), folder_name: JSON.stringify(folder_name)},
	  	url: "retrieve-models.php?g=check-file-name",
	}).done(function(result) {
	  	exists = result;
	});
	if(exists){
		return true;
	} else{
		return false;
	}

}

function check_folder_name_exists(folder_name){
	
	if (folder_name == ""){ return false;}
	var exists;
	$.ajax({
	  	type: 'post',
	  	dataType: 'json',
		async: false,
		data: {folder_name: JSON.stringify(folder_name)},
	  	url: "retrieve-models.php?g=check-folder-name",
	}).done(function(result) {
	  	exists = result;
	});
	if(exists){
		return true;
	} else{
		return false;
	}

}