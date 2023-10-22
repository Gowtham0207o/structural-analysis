var pdf;
var width;
var height;

function createPdf() {
	//
	if(d3.select('#shear-chart svg').empty()){return;}
	update_user_pdf_count();
	save_designer_name_to_database();
	var target = document.getElementById('spinnerContainer');
	var spinner = new Spinner().spin(target);
	setTimeout(function(){
	    pdf = new jsPDF('p', 'pt', 'letter', true);
	    width = pdf.internal.pageSize.getWidth();
	    height = pdf.internal.pageSize.getHeight() - 40;
	
		var y1 = 80, h_line = 15, m_l = 30;
		var y_offset = 5;
		var shift_y = 10;

		var canvas = $(".beam-design #c");
		var canvasWidth = canvas.width();
		var canvasHeight = canvas.height();
		var dataURL = canvas.get(0).toDataURL();
	    pdf.addImage(dataURL, 'JPEG', (width - 428.6) / 2, 105, canvasWidth/1.75, canvasHeight/1.75, 'A', 'FAST');

		addTablePdf();
		pdf.setFontSize(10);

		y1 = pdf.autoTableEndPosY() + 20;
		y1 = CheckEndofPdfPage(y1, 80, height);
		y1 = sectionPropertiesPdf(m_l, y1, h_line);	

		// 
		y1 += 2*h_line;
		var reaction_results = document.getElementById("reaction-results").innerHTML.split('<br>');
		y1 = CheckEndofPdfPage(y1, h_line*reaction_results.length, height);

		pdf.setFontType('bold');	
		pdf.text(m_l, y1, "Reactions:");
		pdf.setFontType('normal');

		console.log('reaction_results', reaction_results);
		for(var i=0; i < reaction_results.length; i++) {
			y1 += h_line;		
			pdf.text(m_l, y1, reaction_results[i]);	
		}
   
	    d3.selectAll('.area').attr('stroke-width', 1).attr('fill', '#E6E6FF').attr('stroke', '#D8D8FF');
	    d3.selectAll('g.tick line').attr('stroke', '#efefef');        
	    d3.selectAll('.axis path').attr('stroke', '#000');    
	    d3.selectAll('text').attr('fill', '#000').style('font-family', 'Open Sans');    
	    var svgHeight = 55;

	    m_l_chart = 30;

	    var pdfEnd = false;
	    y1 = addNewPdfPage();
	   	pdf.addImage(dataURL, 'JPEG', (width - 428.6) / 2, 105, canvasWidth/1.75, canvasHeight/1.75, 'A', 'FAST');
		y1 = 230;

		var chartCount = $('#chart-checkbox input[type="checkbox"]').filter(':checked').length;
		var chartArray = ["shear", "moment", "slope", "deflection", "shear-stress", "bending-stress"];
		for(var i = 0; i < chartArray.length; i++) {
			if(document.getElementById(chartArray[i] + '-chart').innerHTML == ""){
				chartArray.splice( chartArray.indexOf(chartArray[i]), 1);
				i = i-1;
			}
		}
		if(chartCount > chartArray.length){chartCount = chartArray.length;}
		for (var i = 0; i < chartArray.length; i++) {
			var chartName =chartArray[i];
			if(document.getElementById(chartArray[i] +'-checkbox').checked){
				y1 = CheckEndofPdfPage(y1, 150, height);
				if(chartCount == 1){
					//addTitleBlock(width, height, logoPath);
					pdfEnd = true;
					y1 = addChartToPdf(y1, chartArray[i], pdfEnd);
					return;
				}
				y1 = addChartToPdf(y1, chartArray[i], pdfEnd);
				chartCount = chartCount-1;
			}
		}
	});
}


function svgToPdf(svg,x, y, pageNum, endPDF) {	

	var svgWidth = +svg.attr('width');
    var svgHeight = +svg.attr('height');

	var doctype = '<?xml version="1.0" standalone="no"?>'
	+ '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	var source = (new XMLSerializer()).serializeToString(svg.node());

	// create a file blob of our SVG.
	var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
	console.log('blob', blob);

	var url = window.URL.createObjectURL(blob);

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	var k = 3;
	canvas.width = k * svgWidth;
	canvas.height = k * svgHeight;

	// Put the svg into an image tag so that the Canvas element can read it in.
	var img = new Image();
	img.onload = function(){
	    context.clearRect ( 0, 0, k*svgWidth, k*svgHeight );
	    context.drawImage(img, 0, 0, k*svgWidth, k*svgHeight);
	    var totalWidth = pdf.internal.pageSize.getWidth();
	    pdf.setPage(pageNum);	    
	    pdf.addImage(canvas.toDataURL(), 'JPEG',  (totalWidth-428.6) / 2, y, svgWidth/1.75, svgHeight/1.75, null, 'FAST');
	    if(endPDF == true) {
	    	addTitleBlock(generatePdf);
	    }
	}
	// start loading the image.
	img.src = url;
	return svgHeight/1.75;
}

function generatePdf() {
	var fileName = document.getElementById("model-name").innerHTML;
	if(fileName == ''){fileName = 'download';}
	console.log('saving');
	pdf.save(fileName + ".pdf");
	stopSpinner();	
}

function stopSpinner()
{
	document.getElementById('spinnerContainer').innerHTML='';
}

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addTitleBlock(callback){
	var logoPath = upload_logo();
	var logoImgData = new Image();
	//logoImgData.src = 'images/logo-aluma.png';
	var pageCount = pdf.internal.getNumberOfPages();
	var designerName = document.getElementById("designer-name").value;
	var dateObj = new Date();
	var month = dateObj.getMonth() + 1; //months from 1-12
	var day = dateObj.getDate();
	var year = dateObj.getFullYear();
	date = year + "/" + month + "/" + day;	
	for(var i=1; i <= pageCount; i++ ) {
		pdf.setPage(i);
		pdf.setDrawColor(0, 0, 0);
		pdf.rect(20, 20, width-40, height, 'S');
		pdf.line(20, 65, width-20, 65);
		pdf.line(380, 65, 380, 85);
		pdf.line(20, 85, width-20, 85);
		pdf.line(190, 85, 190, 105);
		pdf.line(380, 85, 380, 105);
		pdf.line(20, 105, width-20, 105);
		pdf.setFontSize(8);
		pdf.text(width - 135, 30, "Created with optimalbeam.com");
		pdf.setFontType('bold');	
		pdf.setFontSize(10);
		pdf.text(30, 80, "Model Name:");
		pdf.setFontType('normal');
		pdf.text(100, 80, $('span#model-name').text().substr(0,43));
		pdf.setFontType('bold');
		pdf.text(390, 80, "Designer: ");
		pdf.setFontType('normal');
		pdf.text(440, 80, designerName);
		pdf.setFontType('bold');	
		pdf.text(30, 100, "Units:");
		pdf.setFontType('normal');
		pdf.text(65, 100, jsUcfirst(current_unit_system()) + ' - ' + '(' + document.getElementById("select-length").value + '), (' + document.getElementById("select-force").value+')' );
		pdf.setFontType('bold');
		pdf.text(200, 100, "Date: ");
		pdf.setFontType('normal');
		pdf.text(230, 100, date);
		pdf.setFontType('bold');
		pdf.text(390, 100, "Sheet No.: ");
		pdf.setFontType('normal');
		pdf.text(445, 100, "Sheet " + i + " of " + pageCount);			
	}
	logoImgData.onload = function(){
		for(var i=1; i <= pageCount; i++ ) {
			pdf.setPage(i);	
			pdf.addImage(logoImgData, 'png', (width - (35/logoImgData.height)*logoImgData.width)/2, 25, (35/logoImgData.height)*logoImgData.width, (35/logoImgData.height)*logoImgData.height, 'B', 'FAST');	
		}	
		callback();	
	}
	logoImgData.src = logoPath;
}

function addTablePdf(){
	var columns = [];
	var rows = [];
	$('#table-variables thead th').each(function(i) {
		if(i < 3) {
			columns.push($(this).text().trim());	
		}    	
    });
    console.log('columns', columns);

    $('#table-variables tbody tr').each(function(i) {
    	var row = [];
    	$(this).find('td').each(function(j) {
    		if(j < 3) {
    			row.push($(this).html());	
    		}
    	});
    	rows.push(row);
    });
    console.log('rows', rows);

	// Only pt supported (not mm or in)		
	pdf.autoTable(columns, rows, {startY: 250, theme: 'plain', headerStyles: {lineColor: [230, 230, 230], lineWidth: 1, fontStyle: 'bold'},bodyStyles: {lineColor: [230, 230, 230], lineWidth: 1}, styles: {halign: 'center'}});
}

function sectionPropertiesPdf(m_l, y1, h_line){
	
	var sections = inputs_from_sections_table();
	pdf.setFontType('bold');	
	pdf.text(m_l, y1, "Section Properties:");
	for (var i = 1; i <= Object.keys(sections).length; i++) {
		start_location = parseFloat(sections[i].loc.split("|")[0].trim());
		end_location = parseFloat(sections[i].loc.split("|")[1].trim());
		var modulus;
		var inertia;
		var area;
		var y_top;
		var y_bot;
		var properties_arr = [["E", modulus], ["I", inertia], ["A", area], ["Y-top", y_top], ["Y-bot", y_bot]];
    	var sp = sections[i].properties.split('|');
    	for (var j = 0; j < sp.length; j++) {
        	var sub = sp[j].split('=');
	        for (var k = 0; k < properties_arr.length; k++) {
	            if(sub[0].trim() == properties_arr[k][0]){
	            	properties_arr[k][1] = sub[1].trim();
	            	break;
	            }
	        }
    	}
    	var base_unit = document.getElementsByClassName("section-length-unit ")[0].innerText;
    	var length_selection = document.getElementById("select-length");
		var current_length_unit = length_selection.options[length_selection.selectedIndex].value;

		y1 += h_line;
		pdf.setFontType('normal');
		pdf.text(m_l, y1, "Section Name: " + sections[i].section + ',   ' +
			"Modulus of Elasticity: " + properties_arr[0][1] + ' (' + document.getElementsByClassName("section-stress-unit")[0].innerText + ')');
		
		y1 += h_line;
		pdf.text(m_l, y1, "Start Location: " + start_location + ' (' + current_length_unit + ')' + ',   ' + 
			"End Location: " + end_location + ' (' + current_length_unit + ')' );

		y1 += h_line;		
		pdf.text(m_l, y1, "Moment of Inertia: " + properties_arr[1][1] + ' (' + base_unit + '^4)' + ',   ' + 
			"Area: " + properties_arr[2][1] + ' (' + base_unit + '^2)' );
		
		y1 += h_line;		
		pdf.text(m_l, y1, "Top Height: " + properties_arr[3][1] + ' (' + base_unit + ')' + ',   ' + 
			"Bottom Height: " + properties_arr[4][1] + ' (' + base_unit + ')');		

		y1 += h_line;
	}
	return y1;

}

function CheckEndofPdfPage(y1, space, height){
	if (y1 + space >= height+40)
	{
	  pdf.addPage();
	  return 120; // Restart height position
	}
	return y1;
}

function addNewPdfPage(){
	pdf.addPage();
	return 120; // Restart height position
}

function addChartToPdf(y1, diagramType, pdfEnd){
	console.log(diagramType +' Diagram');
    var shift_y = 10;
    var m_l = 30;
    var h_line = 15;
    var y_offset = 5;
	pdf.setFontType('bold');
    svgHeight = svgToPdf(d3.select('#' + diagramType + '-chart svg'), m_l_chart, y1, pdf.internal.getNumberOfPages(), pdfEnd);    

    pdf.setFontType('normal');
    y1 += svgHeight+5;

    var diagram_limits_length = document.getElementById(diagramType + "-limits").getElementsByTagName('p').length;

    $("#" + diagramType + "-limits p:even").each(function(i) {
    	pdf.setFontSize(10);
    	var locationInfo = $(this).next().html();
		pdf.text(pdf.internal.pageSize.getWidth()/2, y1, $(this).html() + " " + locationInfo, 'center');
		y1 += 15;
    });
    return y1-h_line;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function update_user_pdf_count(){
	var count;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=user-pdf-count",
	});
}

function upload_logo(){
	// #fileUpload is to a input element of the type file
	var file_upload = document.getElementById("fileUpload");
    if(file_upload){
    	var file_data = $('#fileUpload')[0].files[0]
		var form_data = new FormData();
		form_data.append('file', file_data);
		var data;
		var path;
		var errors_upload = check_logo_upload_valid();
		if(document.getElementById("fileUpload").value != "" && errors_upload.length == 0){
			$.ajax({
		        url: 'upload.php', // point to server-side PHP script 
		        dataType: 'text',  // what to expect back from the PHP script, if anything
		        cache: false,
		        async: false,
		        contentType: false,
		        processData: false,
		        data: form_data,                         
		        type: 'post',
		        success: function(result){
		        	data = JSON.parse(result);
	        	},
	        	error: function() {
			        alert('Unknown error occurred');
			    }
	        });
	        if(!data.error){
	        	path = data.path;
	        }else{
	        	path ='images/OptimalLogo.png';
	        	document.getElementById("o-beam-updates").innerHTML = data.error_msg;
	        	$('#o-beam-updates').fadeIn().delay(3000).fadeOut();
	        }
		}else{
			path ='images/OptimalLogo.png';
			document.getElementById("o-beam-updates").innerHTML = errors_upload;
	        $('#o-beam-updates').fadeIn().delay(3000).fadeOut();
		}    
    }else{
    	var user_id;
    	$.ajax({
		  type: "GET",
		  async: false,
		  url: "server-calls.php?g=user-id",
		}).done(function(result) {
		  user_id = JSON.parse(result);
		});
		path = "uploads/" + user_id	+ "/" + document.getElementById('logo-name').value;
    }
    return path;
}

function check_logo_upload_valid(){
	var file_upload = document.getElementById("fileUpload");
	var errors_upload = new Array();
	if(document.getElementById("fileUpload").value == ""){
		return errors_upload;
	}else{
		if(file_upload.files[0].size > 1*1024*1024){
			errors_upload.push('Logo file size exceeds 1MB limit');
		}
		if(!hasExtension('fileUpload', ['.jpg', '.jpeg', '.gif', '.png'])){
			errors_upload.push('Logo file type not supported');
		}
	}
	return errors_upload;
}

function remove_user_logo(){
	var user_options_div = document.getElementById("logo-options");
	user_options_div.innerHTML = "<label class='control-label col-sm-3'>Logo:<span class='glyphicon glyphicon-question-sign' data-toggle='tooltip' title='1MB size limit. Formated supported (.png,.jpg,.jpeg,.gif)'></span></label>"
    							+ "<div class='col-sm-4'>"
        						+ "<input id='fileUpload' name='fileUpload' type='file' accept='.png,.jpg,.jpeg,.gif'/>"
    							+"</div>";
	$.ajax({
		type: "GET",
		async: false,
		url: "server-calls.php?g=remove-user-logo",
	});
	return false;
}

function open_pdf_modal(){

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
	open_modal("pdf-export-modal");
	var designer_name;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=retrieve-designer-name",
	}).done(function(result) {
	  designer_name = JSON.parse(result);
	});
	document.getElementById("designer-name").value = designer_name;
	var logo_name;
	$.ajax({
	  type: "GET",
	  async: false,
	  url: "server-calls.php?g=logo-name",
	}).done(function(result) {
	  logo_name = JSON.parse(result);
	});
	var user_options_div = document.getElementById("logo-options");
	user_options_div.innerHTML = "";
	if(logo_name == "" || logo_name == null){
		user_options_div.innerHTML = "<label class='control-label col-sm-3'>Logo:<span class='glyphicon glyphicon-question-sign' data-toggle='tooltip' title='1MB size limit. Formats supported (.png,.jpg,.jpeg,.gif)'></span></label>"
    							+ "<div class='col-sm-4'>"
        						+ "<input id='fileUpload' name='fileUpload' type='file' accept='.png,.jpg,.jpeg,.gif'/>"
    							+"</div>";
	}else{
		user_options_div.innerHTML = "<label class='control-label col-sm-3'>Logo:<span class='glyphicon glyphicon-question-sign' data-toggle='tooltip' title='1MB size limit. Formats supported (.png,.jpg,.jpeg,.gif)'></span></label>"
                            		+"<div class='col-sm-4'>"
                                	+"<input id='logo-name' type='text' class='form-control' value='" + logo_name + "' disabled>"
                            		+"</div>"
                            		+"<a onclick='remove_user_logo();'' href='#'><i class='fa fa-trash'></i></a>";	
	}
}

function save_designer_name_to_database(){

	var designer_name = document.getElementById("designer-name").value;
	var designer_name_json = JSON.stringify(designer_name);
	$.ajax({
	  	type: 'post',
	  	dataType: 'json',
		async: false,
		data: {designer_name_json: designer_name_json},
	  	url: "server-calls.php?g=save-designer-name",
	});

}

function hasExtension(inputID, exts) {
    var fileName = document.getElementById(inputID).value;
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$', "i")).test(fileName);
}