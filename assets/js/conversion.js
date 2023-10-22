jQuery(function($) {'use strict';

	$("#reset_stress").click(function() {
	   	reset_inputs('stress_conversion');
	});

	$("#reset_moment").click(function() {
	   	reset_inputs('moment_conversion');
	});

	$("#reset_force").click(function() {
	   	reset_inputs('force_conversion');
	});

	$("#reset_weightlength").click(function() {
	   	reset_inputs('weightlength_conversion');
	});

	$("#reset_weight").click(function() {
	   	reset_inputs('weight_conversion');
	});

	$("#reset_length").click(function() {
	   	reset_inputs('length_conversion');
	});

	$("#reset_area").click(function() {
	   	reset_inputs('area_conversion');
	});

	$("#reset_volume").click(function() {
	   	reset_inputs('volume_conversion');
	});

	$("#reset_density").click(function() {
	   	reset_inputs('density_conversion');
	});

	function reset_inputs(id){
    $('#' + id).find(':input').val('');
	};

});

function stress_conversion(source, value){

	var kpa = document.getElementById('stress_kpa');
	var mpa = document.getElementById('stress_mpa');
	var gpa = document.getElementById('stress_gpa');
	var psf = document.getElementById('stress_psf');
	var psi = document.getElementById('stress_psi');

	if(source == "stress_kpa"){
		mpa.value = value/1000;
		gpa.value = value/1000000;
		psf.value = value*20.88543427303457;
		psi.value = value*0.145037738007;
	}
	if(source == "stress_mpa"){
		kpa.value = value*1000;
		gpa.value = value/1000;
		psf.value = value*20885.43427303457;
		psi.value = value*145.037738007;
	}
	if(source == "stress_gpa"){
		kpa.value = value*1000000;
		mpa.value = value*1000;
		psf.value = value*20885434.27303457;
		psi.value = value*145037.738007;
	}
	if(source == "stress_gpa"){

	}
	if(source == "stress_psf"){
		kpa.value = value*0.0478802588889;
		mpa.value = value*0.0000478802588889;
		gpa.value = value*0.0000000478802588889;
		psi.value = value/144;
	}
	if(source == "stress_psi"){
		kpa.value = value*6.89475728001037;
		mpa.value = value*0.00689475728001037;
		gpa.value = value*0.00000689475728001037;
		psf.value = value*144;
	}
};

function moment_conversion(source, value){

	var knm = document.getElementById('moment_knm');
	var lbin = document.getElementById('moment_lbin');
	var lbft = document.getElementById('moment_lbft');

	if(source == "moment_knm"){
		lbin.value = value*8850.74576738;
		lbft.value = value*737.562149277;
	}
	if(source == "moment_lbin"){
		knm.value = value*0.000112984829333;
		lbft.value = value/12;
	}
	if(source == "moment_lbft"){
		knm.value = value*0.001355817948331888;
		lbin.value = value*12;
	}
};

function force_conversion(source, value){

	var kn = document.getElementById('force_kn');
	var kip = document.getElementById('force_kip');
	var lb = document.getElementById('force_lb');

	if(source == "force_kn"){
		kip.value = value*0.224808943871;
		lb.value = value*224.80894387096183;
	}
	if(source == "force_kip"){
		kn.value = value*4.4482216;
		lb.value = value*1000;
	}
	if(source == "force_lb"){
		kn.value = (value*0.0044482216).toFixed(6);
		kip.value = (value/1000).toFixed(6);
	}
};

function weightlength_conversion(source, value){

	var kgm = document.getElementById('weightlength_kgm');
	var lbft = document.getElementById('weightlength_lbft');
	var lbin = document.getElementById('weightlength_lbin');

	if(source == "weightlength_kgm"){
		lbft.value = value*0.671969;
		lbin.value = value*0.055997415;
	}
	if(source == "weightlength_lbin"){
		kgm.value = value*17.857967;
		lbft.value = value*12;
	}
	if(source == "weightlength_lbft"){
		kgm.value = value*1.488164;
		lbin.value = value/12;
	}
};

function weight_conversion(source, value){

	var tonne = document.getElementById('weight_tonne');
	var lton = document.getElementById('weight_longton');
	var ston = document.getElementById('weight_shortton');
	var kg = document.getElementById('weight_kg');
	var lb = document.getElementById('weight_lb');
	var grams = document.getElementById('weight_grams');


	if(source == "weight_tonne"){
		lton.value = value*0.984206527611;
		ston.value = value*1.10231131092;
		kg.value = value*1000;
		grams.value = value*1000000;
		lb.value = value*2204.62262185;
	}
	if(source == "weight_longton"){
		tonne.value = value*1.0160469088;
		ston.value = value*1.12;
		kg.value = value*1016.0469088;
		grams.value = value*1016046.9088;
		lb.value = value*2240;
	}
	if(source == "weight_shortton"){
		tonne.value = value*0.90718474;
		lton.value = value*0.8928571428571428;
		kg.value= value*907.18474;
		grams.value = value*907184.74;
		lb.value = value*2000;
	}
	if(source == "weight_kg"){
		tonne.value = value/1000;
		lton.value = value*0.000984206527611;
		ston.value = value*0.00110231131092;
		grams.value = value*1000;
		lb.value = value*2.20462262185;
	}
	if(source == "weight_lb"){
		tonne.value = value*0.00045359237;
		lton.value = value*0.0004464285714285714;
		ston.value = value*0.0005;
		grams.value = value*453.59237;
		kg.value = value*0.45359237;
	}
	if(source == "weight_grams"){
		tonne.value = value/1000000;
		lton.value = value/1016046.9088;;
		ston.value = value/907184.74;
		lb.value = value/453.59237;
		kg.value = value/1000;
	}
};

function length_conversion(source, value){
	var mm = document.getElementById('length_mm');
	var cm = document.getElementById('length_cm');
	var m = document.getElementById('length_m');
	var inch = document.getElementById('length_in');
	var ft = document.getElementById('length_ft');

	if(source == "length_mm"){
		cm.value = value*0.1;
		m.value = value*0.001;
		inch.value = value*0.03937007874015748;
		ft.value = value*0.0032808398950131233;
	}
	if(source == "length_cm"){
		mm.value = value*10;
		m.value = value/100;
		inch.value = value*0.39370078740157477;
		ft.value = value*0.03280839895013123;
	}
	if(source == "length_m"){
		mm.value = value*1000;
		cm.value = value*100;
		inch.value = value*39.37007874015748	;
		ft.value = value*3.280839895013123;
	}
	if(source == "length_in"){
		mm.value = value*25.4;
		cm.value = value*2.54;
		m.value = value*0.0254;
		ft.value = value/12;
	}
	if(source == "length_ft"){
		mm.value = value*304.8;
		cm.value = value*30.48;
		m.value = value*0.3048;
		inch.value = value*12;
	}
};

function area_conversion(source, value){
	var mm = document.getElementById('area_mm');
	var cm = document.getElementById('area_cm');
	var m = document.getElementById('area_m');
	var inch = document.getElementById('area_in');
	var ft = document.getElementById('area_ft');

	if(source == "area_mm"){
		cm.value = value*Math.pow(0.1,2);
		m.value = value*Math.pow(0.001,2);
		inch.value = value*Math.pow(0.03937007874015748,2);
		ft.value = value*Math.pow(0.0032808398950131233,2);
	}
	if(source == "area_cm"){
		mm.value = value*Math.pow(10,2);
		m.value = value/Math.pow(100,2);
		inch.value = value*Math.pow(0.39370078740157477,2);
		ft.value = value*Math.pow(0.03280839895013123,2);
	}
	if(source == "area_m"){
		mm.value = value*Math.pow(1000,2);
		cm.value = value*Math.pow(100,2);
		inch.value = value*Math.pow(39.37007874015748,2);
		ft.value = value*Math.pow(3.280839895013123,2);
	}
	if(source == "area_in"){
		mm.value = value*Math.pow(25.4,2);
		cm.value = value*Math.pow(2.54,2);
		m.value = value*Math.pow(0.0254,2);
		ft.value = value/Math.pow(12,2);
	}
	if(source == "area_ft"){
		mm.value = value*Math.pow(304.8,2);
		cm.value = value*Math.pow(30.48,2);
		m.value = value*Math.pow(0.3048,2);
		inch.value = value*Math.pow(12,2);
	}
};

function volume_conversion(source, value){
	var mm = document.getElementById('volume_mm');
	var cm = document.getElementById('volume_cm');
	var m = document.getElementById('volume_m');
	var l = document.getElementById('volume_l');
	var ml = document.getElementById('volume_ml');
	var inch = document.getElementById('volume_in');
	var ft = document.getElementById('volume_ft');
	var oz = document.getElementById('volume_oz');

	if(source == "volume_mm"){
		cm.value = value*Math.pow(0.1,3);
		m.value = value*Math.pow(0.001,3);
		l.value = value*Math.pow(10,-6);
		ml.value = value*Math.pow(10,-3);
		inch.value = value*Math.pow(0.03937007874015748,3);
		ft.value = value*Math.pow(0.0032808398950131233,3);
		oz.value = value*0.000033814023;
	}
	if(source == "volume_cm"){
		mm.value = value*Math.pow(10,3);
		m.value = value/Math.pow(100,3);
		l.value = value*0.001;
		ml.value = value*1;
		inch.value = value*Math.pow(0.39370078740157477,3);
		ft.value = value*Math.pow(0.03280839895013123,3);
		oz.value = value*0.03381402;
	}
	if(source == "volume_m"){
		mm.value = value*Math.pow(1000,3);
		cm.value = value*Math.pow(100,3);
		l.value = value*1000;
		ml.value = value*1000000;
		inch.value = value*Math.pow(39.37007874015748,3);
		ft.value = value*Math.pow(3.280839895013123,3);
		oz.value = value*33814.0227;
	}
	if(source == "volume_l"){
		mm.value = value/Math.pow(10,-6);
		cm.value = value/0.001;
		m.value = value/1000;
		ml.value = value*1000;
		inch.value = value/0.016387064069264;
		ft.value = value/28.316846592;
		oz.value = value*33.814022558919;
	}
	if(source == "volume_ml"){
		mm.value = value/Math.pow(10,-3);;
		cm.value = value/1;
		m.value = value/1000000;
		l.value = value/1000;
		inch.value = value/16.387064;
		ft.value = value/28316.846592000;
		oz.value = value*0.033814022558919;
	}
	if(source == "volume_in"){
		mm.value = value*Math.pow(25.4,3);
		cm.value = value*Math.pow(2.54,3);
		m.value = value*Math.pow(0.0254,3);
		l.value = value*0.016387064069264;
		ml.value = value*16.387064;
		ft.value = value/Math.pow(12,3);
		oz.value = value*0.554112554;
	}
	if(source == "volume_ft"){
		mm.value = value*Math.pow(304.8,3);
		cm.value = value*Math.pow(30.48,3);
		m.value = value*Math.pow(0.3048,3);
		l.value = value*28.316846592;
		ml.value = value*28316.846592000;
		inch.value = value*Math.pow(12,3);
		oz.value = value*957.506493506;
	}
	if(source == "volume_oz"){
		mm.value = value/0.000033814023;
		cm.value = value/0.03381402;
		m.value = value/33814.0227;
		l.value = value/33.814022558919;
		ml.value = value/0.033814022558919;
		inch.value =value/0.554112554;
		ft.value = value/957.506493506;
	}
};

function density_conversion(source, value){

	var kgm = document.getElementById('density_kgm');
	var lbft = document.getElementById('density_lbft');
	var lbin = document.getElementById('density_lbin');

	if(source == "density_kgm"){
		lbft.value = value*0.06242796;
		lbin.value = value*0.000036127292;
	}
	if(source == "density_lbin"){
		kgm.value = value*27679.904710200;
		lbft.value = value*Math.pow(12,3);
	}
	if(source == "density_lbft"){
		kgm.value = value*16.01846337;
		lbin.value = value/Math.pow(12,3);
	}
};

function conversion_control(units){
	for (var i = 0; i < units.length; i++) {
		if(units[i][1] !== ""){
			control = [[units[i][0], units[i][1]]];
			return control;
		}
	}
};

