﻿// *
// Metromobilité is the mobile application of Grenoble Alpes Métropole <http://www.metromobilite.fr/>.
// It provides all the information and services for your travels in Grenoble agglomeration.
// Available for Android, iOs, Windows Phone, it's been developed on Cordova https://cordova.apache.org/.

// Copyright (C) 2013
// Contributors:
//	NB/VT - sully-group - www.sully-group.fr - initialisation and implementation

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// *

//--------------------------------------//
// globals
//--------------------------------------//
var ZONE_AGGLO_HG_LONGITUDE=5.529721854429761;  //Longitude, lambert 2:2000000 (Y)
var ZONE_AGGLO_HG_LATITUDE=45.40946386046248;   //Latitude, lambert 2:884000 (X)
var ZONE_AGGLO_BD_LONGITUDE=5.9650561082924405; //Longitude, lambert 2:2052000
var ZONE_AGGLO_BD_LATITUDE=44.95462074268264;   //Latitude, lambert 2:852000

var typesLgn = {
	TRAM:[],
	CHRONO:[],
	PROXIMO:[],
	FLEXO:[],
	NAVETTE:[],
	C38:[],
	SNC:[],
	GSV:[],
	TPV:[],
	FUN:[],
	BUL:[],
	Urbaines:[],
	Interurbaines:[],
	Structurantes:[],
	Secondaires:[],
	Citadines:[],
	TAD:[],
	SCOL:[]
}

//--------------------------------------//
// url
//--------------------------------------//
var urlParams = extractUrlParams('&');

/*if(!urlParams.debug) 
	urlParams.debug=false;
else 
	urlParams.debug =  urlParams.debug == 'true';*/

urlParams.debug = !!urlParams.debug;

if (!urlParams.iFrame) urlParams.iFrame=false;
if (!urlParams.toggle) urlParams.toggle=false;

if(!urlParams.forceOtp2) urlParams.forceOtp2=false; //Force l'utilisation d'Otp2 (v0.16 et +) pour le calcul d'itinéraire et non otp (v0.9)

if(!urlParams.otp) urlParams.otp='prod';
if(!urlParams.otp2) urlParams.otp2='prod';
if(!urlParams.routerId) urlParams.routerId='prod';
if(!urlParams.routerOtp2) urlParams.routerOtp2='default';
if(!urlParams.css) urlParams.css='mm';
if(!urlParams.saisie) urlParams.saisie='prod';

if (!urlParams.lonlatDep) urlParams.lonlatDep="0,0";
if (!urlParams.lonlatArr) urlParams.lonlatArr="0,0";
if (urlParams.arr) urlParams.arr = decodeURI(urlParams.arr);
if (urlParams.dep) urlParams.dep = decodeURI(urlParams.dep);

if (!urlParams.codeArr) urlParams.codeArr="";

if (!urlParams.centerArr) urlParams.centerArr=false;
if (!urlParams.centerDep) urlParams.centerDep=false;

if (!urlParams.epci) urlParams.epci="";

if (!urlParams.date) {urlParams.date = new Date();}
else {
	var tabDate = urlParams.date.split('/'); //format 'DD/MM/YYYY'
	urlParams.date = new Date(tabDate[2]+'-'+tabDate[1]+'-'+tabDate[0]);
}
if (!urlParams.heure) {
	urlParams.date.setHours(new Date().getHours(),new Date().getMinutes());
	urlParams.heure = urlParams.date;
} else {
	var tabHeure = urlParams.heure.split(':'); //format 'HH:mm'
	urlParams.date.setHours(tabHeure[0],tabHeure[1]);
	urlParams.heure = urlParams.date;
}
if (!urlParams.ap_av) {urlParams.ap_av = 'D';}

if (!urlParams.dat) urlParams.dat=false;
if (!urlParams.depositaires) urlParams.depositaires=false;
if (!urlParams.covoiturage) urlParams.covoiturage=false;
if (!urlParams.parkings) urlParams.parkings=false;
if (!urlParams.parcrelais) urlParams.parcrelais=false;
if (!urlParams.pmv) urlParams.pmv=false;
if (!urlParams.cam) urlParams.cam=false;
if (!urlParams.velo) urlParams.velo=false;
if (!urlParams.tc) urlParams.tc=false;
if (!urlParams.voiture) urlParams.voiture=false;
if (!urlParams.citelib) urlParams.citelib=false;

if (!urlParams.recharge) urlParams.recharge=false;
 
if (!urlParams.agenceM) urlParams.agenceM=false;
if (!urlParams.MVA) urlParams.MVA=false;
if (!urlParams.MVC) urlParams.MVC=false;
if (!urlParams.pointService) urlParams.pointService=false;

if (!urlParams.fond) urlParams.fond='default';

if (typeof(urlParams.trafic) === "undefined") 
	urlParams.trafic=true;
else
	urlParams.trafic = (urlParams.trafic == 'true');

if (!urlParams.site) urlParams.site="metromobilite";

//Parametres ECN Tag
if (!urlParams.token) urlParams.token=""; //Id utilisateur
if (!urlParams.favori) urlParams.favori="";//si !="" indique un n° d'iti favori

//Horaires
if (!urlParams.horairestempsreel) urlParams.horairestempsreel=false;

urlParams.sansPerturbation=(urlParams.sansPerturbation=='1');//sansPerturbation

if (!urlParams.lang) urlParams.lang='fr';

//modes ...
urlParams.pmr=(urlParams.pmr=='1');
var requetes=[];
var resultats= {};
var keyAAfficher = null;
var attente =false; //par defaut pas de fct d'attente
var timeout;
var attente=false;
var dataLignesTC = null;
var dataParking = null;
var dataFavoris={"ligne":[],"arret":[]};
var dataEvtsTC={};

if (window.location.hostname == 'preprod.metromobilite.fr') {
	console.log('preprod.metromobilite.fr');
	urlParams.saisie = 'test';
	urlParams.otp2 = 'test';
	urlParams.forceOtp2 = true;	
}

var url = {
	otpChoisi:urlParams.otp,
	otp2Choisi:urlParams.otp2,
	otp2Router:urlParams.routerOtp2,
	routerChoisi:urlParams.routerId,
	saisieChoisie:urlParams.saisie,	
	otp:function(){
		
		if (urlParams.forceOtp2) return url.otp2();
		
		switch(url.otpChoisi) {
			case 'prod':
				return url.hostnameData + url.urlOTP;
				break;
			case 'test':
				return url.hostnameOTPTest+url.portOTPTest+url.urlOTP;
				break;
			case 'local':
				return url.hostnameLocal+url.portOTPTest+url.urlOTP;
				break;
			default:
			return '';
		}
	},
	otp2:function(){
		switch(url.otp2Choisi) {
			case 'prod':
				return url.hostnameData+url.portProd+url.urlOTP2;
				break;
			case 'test':
				return url.ws()+url.urlOTP2;
				break;
			case 'local':
				return url.hostnameLocal+url.portWSTest+url.urlOTP2;
				break;
			default:
			return '';
		}
	},
	ws:function(){
		switch(url.saisieChoisie) {
			case 'prod':
				return url.hostnameData;				
				break;				
			case 'test':
				return url.hostnameDataTest;
				break;			
			case 'local':
				return url.hostnameLocal+url.portWSTest;
				break;
			default:
			return '';
		}
	},
	portProd:'',
	portTest: ':8087',
	portOTPTest:':8080',
	portWSTest:':3000',
	hostnameData:'https://data.metromobilite.fr',
	hostnameDataTest:'https://datatest.metromobilite.fr',
	hostnameOTPTest:'http://83.145.98.140',
	hostnameProd:'https://www.metromobilite.fr',
	hostnameLocal:'http://127.0.0.1',
	urlOTP:'/otp-rest-servlet/ws',
	urlOTP2:'/api/routers/'+urlParams.routerOtp2,
	urlPiwik: 'https://www.metromobilite.fr/stats/piwik.php',
	urlAddok: 'https://api-adresse.data.gouv.fr',
	stat:"/data/Carto/Statique/",
	dyn:"/data/Carto/Dynamique/",
	descOpenData:"pages/openData/descOpenData/",
	fic:{
		cov:"Covoiturage.kml",	//utilisé par le site
		velo:"velo.geojson",	//utilisé par les appli mobile
		dAlerte:"dynAlerte.json",	//utilisé par les appli mobile
		dAlerteTest:"dynAlerteTest.json",	//utilisé par les appli mobile
		horTAG:"SEM-GTFS.zip",	//utilisé par le site
		polygoneAtmo:"polygoneAtmo.geojson",	//utilisé par les appli mobile
		//pour pages opendata seulement
		pkg:"Parkings.geojson",
		lgn:"LignesLight.geojson",
		arr:"ArretsLight.geojson",
		citelib:"citelib.geojson",
		Depositaires:"Depositaires.geojson",
		AgencesMobilite:"AgencesMobilite.geojson",
		PointsServices:"PointsServices.geojson",
		Dat:"Dat.geojson"
	},
	json:function(f) {
		if(f.substr(0,1)=='d') {
			return url.dyn+url.fic[f]+'?key=' + Math.random();
		} else {
			return url.stat+url.fic[f]+'?key=' + moment().format('YYYY-MM-DD');
		}
	}
};
/*if (!urlParams.debug) {
	styleDebug = "<style type='text/css'> .visible-debug{ display:none!important;} </style>";
}*/
if (urlParams.debug) {
	//--------------------------------------//
	// debug : Affiche les données les dimentions des écran si debug=true
	//--------------------------------------//
	var donneesCss = "@media (min-width: 1200px) {#dimension-1200 {color:red;display:block;} #dimension-992-1200, #dimension768-991, #dimension-481-767, #dimension-480{display:none;}}";
	donneesCss += "@media (min-width: 992px) and (max-width: 1200px) {#dimension-992-1200{color:red;display:block;} #dimension-1200, #dimension768-991, #dimension-481-767, #dimension-480{display:none;}}";
	donneesCss += "@media (min-width: 768px) and (max-width: 991px) {#dimension768-991{color:red;display:block;}#dimension-1200, #dimension-992-1200, #dimension-481-767, #dimension-480{display:none;}}";
	donneesCss += "@media (min-width: 481px) and (max-width: 767px) {#dimension-481-767{color:red;display:block;} #dimension-1200, #dimension-992-1200, #dimension768-991, #dimension-480{display:none;}}";
	donneesCss += "@media (max-width: 480px) {#dimension-480{color:red;display:block;}#dimension-1200, #dimension-992-1200, #dimension768-991, #dimension-481-767{display:none;}}";
	donneesCss += "#taille {position:absolute; z-index:9999;right:0px;top:0px;}";
	var styleDebug;
	styleDebug = "<style type='text/css'>" +  donneesCss + "</style>";
	var divDebug = '<div class="visible-debug" id="taille"><span id="dimension-1200">">1200px (lg)"</span><span id="dimension-992-1200">"992px-1200px (md)"</span><span id="dimension768-991">"768px-991px (sm)"</span><span id="dimension-481-767">"481px-767px (xs)"</span><span id="dimension-480">"<480px (xs)"</span></div>';
	$(divDebug).appendTo("body");
	$(styleDebug).appendTo("head");
}
//--------------------------------------//
// prototypes
//--------------------------------------//
var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a;});};
String.prototype.latinize=String.prototype.latinise;
String.prototype.capitalize = function() {return this.replace(/\S+/g, function(str) { return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); });};
String.prototype.isLatin=function() {return this==this.latinise();};
String.prototype.trim = function(){return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""));};
//String.prototype.startsWith = function(str) {return (this.match("^"+str)==str);};
String.prototype.encode = function() { return unescape(encodeURIComponent(this));};
String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};
//0 : non chargé
//1 : chargé
//2 : géré
var chargementsOk = {
	lignes:0,
	favoris:0
};
ecouteChargements();
//chargements des favoris 
if (urlParams.token!="") chargeFavoris();

function ecouteChargements() {
	$( document ).on( "evtFavorisCharges", {}, function( event, data ) {
		if(chargementsOk.favoris==0) chargementsOk.favoris=1;	 
		$( document ).trigger( "evtChargements",chargementsOk);
	});
	
	$( document ).on("evtLignesChargees", {}, function( event, data ) {
		chargementsOk.lignes=1;	 
		$(document ).trigger( "evtChargements",chargementsOk);
	});
	
}
//--------------------------------------//
// chargeParkings
// Charge les parkings
//--------------------------------------//
function chargeParkings() {
	if (dataParking) return;
	//http://data.metromobilite.fr/api/findType/json?types=PKG,PAR
	var searchUrl = url.ws() + '/api/findType/json?types=PKG,PAR'
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( "evtParkingsCharges");
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			dataParking = json;
			$( document ).trigger( "evtParkingsCharges", dataParking );
        }		
    });
}
//--------------------------------------//
// updatePAR
// Mise jour des p+r
//--------------------------------------//
function updatePAR(event) {
	//http://data.metromobilite.fr/api/dyn/PAR/json
	var searchUrl = url.ws() + '/api/dyn/PAR/json'
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( event);
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			$( document ).trigger( event, json );
		}
	});
}
//--------------------------------------//
// updatePKG
// Mise jour des parkings
//--------------------------------------//
function updatePKG(event) {
	//http://data.metromobilite.fr/api/dyn/PKG/json
	var searchUrl = url.ws() + '/api/dyn/PKG/json'
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger(event);
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			$( document ).trigger( event, json );
		}
	});
}
//--------------------------------------//
//requeteChercheIti
//--------------------------------------//
function requeteChercheIti(query,process,options) {
	var types = '';
	var t=[];
	if(options.arrets||options.lieux||options.rues||options.axes) types+='&types=';
	if(options.arrets) t.push('arret');
	if(options.lieux)  t.push('lieux');
	if(options.rues)  t.push('rues');
	if(options.axes)  t.push('axes');
	types+=t.join(',');
	
	var searchUrl = url.ws()+ '/api/find/json?query=' + encodeURIComponent(query) + types + /*(options.grandRectangle?'&rect=2':'') + */ (urlParams.epci!=""?'&epci='+urlParams.epci:'');
	
	//options.ordre
	
	$.ajax({
		async : true,
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
		},
		success : function (data,processToCall) {
			var resultat=[];
			var best = {res:{},dist:0,idx:-1};
			$.each(data.features, function (i) {
				//console.log(this.properties.LIBELLE+' '+this.properties.dist);
				var res;
				//Cas des Rue
				if (this.properties.type=='rue') {
					res = {
							label : this.properties.LIBELLE,
							value : this.properties.LIBELLE.replace(',',''),
							lon : this.geometry.coordinates[0],
							lat : this.geometry.coordinates[1],
							commune : this.properties.COMMUNE,
							sorties : "",
							noms : "",
							type : this.properties.type.toUpperCase(),
							dist : this.properties.dist,
							categorie : lang.categorieRue
						};
					var premierMot = parseInt(query);
					if(!isNaN(premierMot) && this.properties.LIBELLE.indexOf(premierMot) == -1) {
						//res.lon=0;
						//res.lat=0;
						res.bRoadNumber=true;
						res.value = premierMot+' '+res.value;
						res.label = premierMot+' '+res.label;
					}
				} else if (this.properties.type=='lieux') {
					res = {
							label : this.properties.LIBELLE,
							value : this.properties.LIBELLE.replace(',',''),
							lon : this.geometry.coordinates[0],
							lat : this.geometry.coordinates[1],
							commune : this.properties.COMMUNE,
							sorties : "",
							noms : "",
							type : "LIEU",//this.properties.type.toUpperCase(),
							dist : this.properties.dist,
							categorie : lang.categorieLieu
						};
				} else if (this.properties.type=='arret') {
					//des arrets
					if (this.properties.ARR_VISIBLE == 1 || typeof(this.properties.ARR_VISIBLE)=='undefined') {
						//var label = (this.properties.COMMUNE!=''?this.properties.LIBELLE.replace(this.properties.COMMUNE + ", ","").replace(this.properties.COMMUNE + " ",""):this.properties.LIBELLE);
						var label = this.properties.LIBELLE;
						res = {
							label : label,
							value : label,
							lon : this.geometry.coordinates[0],
							lat : this.geometry.coordinates[1],
							commune : this.properties.COMMUNE,
							//lignes: this.properties.LIGNESARRET, supprimé car LIGNESARRET supprimé et, a priori pas utilisé dans les recherches.
							type : this.properties.type.toUpperCase(),
							categorie : lang.categorieArret,
							dist : this.properties.dist,
							code : this.properties.CODE
						};
					}	
				} else if (this.properties.type=='axe') {
					res = {
						value : this.properties.axe + ' DIRECTION ' + this.properties.direction,
						label : this.properties.axe + ' DIRECTION ' + this.properties.direction,
						lon : -1,
						lat : -1,
						commune : '',
						sorties : this.properties.sorties,//On a besoin de connaitre tous les autres echangeurs pour determiner plus tard la sortie.
						noms : this.properties.noms,
						type : this.properties.type.toUpperCase(),
						dist : this.properties.dist,
						categorie : lang.categorieAxe //1:arret, 2:lieu, 3:rue, 4:axe
					};
				}
				resultat.push(res);
				if (parseFloat(this.properties.dist)>parseFloat(best.dist)) {
					best.dist = this.properties.dist;
					best.res = res;
					best.idx = i;
				}
			});
			var seuil = parseFloat(best.dist)*0.5;
			resultat = resultat.filter(function(r){
				return(parseFloat(r.dist)>=seuil);
			});
			if (data.features.length>0)
			{
				resultat.splice(best.idx,1);
				resultat.splice(0,0,best.res);

			}
			if (resultat.length == 0)
				resultat.push({
					label : lang.alert[2],
					value : '',
					commune:'',
					type:''
				});
			else {
				resultat.push({
					label : lang.modifChoix,
					value : '',
					commune:'',
					type:''
				});
			}
			process(resultat);
		}
	});
}

//--------------------------------------//
//ajouteAutocomplete
//--------------------------------------//
function ajouteAutocomplete(champ,opt) {
//options
var options =opt;
if (!options) {
	options = {};
}
typeof(options.arrets)=='undefined'?options.arrets=true:'';
typeof(options.rues)=='undefined'?options.rues=true:'';
typeof(options.lieux)=='undefined'?options.lieux=true:'';
typeof(options.axes)=='undefined'?options.axes=false:'';
!options.ordre?options.ordre='ARL':'';
!options.grandRectangle?options.grandRectangle=false:'';
(!options.fnSaisieReussie?function(){}:'');
(!options.fnSaisieRatee?function(){}:'');

	if ($(champ) && $(champ).typeahead) {
		$(champ).typeahead({
			source:function(query, process) {
				if (timeout) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(function() {
					var opt = jQuery.extend(true, {}, options);
					if(query.length<4) {
						opt.rues=false;
						opt.lieux=false;
						opt.ordre='A';
					}
					return requeteChercheIti(query,process,opt);
				}, 500);

			},
			matcher: function (item) {return true;}, //serveur
			sorter: function(items){

				var meilleurItem = $.extend( true, {}, items[0] );
				if (items.length>2) {
					//items.splice(0, 1);
					items = items.sort(function(a,b){
						if (a.label==lang.modifChoix) return 1;
						if (b.label==lang.modifChoix) return -1;
						if(a.commune>b.commune) return 1;
						if(a.commune<b.commune) return -1;
						if(a.commune==b.commune && a.label > b.label) return 1;
						if(a.commune==b.commune && a.label <= b.label) return -1;
						return ;
					});
				}
				meilleurItem.best=true;
				meilleurItem.displayCommune=true;
				if (items.length>2 && (items[0].label!=meilleurItem.label || items[0].commune!=meilleurItem.commune)) {
					items.splice(0, 0, meilleurItem);
				} else if (items.length>2 && items[0].label==meilleurItem.label && items[0].commune==meilleurItem.commune) {
					items[0].best=true;
				} /*else if (items.length==2) {
					items[0].displayCommune=true;
				}*/
				items[0].displayCommune=true;
				for (var i = 1; i < items.length-1 ; i++) { //i=1 pour ignorer la premiere ligne vide avant modifier votre choix
					if (items[i] && items[i-1].commune!=items[i].commune) {
						items[i].displayCommune=true;
					}
				}
				return items;
			},
			highlighter: function (item) {
				var regex = new RegExp( '(' + this.query + ')', 'gi' );
				if (item)
					return (item.displayCommune?'<span class="categorie">'+item.commune+'</span>':'')+'<span '+(item.best?'class="bestResult"':'')+'data-commune="'+item.commune+'" data-type="'+item.type+'" >'+item.label.replace( regex, "<strong>$1</strong>" )+'</span>';
				else 
					return('');
			},
			updater:function(item){
				//if (item.lat==0 && item.lon == 0) {
				if (item.bRoadNumber) {
					chercheAddok(item,function(item){options.fnSaisieReussie(item,champ);});
					return item.label;
				} 
				if (item.value!='') {
					options.fnSaisieReussie(item,champ);
					$(champ).blur();
					return item.label;
				} else
					options.fnSaisieRatee(item,champ);
				return this.query;
			},
			items:'all',
			minLength:3,
			autoSelect:true
		});
	}
}

//--------------------------------------//
//chercheAddok
//--------------------------------------//
function chercheAddok(item,fct) {
	
	try {
		if (item.value == '') {
			return item;
		}
		if (attente) fct_attente(true,'nominatim'+item.value);
		var searchUrl;
		
		//api-adresse.data.gouv.fr/search/?q=15 boulevard joseph vallier grenoble&type=street"
		
		searchUrl =  url.urlAddok + '/search/?q=' + formatAddokAdresse(item.value,item.commune) + '&type=housenumber';//&lon=5.731641&lat=45.180645';
		console.log(searchUrl);
		$.support.cors = true; //pour IE7/8/9
		$.ajax({
			async : true,
			type: 'GET',
			url : searchUrl, 
			dataType :'json',
			timeout:5000,
			error : function (xhr, ajaxOptions, thrownError) {
				if (attente) fct_attente(false,'nominatim'+item.value);
				console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError);
				return item;
			},
			success : function (data) {
				if (attente) fct_attente(false,'nominatim'+item.value);
				for (var i = 0; i < data.features.length ; i++) {
					if (data.features[i].properties.city 
						&& data.features[i].properties.city.latinise().toUpperCase() == item.commune.replace(new RegExp("ST-", 'g'), "SAINT-")
						&& estDansRectangle(parseFloat(data.features[i].geometry.coordinates[0]), parseFloat(data.features[i].geometry.coordinates[1]))
						) { //Pas toujours bon au premier résultat, exemple 3 rue allié grenoble
						item.lon = parseFloat(data.features[i].geometry.coordinates[0]);
						item.lat = parseFloat(data.features[i].geometry.coordinates[1]);
						item.numeroNonTrouve = false;
						break;
					} 
				}
				fct(item);
			}
		});
			
	} catch (e) {
		console.error(e.lineNumber+' : '+e.message);
		if (attente) fct_attente(false,'nominatim'+item.value);
	}

	return item;
}

//--------------------------------------//
// formatAddokAdresse
// Format l'adresse pour les recherches nominatim
// ex : 7 rue commandant perreau grenoble
//--------------------------------------//
function formatAddokAdresse(adresse,nomCommune) {
	var formatedAddresse="";
	var nomVille;
	var nomRue;

	try { //GRENOBLE, 15 BOULEVARD MAURICE GAMBETTA
	if (typeof(nomCommune)=='undefined') {
		nomVille = adresse.split(", ")[0].replace(new RegExp("'", 'g'), "%27"); //GRENOBLE
		nomRue = adresse.split(", ")[1]; //15 MAURICE GAMBETTA (BOULEVARD)
	}
	else {
		nomVille = nomCommune;
		nomRue = adresse.replace(nomVille+ " ", "");
	}
	formatedAddresse = nomRue + ' ' + nomVille;
		
	} catch (e) {
		console.log(e);
	}

	return encodeURI(formatedAddresse);
}

//--------------------------------------//
// extractUrlParams
// Fonction de récupération des paramètres GET de la page
// exemple de paramètre : "?date=12/03/2012&heure=12:00:00&codearret=SEM_CHAMPOLL"
// @return Array Tableau associatif contenant les paramètres GET
//--------------------------------------//
function extractUrlParams(separator){
	var t = location.search.substring(1).replace(/&amp;/g,"&").split(separator);
	var f = [];
	for (var i=0; i<t.length; i++){
		var x = t[ i ].split('=');
		if (typeof(x[1])!='undefined')
			f[x[0]]=x[1].replace(/%20/g," ").replace(/%27/g,"'").replace(/%C8/g,"È");
		else
			f[x[0]]="";
	}
	return f;
}

//--------------------------------------//
// chargeLignes
// Charge les lignes
//--------------------------------------//
function chargeLignes(fctCallbackLigne,fctCallbackFini) {

	if (dataLignesTC) return;
	$( document ).on( "evtLignesChargees", {}, function( event, data ) {
		if (fctCallbackFini) fctCallbackFini(data);
	});
	var searchUrl = url.ws() + '/api/routers/'+url.otp2Router+'/index/routes';
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( "evtLignesPasChargees");
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			if (dataLignesTC) return;
			var newData= {};
			json.filter(function(route){
				route.code = route.id.replace(':','_');
				route.lib = route.shortName + '-' + route.longName;
				//route.type = getTypeLigne(route.code,route.shortName);
				route.routeShortName = route.shortName;
				route.routeLongName = route.longName;
				route.routeColor = route.color;
				route.routeTextColor = route.color;
				if(!typesLgn[route.type]) 
					console.log('!typesLgn[route.type] : +' +route.code+' '+route.type);
				else
					typesLgn[route.type].push(route.code);
				if (route.code.substr(0,3)!='GAM') {
					if(fctCallbackLigne) fctCallbackLigne(route);
					newData[route.code]=route;
					return true;
				} else 
					return false;
			});
			dataLignesTC = newData;
			//fctCallbackFini(newData);
			$( document ).trigger( "evtLignesChargees", newData );
		}
	});
}
//--------------------------------------//
// getLogoLgn
// Cree le logo des ligne
//--------------------------------------//
function getLogoLgn(fullcode,num,color,bLargeurConst,classe,classeRect) {
	try{
		
	var code = fullcode;
	var numero = num;
	if (fullcode.substr(0,7) == 'SEMx01_') {
		code=fullcode.substr(7);
	}	
	if (color=='') return $('');
	
		var viewBoxSize, cx, x; 
		var cl =classe;
	if (bLargeurConst || code.substr(0,3) == 'C38' || code.substr(0,3) == 'GSV'|| code.substr(0,3) == 'TPV' || code.substr(4).length > 2)  {
		viewBoxSize =  "0 0 200 100";
		cx = "100";
		x = "55";
		cl = classe + ' ' + classeRect;
	}
	else {
		viewBoxSize = "0 0 100 100";
		cx = "50";
		x = "5";
	}


	var strLogo = '<svg id="svg_' + numero + '" data-code="'+code+'" class="'+cl+'" style="font-size:60px;font-family: Arial;font-weight:bold;text-anchor: middle;stroke-width:6px;" viewbox="' + viewBoxSize + '">\
		<title></title>\
		<circle class="svgFond" cx="'+ cx +'" cy="50" r="45" stroke="white" stroke-width="0" fill="yellow" />\
		<rect class="svgFond" x="' + x + '" y="10" width="90" stroke="white" stroke-width="0" height="80" rx="10" ry="10" fill="yellow" />\
		<text class="svgNumLigne" x="50%" y="72.5%" fill="white">O</text>\
	</svg>';
	
	var strLogoC38 = '<svg class="'+cl+'" data-code="'+code+'" style="font-size:60px;font-family: Arial;font-weight:bold;text-anchor: middle;stroke-width:6px;" viewbox="0 0 200 100">\
		<title></title>\
		<rect class="svgFond" x="10" y="10" width="172" stroke="white" stroke-width="0" height="80" rx="5" ry="5" fill="yellow" />\
		<text class="svgNumLigne" x="50%" y="72.5%" fill="white">O</text>\
	</svg>';

	if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
		strLogo = $('<span style="font-size:10px;font-family: Arial;font-weight:bold;text-anchor: middle;stroke-width:6px;">'+numero+'</span>');	
		strLogoC38 = $('<span style="font-size:10px;font-family: Arial;font-weight:bold;text-anchor: middle;stroke-width:6px;">'+numero+'</span>');		
	}
	var logo = $(strLogo);
	var logoC38 = $(strLogoC38);

	var cadreC38 = logoC38.find('rect.svgFond');
	var cadre;
	if (['A', 'B', 'C', 'D', 'E', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'].indexOf(numero) >= 0 ) {
		logo.find('rect.svgFond').remove();
		cadre = logo.find('circle.svgFond');
	} else {
		logo.find('circle.svgFond').remove();
		cadre = logo.find('rect.svgFond');
	}	
	var couleurFond = '';
	var couleur = '';
	var reseau = '';
	var title = '';
	if(code.substr(0,3) == 'SEM') {
		couleurFond = colorToHex(color);
		
		if (['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].indexOf(numero) >= 0 && couleurFond != "#000000") {
			couleur = 'black';
		} else {
			couleur = 'white';
		}
		//if(code == 'SEM_EBUS' || code == 'SEM_81'|| code == 'SEM_82'|| code == 'SEM_NAVB'|| code == 'SEM_83'|| code == 'SEM_84'|| code == 'SEM_85') {
		/*if(code == 'SEM_12b') {
			logo.find('.svgFond').attr('x' ,'10');
			logo.find('.svgFond').attr('width' ,'172');
		}*/
		reseau = 'TAG';
		title = 'Ligne '+numero+' - '+reseau;
	} else if(code.substr(0,3) == 'C38') {
		logo = logoC38;
		cadre = cadreC38;
		couleurFond = colorToHex(color);
		couleur = getContrastYIQ(colorToHex(color));
		reseau = 'Transisère';
		title = 'Ligne '+numero+' - '+reseau;
	} else if(code.substr(0,3) == 'GSV') {
		logo = logoC38;
		cadre = cadreC38;
		if(!color)
			couleurFond = '#339';
		else
			couleurFond = colorToHex(color);
		couleur = getContrastYIQ(couleurFond);
		reseau = 'Grésivaudan';
		title = 'Ligne '+numero+' - '+reseau;
	} else if(code.substr(0,3) == 'TPV') {
		logo = logoC38;
		cadre = cadreC38;
		if(!color)
			couleurFond = '#339';
		else
			couleurFond = colorToHex(color);
		couleur = getContrastYIQ(couleurFond);
		reseau = 'Voironnais';
		title = 'Ligne '+numero+' - '+reseau;
	} else {//SNC et autres
		couleurFond = colorToHex(color);
		couleur = getContrastYIQ(colorToHex(color));
		if (code.substr(0,3) == "SNC") {
			numero = "Ter";
			couleurFond = '#205DC9';
			couleur = '#fff';
			reseau = 'SNCF';
			title = 'Ligne '+numero+' - '+reseau;
		} else if (code.substr(4).length > 2) {
			logo = logoC38;
			cadre = cadreC38;
			reseau = 'Autre';
			title = 'Ligne '+(dataLignesTC[code]?dataLignesTC[code].routeLongName:numero);
		} else {
			reseau = 'Autre';
		}
		 
	}
	
	logo.find('text.svgNumLigne').attr('fill',couleur).text(numero);
	cadre.attr('fill',couleurFond);

	logo.find('title').text(title);
	
	return logo;
	} catch(e) {
		console.log("getLogoLgn catch : " + e);
	}
}

//--------------------------------------//
// getLogoFav
// Cree le logo des favoris
//--------------------------------------//
function getLogoFav(text,colors,id,classes,onOff) {
	if(onOff) classes += ' oui';
	else classes += ' non';
	var texteAlt = (onOff?'Supprimer le favoris':'Ajouter en favoris');
	//logo = $('<button type="button" id="' + id + '" class="' + classes + ' left-block"><span class="glyphicon ' + (onOff?'glyphicon-star':'glyphicon-star-empty') + '"></span>' + text + '</button>');
	if(text ==""){
		//logo = $('<a href="#" id="' + id + '" class="' + classes + ' left-block"> <span class="glyphicon ' + (onOff?'glyphicon-star':'glyphicon-star-empty') + '"></span></a>');
		logo = $('<a href="#" id="' + id + '" class="' + classes + ' left-block" title="'+texteAlt+'"> <span class="sr-only">'+texteAlt+'</span></a>');
	} else { 
		//logo = $('<a href="#" id="' + id + '" class="' + classes + ' left-block">' + text + '<span class="glyphicon ' + (onOff?'glyphicon-star':'glyphicon-star-empty') + '"></span></a>');
		logo = $('<a href="#" id="' + id + '" class="' + classes+' '+text + ' left-block" title="'+texteAlt+'"> <span class="sr-only">'+texteAlt+'</span></a>');
	}
	//var color = (onOff?colors.actif:colors.inactif);
	//logo.css('background-color',color);
	return $(logo);
}

//--------------------------------------//
// selectLogoFav
// met l'etoile de favoris à on
//--------------------------------------//

function selectLogoFav(obj,color) {
	obj.removeClass('non');
	obj.addClass('oui');
	//obj.css('background-color',color);
	
}

//--------------------------------------//
// unSelectLogoFav
// met l'etoile de favoris à off
//--------------------------------------//

function unSelectLogoFav(obj,color) {
	obj.removeClass('oui');
	obj.addClass('non');
}

//--------------------------------------//
// isLigneFavorite
// permet de savoir si une ligne est parmis la liste favoris
//--------------------------------------//
function isLigneFavorite(id) {
	id = id.replace('_',':');
	return  dataFavoris.ligne.indexOf(id)!=-1;
}

//--------------------------------------//
// isArretfavorite
// permet de savoir si un  arret est parmis la liste favoris
//--------------------------------------//
function isArretfavori(idLigne , idArret){
	idLigne = idLigne.replace('_',':');
	idArret = idArret.replace('_',':');
	 return dataFavoris.arret.indexOf(idArret+'@'+idLigne)!=-1  ;
}

//--------------------------------------//
// isSelectedLogoFav
// met l'etoile de favoris à on
//--------------------------------------//

function isSelectedLogoFav(obj) {
	//return ($('#' + id + " > span").hasClass('glyphicon-star'));
	return (obj.hasClass('oui'));
}

//--------------------------------------//
// toogleLigneFavorite
// valide ou devalide la ligne
// Attention, comme il y a 2 sens, on identifier une action par un ID mais on selectionne/délectionne par une class (on a 2 boutons)
//--------------------------------------//

function toogleLigneFavorite(obj , ligne,colors) {
	var classline = ligne.replace(':','');
	var lignes = $('.fav_'+classline+'.favorisLigne');
	if (isSelectedLogoFav(obj)) {
		AjoutOuSupprimerligne(ligne, 'delete')
		unSelectLogoFav(lignes,colors.inactif);
	} else {
		AjoutOuSupprimerligne(ligne,'add')
		selectLogoFav(lignes,colors.actif);
	}
}
//--------------------------------------//
// toogleArretFavori
// valide ou devalide l'arret
//--------------------------------------//
function toogleArretFavori(obj , ligne, arret,colors) {
	var poteaux = $('.favorisArret.'+arret.replace(":",""));
	if (isSelectedLogoFav(obj)) {
		AjoutOuSupprimerArret(ligne, arret ,'delete')
		unSelectLogoFav(poteaux,colors.inactif);
	} else {
		AjoutOuSupprimerArret(ligne, arret ,'add')
		selectLogoFav(poteaux,colors.actif);
	}
}
//--------------------------------------//
// toogleProchainPassageArretFavori
//
//--------------------------------------//
function toogleProchainPassageArretFavori(obj , ligne, arret,colors) {
	if (isSelectedLogoFav(obj)) {
		AjoutOuSupprimerArret(ligne, arret ,'delete')
		unSelectLogoFav(obj,colors.inactif);
	} else {
		AjoutOuSupprimerArret(ligne, arret ,'add')
		selectLogoFav(obj,colors.actif);
	}
}

//--------------------------------------//
// toogleItiFavori
// //preprod.metromobilite.fr/iti.html?iFrame=true&tc=true&site=tag&token=b049c920a78175696459ec056d7475a462047443&dep=AGENCE%20DE%20MOBILITE%20STATIONMOBILE&arr=All%C3%A9e%20des%20Gentianes&lonlatDep=45.180159,5.713812&lonlatArr=45.25036,5.66291&communeDep=GRENOBLE&communeArr=FONTANIL-CORNILLON
//--------------------------------------//
function toogleItiFavori(obj) {
	
	if (isSelectedLogoFav(obj)) {
		AjoutOuSupprimerIti('delete')
		unSelectLogoFav(obj,colors.inactif);
	} else if ($('#dep').val() != "" && $('#arr').val() != "" && $('#dep').attr('data-lonlat') != "0,0" && $('#dep').attr('data-lonlat') != "0,0") {
		AjoutOuSupprimerIti('add')
		selectLogoFav(obj,colors.actif);
	}
}
//--------------------------------------//
// unSelectItiLogoFav
//
//--------------------------------------//
function unSelectItiLogoFav() {
	if (urlParams.favori=="") return;
	urlParams.favori="";
	unSelectLogoFav($('#idFav'),colors.inactif);	
}

//--------------------------------------//
// isfavorisPresent
// rajouter ici les criteres de controle sur l'affichage des favoris
//--------------------------------------//
function isfavorisPresent(partenaireLigne) {
	return  (urlParams.token !='' && partenaireLigne == "SEM");
}

//--------------------------------------//
// isItiFavorisPresent
// rajouter ici les criteres de controle sur l'affichage des iti favoris
// url de test : http://localhost/iti.html?iFrame=true&tc=true&site=tag&dep=AGENCE%20DE%20MOBILITE%20STATIONMOBILE&arr=All%C3%A9e%20des%20Gentianes&lonlatDep=45.180159,5.713812&lonlatArr=45.25036,5.66291&communeDep=GRENOBLE&communeArr=FONTANIL-CORNILLON&token=d162f018eaf12371cb988e2db668c18721cab721&favori=12
//--------------------------------------//
function isItiFavorisPresent() {
		
	return  (urlParams.token !='');
}

//--------------------------------------//
//getContrastYIQ
//--------------------------------------//
function getContrastYIQ(hexcolor){
	var r = parseInt(hexcolor.substr(1,2),16);
	var g = parseInt(hexcolor.substr(3,2),16);
	var b = parseInt(hexcolor.substr(5,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	//return (yiq >= 128) ? 'black' : 'white';
	return (yiq >= 170) ? 'black' : 'white';
}

//--------------------------------------//
//colorToHex
//--------------------------------------//
function colorToHex(color) {
	if (color.substr(0, 1) === '#') {
		return color;
	}
	var digits = /(\d+),(\d+),(\d+)/.exec(color);
	var red = (parseInt(digits[1])).toString(16);
	var green = (parseInt(digits[2])).toString(16);
	var blue = (parseInt(digits[3])).toString(16);
	var srgb = '#' + (red.length==1?'0':'')+red;
	srgb += (green.length==1?'0':'')+green;
	srgb += (blue.length==1?'0':'')+blue;
    return srgb;
}
 
//--------------------------------------//
//formatDistance
//--------------------------------------//
function formatDistance(distance) {
	try {
		if (distance == "") return "n.c.";
		
		if (distance < 950)
			return Math.round(distance) + ' m';
		else {
				distance= distance/1000;
				return distance.toFixed(2) + ' km';
			}
	} catch(e) {
		return "n.c";
	}
}

//--------------------------------------//
// tri
// exemple tri("#search_resultsLgn","li","","innerHTML");
//--------------------------------------//
function tri(conteneur,element,prefixe,critere)	{
	$(conteneur).find(element).sort(function(a,b){
		var codeA = $(a).attr(critere).substr(prefixe.length,$(a).attr(critere).length-prefixe.length);
		var codeB = $(b).attr(critere).substr(prefixe.length,$(b).attr(critere).length-prefixe.length);
		if(codeA == 'SEM_12b') codeA = 'SEM_12';
		if(codeB == 'SEM_12b') codeB = 'SEM_12';
		return compareCodeLigne(codeA,codeB);
	}).detach().appendTo(conteneur);
}

//--------------------------------------//
//compareCodeLigne
//--------------------------------------//
function compareCodeLigne(a,b) {
	try {		
		
		var groupeA = -1;
		var groupeB = -1;
		if (a == "") return -1;
		if (b == "") return 1;
		var tab = [{code:a,res:""},{code:b,res:""}];
		tab.forEach(function(e) {
			var type = getTypeLigne(e.code,e.code.substr(4,e.code.length-4));
			switch(type) {
				case 'TRAM':
					e.res=1;
					break;
				case 'CHRONO':
					e.res=2;
					break;
				case 'PROXIMO':
					e.res=3;
					break;
				case 'FLEXO':
					e.res=4;
					break;
				case 'NAVETTE':
					e.res=5;
					break;
				case 'C38':
					e.res=7;
					break;
				case 'SNC':
					e.res=8;
					break;
				case 'GSV':
					e.res=9;
					break;
				case 'TPV':
					if(/^[1-9]$/i.test(e.code.substr(4))) e.res=10;
					else if(/^[1-9][0-9]$/i.test(e.code.substr(4))) e.res=11;
					else if(/^[A-Z]$/i.test(e.code.substr(4))) e.res=12;
					else e.res=13;
					
					break;
				case 'SCOL':
					e.res=14;
					break;
				default:
					e.res=15;
			}
			if (e.code.substr(0,7)=='C38_EXP') e.res=6;
		});
		
		if (tab[0].res < tab[1].res) {
			return -1;
		} else if (tab[0].res == tab[1].res) {
			if (tab[0].code < tab[1].code) { return -1 ;} else return  1;
		} else {
			return 1;
		}
	} catch(e){
		console.log(e.msg+' : '+e.lineNumber);
	}
}

//--------------------------------------//
//isMobile
//--------------------------------------//
function isMobile(){
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent);
}

//--------------------------------------//
//textEchangeurs
//--------------------------------------//
function textEchangeurs(exitsList) {
	if (exitsList == 'START;END') return '';
	var exits = exitsList.split(';');
	if (exits[0] == 'START') 
		return "avant l'échangeur "+exits[exits.length-1];
	if (exits[exits.length-1] == 'END') 
		return "après l'échangeur "+exits[0];
	return 'entre les echangeurs '+exits[0]+' et '+exits[exits.length-1]+'.';
}

//--------------------------------------//
//ajouteSaisieLignes
//--------------------------------------//
function ajouteSaisieLignes(champ,options){
	try {
		if ($(champ) && $(champ).typeahead) {
			var searchUrl = url.ws() + '/api/routers/'+url.otp2Router+'/index/routes'
			$.ajax({
				type: "GET",
				url : searchUrl,
				dataType : 'json',
				error : function (xhr, ajaxOptions, thrownError) {
					console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + 'thrownError : '+thrownError + '\n' + searchUrl);
				},
				success : function (json) {
					//todo
					//var nomReseau = new Array('(BUS TAG)','(CAR ITINISERE)','(TRAIN TER-SNCF)');
					//' ' + (typeCode=='SEM'?nomReseau[0]:typeCode=='C38'?nomReseau[1]:nomReseau[2])
					//todo data-reseau
					var data = json.filter(function(route){
						route.id = {id:route.id.replace(':','_'), agencyId : route.id.split(':')[0]};
						route.routeShortName = route.shortName;
						route.routeLongName = route.longName;
						route.code = route.id.id;
						route.lib = route.routeShortName + '-' + route.routeLongName;
						
						if (route.code.substr(0,3)=='GAM')
							return false;
						if (urlParams.reseau == 'TPV' && route.code.substr(0,3)=='TPV')
							return true;
						if (urlParams.reseau == 'GSV' && route.code.substr(0,3)=='GSV')
							return true;
						if (route.code.substr(0,3)=='SEM' || route.code.substr(0,3)=='C38')
							return true;
						return false;
					});
					$(champ).typeahead({
						source:data,
						matcher: function (item) {
							var okLib = this.query.length>4 && item.lib.toUpperCase().indexOf(this.query.toUpperCase())!=-1;
							var okNum = (item.routeShortName.toUpperCase() == this.query.toUpperCase().trim());
							return okLib||okNum;
						},
						sorter: function(items){
							items = items.sort(function(a,b){
								return compareCodeLigne(a.code,b.code);
							});
							return items;
						},
						highlighter: function (item) {
							if(this.query.length<=4) 
								return '<span data-type="ligne">'+item.lib+'</span>';
							var regex = new RegExp( '(' + this.query + ')', 'gi' );
							return '<span data-type="ligne">'+item.lib.replace( regex, "<strong>$1</strong>" )+'</span>';
						},
						updater:function(item){
							options.fctSaisieReussie(item);
							return item.lib;
						},
						items:'all',
						minLength:1,
						autoSelect:false
					});
				}
			});
		}
	} catch (e) {
		console.log(e.msg+' : '+e.lineNumber);
	}
}

//--------------------------------------//
//getTypeLigne
//--------------------------------------//
function getTypeLigne(code,numero) {
	//Détermination du type
	var type = code.substr(0,3); //TRAM,CHRONO,PROXIMO,FLEXO,C38,SNC
	if (type == 'SEM') { //On affine : SEM -> TRAM,CHRONO,PROXIMO,FLEXO
				expReg = /(SEM_C[1-9]$)/g; //"CHRONO"
				if (expReg.test(code.substr(0,7))) {
					type = "CHRONO";
				} else {
					expReg = /(SEM_[A-Z]$)/g; //"TRAM"
					if (expReg.test(code.substr(0,7)))
						type = "TRAM";
					else {
							//var numeroInt = parseInt(numero);
							if (numero < 40)
								type = "PROXIMO";
							else if(numero > 80 ) {
								type = 'NAVETTE';
							} else
								type = "FLEXO";
						}
					}

	} else if(type=='C38') {
		expReg = /(C38_[1-9|E][0-9|X]$)/g;
		if (expReg.test(code.substr(0,6))) {
			type='C38';
		} else {
			type='SCOL';
		}
	} else if(type=='GAM') {
		type='SCOL';
	}
	return type;
}
function isTaille(taille) {
	var width = $('body').width();
	switch(taille) {
		case 'xxs':
			return (window.matchMedia && window.matchMedia('(max-width: 480px)').matches) || (!window.matchMedia && width <= 480);
		break;
		case 'xs':
			return (window.matchMedia && window.matchMedia('(min-width: 481px) and (max-width: 767px)').matches) || (!window.matchMedia && width > 480 &&  width < 768);
		break;
		case 'sm':
			return (window.matchMedia && window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches) || (!window.matchMedia && width >= 768 &&  width < 992);
		break;
		case 'md':
			return (window.matchMedia && window.matchMedia('(min-width: 992px) and (max-width: 1199px)').matches) || (!window.matchMedia && width >= 992 &&  width < 1200);
		break;
		case 'lg':
			return (window.matchMedia && window.matchMedia('(min-width: 1200px)').matches) || (!window.matchMedia && width >= 1200);
		break;
		default:
			return false;
	}
	return false;
}

//--------------------------------------//
// trackPiwik
// 1 Statistiques StationMobile, 2 Statistiques Calculateur, 3 Statistiques Metromobilite, 4 Statistique MetroVelo, 5 Statistique Tag
//--------------------------------------//
function trackPiwik(detail) {
	try {
		var site;
		//8 pour WS
		switch(urlParams.site) {
		case 'metromobilite':
			site=3;
			break;
		case 'metromobiliteAppMobile':
			site=6;
			break;
		case 'metrovelo':
			site=4;
			break;
		case 'tag':
			site=5;
			break;
		case 'hamo':
			site=7;
			break;
		case 'smtc':
			site=9;
			break;
		case 'metro':
			site=10;
			break;
		default:
			site=3;
		}
		if (isMobile()) {

			if (typeof(device)=='undefined')
				detail = detail + ' (web)';
			else
				detail = detail + ' (' + device.platform + ')';
		}
		
		var piwikTracker = Piwik.getTracker(url.urlPiwik, site);
		function getOriginalVisitorCookieTimeout() {
			var maintenant = new Date();
			var nowTs = Math.round(maintenant.getTime() / 1000);
			var visitorInfo = piwikTracker.getVisitorInfo();
			var createTs = parseInt(visitorInfo[2]);
			var cookieTimeout = 33696000; // 13 mois en secondes
			var originalTimeout = createTs + cookieTimeout - nowTs;
			return originalTimeout;
		}
		piwikTracker.setVisitorCookieTimeout( getOriginalVisitorCookieTimeout() );
		piwikTracker.trackPageView(detail);
		piwikTracker.enableLinkTracking();
	} catch(err) {
		console.log('trackPiwik fatal error:' + err.message);
	}
}

//--------------------------------------//
//isExplorateurCompatible
//--------------------------------------//
function isExplorateurCompatible() {
	try {
		if (navigator.appVersion.indexOf("MSIE") != -1)
			return false;
		if (navigator.vendor.indexOf("Apple") != -1) //Detection de safari
			if (parseInt(navigator.userAgent.split('Safari/')[1].split('.')[0]) <= 534)
				return false;
	} catch (err) {}

	return true;
}

//--------------------------------------//
//getMobileOperatingSystem
//--------------------------------------//
function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if( userAgent.match(/Windows Phone/i) )
	{
		return 'Windows Phone';
	}
	else if( userAgent.match( /Android/i ) )
	{
		return 'Android';
	}
	else if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
	{
		return 'iOS';
	}
	else
	{
		return 'unknown';
	}
}

//--------------------------------------//
//lienVers
//--------------------------------------//
function lienVers(fichier) {
	window.open(url.json(fichier), "_blank",null);
}

//--------------------------------------//
//isUrlExists
//--------------------------------------//
function isUrlExists(url){
	var http = new XMLHttpRequest();
	try {
		http.open('GET', url, false);
		http.send();
		return (http.responseText.indexOf("404")==-1);
		} catch(e) {

			return false;
			}
}

//--------------------------------------//
//getShortStopName
//--------------------------------------//
function getShortStopName(name) {
	try{
		var tabText = name.split(', ');
		return (tabText.length>1?tabText[1]:tabText[0]);
	}catch(e){
		console.log(e.msg+' : '+e.lineNumber);
		return name;
	}
}

//--------------------------------------//
// urlify
// Permet de créer un hypertexte dans un texte.
//--------------------------------------//
function urlify(text) {
	var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(urlRegex, function(url) {
		return '<a href="' + url + '" target="_blank">' + url + '</a>';
	})
}

//--------------------------------------//
// Replace all SVG images with inline SVG
//--------------------------------------//
jQuery('img.svgARemplacer').each(function(){
	var $img = jQuery(this);
	var imgID = $img.attr('id');
	var imgClass = $img.attr('class');
	var imgURL = $img.attr('src');

	jQuery.get(imgURL, function(data) {
		// Get the SVG tag, ignore the rest
		var $svg = jQuery(data).find('svg');

		// Add replaced image's ID to the new SVG
		if(typeof imgID !== 'undefined') {
			$svg = $svg.attr('id', imgID);
		}
		// Add replaced image's classes to the new SVG
		if(typeof imgClass !== 'undefined') {
			$svg = $svg.attr('class', imgClass+' replaced-svg');
		}

		// Remove any invalid XML tags as per http://validator.w3.org
		$svg = $svg.removeAttr('xmlns:a');
		var toStaticHTML = window.toStaticHTML || function (s) { return s; };
		$svg = toStaticHTML($svg);

		// Replace image with new SVG
		$img.replaceWith($svg);
	}, 'xml');
});

//--------------------------------------//
// estDansRectangle
// Indique si un point est dans le rectangle englobant
//--------------------------------------//
function estDansRectangle(longitude, latitude) {
	false;
	return ((latitude > ZONE_AGGLO_BD_LATITUDE) && (latitude < ZONE_AGGLO_HG_LATITUDE) && (longitude > ZONE_AGGLO_HG_LONGITUDE) && (longitude < ZONE_AGGLO_BD_LONGITUDE));
} 

//--------------------------------------//
// modififieIconMaxres
// Modifie les valeur max d'apparition des icones, uniquement pour le site.
//--------------------------------------//
function modififieIconMaxres() {
	for (var e in stylesTypes) {
		if (stylesTypes[e].iconMaxres < 20)stylesTypes[e].iconMaxres = 20;
	};
}

//--------------------------------------//
//formatDelaiPP
//--------------------------------------//
function formatDelaiPP(time){
	var now = moment().unix();
	var late = time.unix();
	var res = late-now;
	if((res/60)<1){
		return "<1min";
	}else if((res/60)>=1 && (res/60)<30){
		res = Math.round(res/60);
		return res +"min";
	}else{
		return time.format("HH:mm");
	}
}

//--------------------------------------//
//fct_attente_horaires
//--------------------------------------//
function fct_attente_horaires(b_attendre) {
	if (attente == b_attendre) return;
	attente = b_attendre;
	$('body').toggleClass('attenteCurseur',b_attendre);
	if (attente) {
		if ($('#wait').size()) $('#wait').show();
	} else {
		if ($('#wait').size()) $('#wait').hide();
	}
	if (!$('#logoMetroMobilite').size()) return;
	if (attente) {
		setTimeout(function() {$('#logoMetroMobilite').find('animateTransform')[0].beginElement();}, 500);
	} else {
		setTimeout(function() {$('#logoMetroMobilite').find('animateTransform')[0].endElement();}, 500);
	}
}

//--------------------------------------//
//isEvenementEnCours
//--------------------------------------//
function isEvenementEnCours(ddeb,dfin) {

	var now  = moment(urlParams.heure).hour(0).minute(01);
	var dateOkDebut = now.isAfter(ddeb.hour(0).minute(0)) && now.isBefore(dfin.hour(23).minute(59));
	var dateOkFin = now.isAfter(ddeb.hour(0).minute(0)) && now.isBefore(dfin.hour(23).minute(59));
	var dateOkToday = ddeb.hour(0).minute(0).isBefore(urlParams.heure) && dfin.hour(23).minute(59).isAfter(urlParams.heure);
	
	return (dateOkDebut || dateOkFin || dateOkToday); 
}

//--------------------------------------//
//unEscapeHtml
//--------------------------------------//
function unEscapeHtml(unsafe) {
  return unsafe
     .replace(/&lt;/g, "<")
     .replace(/&gt;/g, ">")
     .replace(/&cent;/g, "¢")
     .replace(/&pound;/g, "£")
     .replace(/&euro;/g, "€")
     .replace(/&yen;/g, "¥")
     .replace(/&deg;/g, "°")
     .replace(/&frac14;/g, "¼")
     .replace(/&OElig;/g, "Œ")
     .replace(/&frac12;/g, "½")
     .replace(/&oelig;/g, "œ")
     .replace(/&frac34;/g, "¾")
     .replace(/&Yuml;/g, "Ÿ")
     .replace(/&iexcl;/g, "¡")
     .replace(/&laquo;/g, "«")
     .replace(/&raquo;/g, "»")
     .replace(/&iquest;/g, "¿")
     .replace(/&Agrave;/g, "À")
     .replace(/&Aacute;/g, "Á")
     .replace(/&Acirc;/g, "Â")
     .replace(/&Atilde;/g, "Ã")
     .replace(/&Auml;/g, "Ä")
     .replace(/&Aring;/g, "Å")
     .replace(/&AElig;/g, "Æ")
     .replace(/&Ccedil;/g, "Ç")
     .replace(/&Egrave;/g, "È")
     .replace(/&Eacute;/g, "É")
     .replace(/&Ecirc;/g, "Ê")
     .replace(/&Euml;/g, "Ë")
     .replace(/&Igrave;/g, "Ì")
     .replace(/&Iacute;/g, "Í")
     .replace(/&Icirc;/g, "Î")
     .replace(/&Iuml;/g, "Ï")
     .replace(/&ETH;/g, "Ð")
     .replace(/&Ntilde;/g, "Ñ")
     .replace(/&Ograve;/g, "Ò")
     .replace(/&Oacute;/g, "Ó")
     .replace(/&Ocirc;/g, "Ô")
     .replace(/&Otilde;/g, "Õ")
     .replace(/&Ouml;/g, "Ö")
     .replace(/&Oslash;/g, "Ø")
     .replace(/&Ugrave;/g, "Ù")
     .replace(/&Uacute;/g, "Ú")
     .replace(/&Ucirc;/g, "Û")
     .replace(/&Uuml;/g, "Ü")
     .replace(/&Yacute;/g, "Ý")
     .replace(/&THORN;/g, "Þ")
     .replace(/&szlig;/g, "ß")
     .replace(/&agrave;/g, "à")
     .replace(/&aacute;/g, "á")
     .replace(/&acirc;/g, "â")
     .replace(/&atilde;/g, "ã")
     .replace(/&auml;/g, "ä")
     .replace(/&aring;/g, "å")
     .replace(/&aelig;/g, "æ")
     .replace(/&ccedil;/g, "ç")
     .replace(/&egrave;/g, "è")
     .replace(/&eacute;/g, "é")
     .replace(/&ecirc;/g, "ê")
     .replace(/&euml;/g, "ë")
     .replace(/&igrave;/g, "ì")
     .replace(/&iacute;/g, "í")
     .replace(/&icirc;/g, "î")
     .replace(/&iuml;/g, "ï")
     .replace(/&eth;/g, "ð")
     .replace(/&ntilde;/g, "ñ")
     .replace(/&ograve;/g, "ò")
     .replace(/&oacute;/g, "ó")
     .replace(/&ocirc;/g, "ô")
     .replace(/&otilde;/g, "õ")
     .replace(/&ouml;/g, "ö")
     .replace(/&oslash;/g, "ø")
     .replace(/&ugrave;/g, "ù")
     .replace(/&uacute;/g, "ú")
     .replace(/&ucirc;/g, "û")
     .replace(/&uuml;/g, "ü")
     .replace(/&yacute;/g, "ý")
     .replace(/&thorn;/g, "þ")
     .replace(/&quot;/g, "\"")
     .replace(/'/g, "'")
     .replace(/&amp;/g, "&");
}

//--------------------------------------//
// formatSecondes
//--------------------------------------//
function formatSecondes(s, fo) { // seconds, format
	var d=h=m=0;
	  
	if (s>=86400) {
		d=Math.floor(s/86400);
		s-=d*86400;
	}
	if (s>=3600) {
		h=Math.floor(s/3600);
		s-=h*3600;
	}
	if (s>=60) {
		m=Math.floor(s/60);
		s-=m*60;
	}
	  
	if (fo != null) {
		var f = fo.replace('dd', (d<10)?"0"+d:d);
		f = f.replace('d', d);
		f = f.replace('hh', (h<10)?"0"+h:h);
		f = f.replace('h', h);
		f = f.replace('mm', (m<10)?"0"+m:m);
		f = f.replace('m', m);
		f = f.replace('ss', (s<10)?"0"+s:s);
		f = f.replace('s', s);
	} else {
		if ((d==0)&&(h==0)&&(m==0)&&(s==0)) return "0 min";
		if ((d==0)&&(h==0)&&(m==1)&&(s==0)) return "1 min";
		if ((d==0)&&(h==0)&&(m>1)&&(s==0)) return (m+" min");
		if ((d==0)&&(h==1)&&(m==0)&&(s==0)) return "1 h";
		
		if ((d==0)&&(h==0)&&(m==0)) 
			return ((s<10)?'0'+s:s)+' s ';
		else
			f = (d!=0?d+' j ':'') + (h!=0?((h<10)?'0'+h:h)+' h ':'') + (m!=0?(((m<10) && (h!=0))?'0'+m:m)+' min':'');
	}
	return f; 
}

//--------------------------------------//
// chargeFavoris
// Charge les favoris
//--------------------------------------//
function chargeFavoris() {
	var searchUrl = url.ws() + '/api/ecn/'+urlParams.token+'/favoris'
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( "evtFavorisCharges");
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			if (json.meta.code !=200) console.log(' favoris non chargés ' + json.meta.message);
			else {
				var newData= json.data;
				dataFavoris = newData;
				dataFavoris.ligne = newData.ligne;
				dataFavoris.arret = newData.arret;
				
				$( document ).trigger( "evtFavorisCharges", dataFavoris );
			}
		}
	});
}

//--------------------------------------//
// AjoutOuSupprimerligne
// Ajout ou supprimer ligne aux/des favoris
//--------------------------------------//
function AjoutOuSupprimerligne(ligne, typeaction) {
	var searchUrl = url.ws() + '/api/ecn/'+urlParams.token+'/favoris/ligne/'+ligne+'/' +typeaction
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( "evtFavoriAjouter");
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			if (json.meta.code !=200) console.log(json.meta.message);
			else {
				chargeFavoris();
			}
		}
	});
}

//--------------------------------------//
// AjoutOuSupprimerArret
// Ajout ou supprimer  arret aux/des favoris
//--------------------------------------//
function AjoutOuSupprimerArret(ligne, arret , typeaction) {
	var searchUrl = url.ws() + '/api/ecn/'+urlParams.token+'/favoris/ligne/'+ligne+'/arret/'+arret+'/'+typeaction
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( "evtFavoriAjouter");
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
		    if (json.meta.code !=200) console.log(json.meta.message);
			else {
				chargeFavoris();
			}
		}
	});
}

//--------------------------------------//
// AjoutOuSupprimerIti
// Ajout ou supprimer iti aux/des favoris
//--------------------------------------//
function AjoutOuSupprimerIti(typeaction) {
	
	var searchUrl =  url.ws() + '/api/ecn/'+urlParams.token+'/favoris/iti/';
	
	if (typeaction == 'add') { //add?label=test&url=%26amp%3Bdep%3DLA%2520POYA%26amp%3Barr%3DHUBERT%2520DUBEDOUT%2520-%2520MAISON%2520DU%2520TOURISME%26amp%3BlonlatDep%3D45.19709%2C5.67222%26amp%3BlonlatArr%3D45.1902%2C5.72822%26amp%3BcommuneDep%3DFONTAINE%26amp%3BcommuneArr%3DGRENOBLE
		searchUrl += typeaction + '?label=' + encodeURIComponent($('#dep').val() + ' - ' + $('#arr').val());  
		searchUrl +=  '&url=dep=' + encodeURIComponent($('#dep').val());
		searchUrl +=  encodeURIComponent('&arr=' + $('#arr').val());
		searchUrl +=  encodeURIComponent('&lonlatDep=' + $('#dep').attr('data-lonlat'));
		searchUrl +=  encodeURIComponent('&lonlatArr=' + $('#arr').attr('data-lonlat'));
		searchUrl +=  encodeURIComponent('&communeDep=' + $('#dep').attr('data-commune'));
		searchUrl +=  encodeURIComponent('&communeArr=' + $('#arr').attr('data-commune'));
	} else if (typeaction == 'delete') { //delete?favori=xx
		searchUrl += typeaction + '?favori=' + urlParams.favori;
	}
	console.log(searchUrl);
	
	$.ajax({
		type: "GET",
		url : searchUrl,
		dataType : 'json',
		error : function (xhr, ajaxOptions, thrownError) {
			$( document ).trigger( "evtFavoriAjouter");
			console.log('xhr.status : '+xhr.status + '\nxhr.responseText : '+xhr.responseText + '\najaxOptions : '+ajaxOptions + '\nthrownError : '+thrownError + '\n' + searchUrl);
		},
		success : function (json) {
			if (json.meta.code !=200) console.log(json.meta.message);
			else if (typeof(json.data.favori) != 'undefined') urlParams.favori = json.data.favori;
		}
	});
}

