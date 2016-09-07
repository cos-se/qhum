var xlsxurl = 'https://dl.dropboxusercontent.com/u/2624323/cos/qh2/test2.xlsx',
	googleMapsApiKey = 'AIzaSyDo-siqnczOSWCRoUEygoTySkDUsSsX-ak',
	googleMapsGeocodingKey = 'AIzaSyDs3bo2R4NPqiU0geRF7ZOEtsx_KDWZSPU';

// FUNCTIONS

var is_iPhone = /iPhone|iPod/.test(navigator.platform);

// Removes duplicates from array
function unique(a) {
	if (a) {
		var result = [];
		if (a.constructor === Array) {
			$.each(a, function(i, e) {
				if ($.inArray(e, result) == -1) result.push(e);
			});
		} else {
			result.push(a)
		}
		return result;
	}
}

// Parses weird Excel dates into JS dates
function excelDate(d) {
	return new Date((d - (25567 + 2))*86400*1000);
};
function toSlug(s) {
    if (s) {
		return s.toLowerCase()
				.replace(/[åäö]/gi, function(match){ return {'å':'a','ä':'a','ö':'o'}[match]; })
				.replace(/[^\w ]+/g,'')
				.replace(/ +/g,'_');
				//.replace(/_-_/g,'-');
	}
}
function keysToSnakeCase(obj){
    Object.keys(obj).forEach(function (key) {
        var k = toSlug(key);
        if (k !== key) {
            obj[k] = obj[key];
            delete obj[key];
        }
    });
    return (obj);
}

function matchInArray(toMatch, target) {
	if (toMatch) {
		'use strict';
		var found, targetMap, i, j, cur;
		found = false;
		targetMap = {};
		// Put all values in the target array into a map, where the keys are the values from the array
		for (i = 0, j = target.length; i < j; i++) {
			cur = target[i];
			targetMap[cur] = true;
		}
		// Loop over all items in the toMatch array and see if any of  their values are in the map from before
		for (i = 0, j = toMatch.length; !found && (i < j); i++) {
			cur = toMatch[i];
			found = !!targetMap[cur];
			// If found, targetMap[cur] will return true, otherwise it will return undefined... that's what the !! is for
		}
		return found;
	}
};

function toggleArrayItem(item, array) {
	var i = array.indexOf(item);
	if (i === -1) array.push(item);
	else array.splice(i,1);
};

var countries=[{"n":"Afghanistan","a":"xxxx","a2":"AF","a3":"AFG","n3":"004","sr":"034","r":"142"},{"n":"Åland","a":"Åland Islands","a2":"AX","a3":"ALA","n3":"248","sr":"154","r":"150"},{"n":"Albania","a":"xxxx","a2":"AL","a3":"ALB","n3":"008","sr":"039","r":"150"},{"n":"Algeria","a":"xxxx","a2":"DZ","a3":"DZA","n3":"012","sr":"015","r":"002"},{"n":"American Samoa","a":"xxxx","a2":"AS","a3":"ASM","n3":"016","sr":"061","r":"009"},{"n":"Andorra","a":"xxxx","a2":"AD","a3":"AND","n3":"020","sr":"039","r":"150"},{"n":"Angola","a":"xxxx","a2":"AO","a3":"AGO","n3":"024","sr":"017","r":"002"},{"n":"Anguilla","a":"xxxx","a2":"AI","a3":"AIA","n3":"660","sr":"029","r":"019"},{"n":"Antigua and Barbuda","a":"xxxx","a2":"AG","a3":"ATG","n3":"028","sr":"029","r":"019"},{"n":"Argentina","a":"xxxx","a2":"AR","a3":"ARG","n3":"032","sr":"005","r":"019"},{"n":"Armenia","a":"xxxx","a2":"AM","a3":"ARM","n3":"051","sr":"145","r":"142"},{"n":"Aruba","a":"","a2":"AW","a3":"ABW","n3":"533","sr":"029","r":"019"},{"n":"Australia","a":"","a2":"AU","a3":"AUS","n3":"036","sr":"053","r":"009"},{"n":"Austria","a":"","a2":"AT","a3":"AUT","n3":"040","sr":"155","r":"150"},{"n":"Azerbaijan","a":"","a2":"AZ","a3":"AZE","n3":"031","sr":"145","r":"142"},{"n":"Bahamas","a":"","a2":"BS","a3":"BHS","n3":"044","sr":"029","r":"019"},{"n":"Bahrain","a":"","a2":"BH","a3":"BHR","n3":"048","sr":"145","r":"142"},{"n":"Bangladesh","a":"","a2":"BD","a3":"BGD","n3":"050","sr":"034","r":"142"},{"n":"Barbados","a":"","a2":"BB","a3":"BRB","n3":"052","sr":"029","r":"019"},{"n":"Belarus","a":"","a2":"BY","a3":"BLR","n3":"112","sr":"151","r":"150"},{"n":"Belgium","a":"","a2":"BE","a3":"BEL","n3":"056","sr":"155","r":"150"},{"n":"Belize","a":"","a2":"BZ","a3":"BLZ","n3":"084","sr":"013","r":"019"},{"n":"Benin","a":"","a2":"BJ","a3":"BEN","n3":"204","sr":"011","r":"002"},{"n":"Bermuda","a":"","a2":"BM","a3":"BMU","n3":"060","sr":"","r":"019"},{"n":"Bhutan","a":"","a2":"BT","a3":"BTN","n3":"064","sr":"034","r":"142"},{"n":"Bolivia","a":"Plurinational State of Bolivia","a2":"BO","a3":"BOL","n3":"068","sr":"005","r":"019"},{"n":"Bonaire, Sint Eustatius and Saba","a":"","a2":"BQ","a3":"BES","n3":"535","sr":"029","r":"019"},{"n":"Bosnia","a":"Bosnia and Herzegovina","a2":"BA","a3":"BIH","n3":"070","sr":"039","r":"150"},{"n":"Botswana","a":"","a2":"BW","a3":"BWA","n3":"072","sr":"018","r":"002"},{"n":"Brazil","a":"","a2":"BR","a3":"BRA","n3":"076","sr":"005","r":"019"},{"n":"British Virgin Islands","a":"","a2":"VG","a3":"VGB","n3":"092","sr":"029","r":"019"},{"n":"Brunei","a":"Brunei Darussalam","a2":"BN","a3":"BRN","n3":"096","sr":"035","r":"142"},{"n":"Bulgaria","a":"","a2":"BG","a3":"BGR","n3":"100","sr":"151","r":"150"},{"n":"Burkina Faso","a":"","a2":"BF","a3":"BFA","n3":"854","sr":"011","r":"002"},{"n":"Burundi","a":"","a2":"BI","a3":"BDI","n3":"108","sr":"014","r":"002"},{"n":"Cambodia","a":"","a2":"KH","a3":"KHM","n3":"116","sr":"035","r":"142"},{"n":"Cameroon","a":"","a2":"CM","a3":"CMR","n3":"120","sr":"017","r":"002"},{"n":"Canada","a":"","a2":"CA","a3":"CAN","n3":"124","sr":"","r":"019"},{"n":"Cape Verde","a":"Cabo Verde","a2":"CV","a3":"CPV","n3":"132","sr":"011","r":"002"},{"n":"CAR","a":"Central African Republic","a2":"CF","a3":"CAF","n3":"140","sr":"017","r":"002"},{"n":"Cayman Islands","a":"","a2":"KY","a3":"CYM","n3":"136","sr":"029","r":"019"},{"n":"Chad","a":"","a2":"TD","a3":"TCD","n3":"148","sr":"017","r":"002"},{"n":"Channel Islands","a":"","a2":"","a3":"","n3":"830","sr":"154","r":"150"},{"n":"Chile","a":"","a2":"CL","a3":"CHL","n3":"152","sr":"005","r":"019"},{"n":"China","a":"","a2":"CN","a3":"CHN","n3":"156","sr":"030","r":"142"},{"n":"Colombia","a":"","a2":"CO","a3":"COL","n3":"170","sr":"005","r":"019"},{"n":"Comoros","a":"","a2":"KM","a3":"COM","n3":"174","sr":"014","r":"002"},{"n":"Congo","a":"","a2":"CG","a3":"COG","n3":"178","sr":"017","r":"002"},{"n":"Cook Islands","a":"","a2":"CK","a3":"COK","n3":"184","sr":"061","r":"009"},{"n":"Costa Rica","a":"","a2":"CR","a3":"CRI","n3":"188","sr":"013","r":"019"},{"n":"Croatia","a":"","a2":"HR","a3":"HRV","n3":"191","sr":"039","r":"150"},{"n":"Cuba","a":"","a2":"CU","a3":"CUB","n3":"192","sr":"029","r":"019"},{"n":"Curacao","a":"Curaçao","a2":"CW","a3":"CUW","n3":"531","sr":"029","r":"019"},{"n":"Cyprus","a":"","a2":"CY","a3":"CYP","n3":"196","sr":"145","r":"142"},{"n":"Czech Republic","a":"","a2":"CZ","a3":"CZE","n3":"203","sr":"151","r":"150"},{"n":"Denmark","a":"","a2":"DK","a3":"DNK","n3":"208","sr":"154","r":"150"},{"n":"Djibouti","a":"","a2":"DJ","a3":"DJI","n3":"262","sr":"014","r":"002"},{"n":"Dominica","a":"","a2":"DM","a3":"DMA","n3":"212","sr":"029","r":"019"},{"n":"Dominican Republic","a":"","a2":"DO","a3":"DOM","n3":"214","sr":"029","r":"019"},{"n":"DRC","a":"Democratic Republic of the Congo","a2":"CD","a3":"COD","n3":"180","sr":"017","r":"002"},{"n":"East Timor","a":"Timor-Leste","a2":"TL","a3":"TLS","n3":"626","sr":"035","r":"142"},{"n":"Ecuador","a":"","a2":"EC","a3":"ECU","n3":"218","sr":"005","r":"019"},{"n":"Egypt","a":"","a2":"EG","a3":"EGY","n3":"818","sr":"015","r":"002"},{"n":"El Salvador","a":"","a2":"SV","a3":"SLV","n3":"222","sr":"013","r":"019"},{"n":"Equatorial Guinea","a":"","a2":"GQ","a3":"GNQ","n3":"226","sr":"017","r":"002"},{"n":"Eritrea","a":"","a2":"ER","a3":"ERI","n3":"232","sr":"014","r":"002"},{"n":"Estonia","a":"","a2":"EE","a3":"EST","n3":"233","sr":"154","r":"150"},{"n":"Ethiopia","a":"","a2":"ET","a3":"ETH","n3":"231","sr":"014","r":"002"},{"n":"Faeroe Islands","a":"","a2":"FO","a3":"FRO","n3":"234","sr":"154","r":"150"},{"n":"Falkland Islands","a":"Malvinas","a2":"FK","a3":"FLK","n3":"238","sr":"005","r":"019"},{"n":"Fiji","a":"","a2":"FJ","a3":"FJI","n3":"242","sr":"054","r":"009"},{"n":"Finland","a":"","a2":"FI","a3":"FIN","n3":"246","sr":"154","r":"150"},{"n":"France","a":"","a2":"FR","a3":"FRA","n3":"250","sr":"155","r":"150"},{"n":"French Guiana","a":"","a2":"GF","a3":"GUF","n3":"254","sr":"005","r":"019"},{"n":"French Polynesia","a":"","a2":"PF","a3":"PYF","n3":"258","sr":"061","r":"009"},{"n":"Gabon","a":"","a2":"GA","a3":"GAB","n3":"266","sr":"017","r":"002"},{"n":"Gambia","a":"","a2":"GM","a3":"GMB","n3":"270","sr":"011","r":"002"},{"n":"Georgia","a":"","a2":"GE","a3":"GEO","n3":"268","sr":"145","r":"142"},{"n":"Germany","a":"","a2":"DE","a3":"DEU","n3":"276","sr":"155","r":"150"},{"n":"Ghana","a":"","a2":"GH","a3":"GHA","n3":"288","sr":"011","r":"002"},{"n":"Gibraltar","a":"","a2":"GI","a3":"GIB","n3":"292","sr":"039","r":"150"},{"n":"Greece","a":"","a2":"GR","a3":"GRC","n3":"300","sr":"039","r":"150"},{"n":"Greenland","a":"","a2":"GL","a3":"GRL","n3":"304","sr":"","r":"019"},{"n":"Grenada","a":"","a2":"GD","a3":"GRD","n3":"308","sr":"029","r":"019"},{"n":"Guadeloupe","a":"","a2":"GP","a3":"GLP","n3":"312","sr":"029","r":"019"},{"n":"Guam","a":"","a2":"GU","a3":"GUM","n3":"316","sr":"057","r":"009"},{"n":"Guatemala","a":"","a2":"GT","a3":"GTM","n3":"320","sr":"013","r":"019"},{"n":"Guernsey","a":"","a2":"GG","a3":"GGY","n3":"831","sr":"154","r":"150"},{"n":"Guinea","a":"","a2":"GN","a3":"GIN","n3":"324","sr":"011","r":"002"},{"n":"Guinea-Bissau","a":"","a2":"GW","a3":"GNB","n3":"624","sr":"011","r":"002"},{"n":"Guyana","a":"","a2":"GY","a3":"GUY","n3":"328","sr":"005","r":"019"},{"n":"Haiti","a":"","a2":"HT","a3":"HTI","n3":"332","sr":"029","r":"019"},{"n":"Holy See","a":"","a2":"VA","a3":"VAT","n3":"336","sr":"039","r":"150"},{"n":"Honduras","a":"","a2":"HN","a3":"HND","n3":"340","sr":"013","r":"019"},{"n":"Hong Kong","a":"China, Hong Kong Special Administrative Region","a2":"HK","a3":"HKG","n3":"344","sr":"030","r":"142"},{"n":"Hungary","a":"","a2":"HU","a3":"HUN","n3":"348","sr":"151","r":"150"},{"n":"Iceland","a":"","a2":"IS","a3":"ISL","n3":"352","sr":"154","r":"150"},{"n":"India","a":"","a2":"IN","a3":"IND","n3":"356","sr":"034","r":"142"},{"n":"Indonesia","a":"","a2":"ID","a3":"IDN","n3":"360","sr":"035","r":"142"},{"n":"Iran","a":"Islamic Republic of Iran","a2":"IR","a3":"IRN","n3":"364","sr":"034","r":"142"},{"n":"Iraq","a":"","a2":"IQ","a3":"IRQ","n3":"368","sr":"145","r":"142"},{"n":"Ireland","a":"","a2":"IE","a3":"IRL","n3":"372","sr":"154","r":"150"},{"n":"Isle of Man","a":"","a2":"IM","a3":"IMN","n3":"833","sr":"154","r":"150"},{"n":"Israel","a":"","a2":"IL","a3":"ISR","n3":"376","sr":"145","r":"142"},{"n":"Italy","a":"","a2":"IT","a3":"ITA","n3":"380","sr":"039","r":"150"},{"n":"Ivory Coast","a":"Cote d'Ivoire","a2":"CI","a3":"CIV","n3":"384","sr":"011","r":"002"},{"n":"Jamaica","a":"","a2":"JM","a3":"JAM","n3":"388","sr":"029","r":"019"},{"n":"Japan","a":"","a2":"JP","a3":"JPN","n3":"392","sr":"030","r":"142"},{"n":"Jersey","a":"","a2":"JE","a3":"JEY","n3":"832","sr":"154","r":"150"},{"n":"Jordan","a":"","a2":"JO","a3":"JOR","n3":"400","sr":"145","r":"142"},{"n":"Kazakhstan","a":"","a2":"KZ","a3":"KAZ","n3":"398","sr":"143","r":"142"},{"n":"Kenya","a":"","a2":"KE","a3":"KEN","n3":"404","sr":"014","r":"002"},{"n":"Kiribati","a":"","a2":"KI","a3":"KIR","n3":"296","sr":"057","r":"009"},{"n":"Kuwait","a":"","a2":"KW","a3":"KWT","n3":"414","sr":"145","r":"142"},{"n":"Kyrgyzstan","a":"","a2":"KG","a3":"KGZ","n3":"417","sr":"143","r":"142"},{"n":"Laos","a":"Lao People's Democratic Republic","a2":"LA","a3":"LAO","n3":"418","sr":"035","r":"142"},{"n":"Latvia","a":"","a2":"LV","a3":"LVA","n3":"428","sr":"154","r":"150"},{"n":"Lebanon","a":"","a2":"LB","a3":"LBN","n3":"422","sr":"145","r":"142"},{"n":"Lesotho","a":"","a2":"LS","a3":"LSO","n3":"426","sr":"018","r":"002"},{"n":"Liberia","a":"","a2":"LR","a3":"LBR","n3":"430","sr":"011","r":"002"},{"n":"Libya","a":"","a2":"LY","a3":"LBY","n3":"434","sr":"015","r":"002"},{"n":"Liechtenstein","a":"","a2":"LI","a3":"LIE","n3":"438","sr":"155","r":"150"},{"n":"Lithuania","a":"","a2":"LT","a3":"LTU","n3":"440","sr":"154","r":"150"},{"n":"Luxembourg","a":"","a2":"LU","a3":"LUX","n3":"442","sr":"155","r":"150"},{"n":"Macao","a":"China, Macao Special Administrative Region","a2":"MO","a3":"MAC","n3":"446","sr":"030","r":"142"},{"n":"Macedonia","a":"The former Yugoslav Republic of Macedonia","a2":"MK","a3":"MKD","n3":"807","sr":"039","r":"150"},{"n":"Madagascar","a":"","a2":"MG","a3":"MDG","n3":"450","sr":"014","r":"002"},{"n":"Malawi","a":"","a2":"MW","a3":"MWI","n3":"454","sr":"014","r":"002"},{"n":"Malaysia","a":"","a2":"MY","a3":"MYS","n3":"458","sr":"035","r":"142"},{"n":"Maldives","a":"","a2":"MV","a3":"MDV","n3":"462","sr":"034","r":"142"},{"n":"Mali","a":"","a2":"ML","a3":"MLI","n3":"466","sr":"011","r":"002"},{"n":"Malta","a":"","a2":"MT","a3":"MLT","n3":"470","sr":"039","r":"150"},{"n":"Marshall Islands","a":"","a2":"MH","a3":"MHL","n3":"584","sr":"057","r":"009"},{"n":"Martinique","a":"","a2":"MQ","a3":"MTQ","n3":"474","sr":"029","r":"019"},{"n":"Mauritania","a":"","a2":"MR","a3":"MRT","n3":"478","sr":"011","r":"002"},{"n":"Mauritius","a":"","a2":"MU","a3":"MUS","n3":"480","sr":"014","r":"002"},{"n":"Mayotte","a":"","a2":"YT","a3":"MYT","n3":"175","sr":"014","r":"002"},{"n":"Mexico","a":"","a2":"MX","a3":"MEX","n3":"484","sr":"013","r":"019"},{"n":"Micronesia","a":"Federated States of Micronesia","a2":"FM","a3":"FSM","n3":"583","sr":"057","r":"009"},{"n":"Moldova","a":"Republic of Moldova","a2":"MD","a3":"MDA","n3":"498","sr":"151","r":"150"},{"n":"Monaco","a":"","a2":"MC","a3":"MCO","n3":"492","sr":"155","r":"150"},{"n":"Mongolia","a":"","a2":"MN","a3":"MNG","n3":"496","sr":"030","r":"142"},{"n":"Montenegro","a":"","a2":"ME","a3":"MNE","n3":"499","sr":"039","r":"150"},{"n":"Montserrat","a":"","a2":"MS","a3":"MSR","n3":"500","sr":"029","r":"019"},{"n":"Morocco","a":"","a2":"MA","a3":"MAR","n3":"504","sr":"015","r":"002"},{"n":"Mozambique","a":"Moçambique","a2":"MZ","a3":"MOZ","n3":"508","sr":"014","r":"002"},{"n":"Myanmar","a":"Burma","a2":"MM","a3":"MMR","n3":"104","sr":"035","r":"142"},{"n":"Namibia","a":"","a2":"NA","a3":"NAM","n3":"516","sr":"018","r":"002"},{"n":"Nauru","a":"","a2":"NR","a3":"NRU","n3":"520","sr":"057","r":"009"},{"n":"Nepal","a":"","a2":"NP","a3":"NPL","n3":"524","sr":"034","r":"142"},{"n":"Netherlands","a":"","a2":"NL","a3":"NLD","n3":"528","sr":"155","r":"150"},{"n":"New Caledonia","a":"","a2":"NC","a3":"NCL","n3":"540","sr":"054","r":"009"},{"n":"New Zealand","a":"","a2":"NZ","a3":"NZL","n3":"554","sr":"053","r":"009"},{"n":"Nicaragua","a":"","a2":"NI","a3":"NIC","n3":"558","sr":"013","r":"019"},{"n":"Niger","a":"","a2":"NE","a3":"NER","n3":"562","sr":"011","r":"002"},{"n":"Nigeria","a":"","a2":"NG","a3":"NGA","n3":"566","sr":"011","r":"002"},{"n":"Niue","a":"","a2":"NU","a3":"NIU","n3":"570","sr":"061","r":"009"},{"n":"Norfolk Island","a":"","a2":"NF","a3":"NFK","n3":"574","sr":"053","r":"009"},{"n":"North Korea","a":"Democratic People's Republic of Korea","a2":"KP","a3":"PRK","n3":"408","sr":"030","r":"142"},{"n":"Northern Mariana Islands","a":"","a2":"MP","a3":"MNP","n3":"580","sr":"057","r":"009"},{"n":"Norway","a":"","a2":"NO","a3":"NOR","n3":"578","sr":"154","r":"150"},{"n":"Oman","a":"","a2":"OM","a3":"OMN","n3":"512","sr":"145","r":"142"},{"n":"Pakistan","a":"","a2":"PK","a3":"PAK","n3":"586","sr":"034","r":"142"},{"n":"Palau","a":"","a2":"PW","a3":"PLW","n3":"585","sr":"057","r":"009"},{"n":"Panama","a":"","a2":"PA","a3":"PAN","n3":"591","sr":"013","r":"019"},{"n":"Papua New Guinea","a":"","a2":"PG","a3":"PNG","n3":"598","sr":"054","r":"009"},{"n":"Paraguay","a":"","a2":"PY","a3":"PRY","n3":"600","sr":"005","r":"019"},{"n":"Peru","a":"","a2":"PE","a3":"PER","n3":"604","sr":"005","r":"019"},{"n":"Philippines","a":"","a2":"PH","a3":"PHL","n3":"608","sr":"035","r":"142"},{"n":"Pitcairn","a":"","a2":"PN","a3":"PCN","n3":"612","sr":"061","r":"009"},{"n":"Poland","a":"","a2":"PL","a3":"POL","n3":"616","sr":"151","r":"150"},{"n":"Portugal","a":"","a2":"PT","a3":"PRT","n3":"620","sr":"039","r":"150"},{"n":"Puerto Rico","a":"","a2":"PR","a3":"PRI","n3":"630","sr":"029","r":"019"},{"n":"Qatar","a":"","a2":"QA","a3":"QAT","n3":"634","sr":"145","r":"142"},{"n":"Reunion","a":"Réunion","a2":"RE","a3":"REU","n3":"638","sr":"014","r":"002"},{"n":"Romania","a":"","a2":"RO","a3":"ROU","n3":"642","sr":"151","r":"150"},{"n":"Russia","a":"Russian Federation","a2":"RU","a3":"RUS","n3":"643","sr":"151","r":"150"},{"n":"Rwanda","a":"","a2":"RW","a3":"RWA","n3":"646","sr":"014","r":"002"},{"n":"Samoa","a":"","a2":"WS","a3":"WSM","n3":"882","sr":"061","r":"009"},{"n":"San Marino","a":"","a2":"SM","a3":"SMR","n3":"674","sr":"039","r":"150"},{"n":"Sao Tome and Principe","a":"","a2":"ST","a3":"STP","n3":"678","sr":"017","r":"002"},{"n":"Sark","a":"","a2":"","a3":"","n3":"680","sr":"154","r":"150"},{"n":"Saudi Arabia","a":"","a2":"SA","a3":"SAU","n3":"682","sr":"145","r":"142"},{"n":"Senegal","a":"","a2":"SN","a3":"SEN","n3":"686","sr":"011","r":"002"},{"n":"Serbia","a":"","a2":"RS","a3":"SRB","n3":"688","sr":"039","r":"150"},{"n":"Seychelles","a":"","a2":"SC","a3":"SYC","n3":"690","sr":"014","r":"002"},{"n":"Sierra Leone","a":"","a2":"SL","a3":"SLE","n3":"694","sr":"011","r":"002"},{"n":"Singapore","a":"","a2":"SG","a3":"SGP","n3":"702","sr":"035","r":"142"},{"n":"Slovakia","a":"","a2":"SK","a3":"SVK","n3":"703","sr":"151","r":"150"},{"n":"Slovenia","a":"","a2":"SI","a3":"SVN","n3":"705","sr":"039","r":"150"},{"n":"Solomon Islands","a":"","a2":"SB","a3":"SLB","n3":"090","sr":"054","r":"009"},{"n":"Somalia","a":"","a2":"SO","a3":"SOM","n3":"706","sr":"014","r":"002"},{"n":"South Africa","a":"","a2":"ZA","a3":"ZAF","n3":"710","sr":"018","r":"002"},{"n":"South Korea","a":"Republic of Korea","a2":"KR","a3":"KOR","n3":"410","sr":"030","r":"142"},{"n":"South Sudan","a":"","a2":"SS","a3":"SSD","n3":"728","sr":"014","r":"002"},{"n":"Spain","a":"","a2":"ES","a3":"ESP","n3":"724","sr":"039","r":"150"},{"n":"Sri Lanka","a":"","a2":"LK","a3":"LKA","n3":"144","sr":"034","r":"142"},{"n":"St Barts","a":"Saint Barthélemy","a2":"BL","a3":"BLM","n3":"652","sr":"029","r":"019"},{"n":"St Helena","a":"Saint Helena","a2":"SH","a3":"SHN","n3":"654","sr":"011","r":"002"},{"n":"St Kitts and Nevis","a":"Saint Kitts and Nevis","a2":"KN","a3":"KNA","n3":"659","sr":"029","r":"019"},{"n":"St Lucia","a":"Saint Lucia","a2":"LC","a3":"LCA","n3":"662","sr":"029","r":"019"},{"n":"St Maarten","a":"Sint Maarten","a2":"SX","a3":"SXM","n3":"534","sr":"029","r":"019"},{"n":"St Martin","a":"Saint Martin","a2":"MF","a3":"MAF","n3":"663","sr":"029","r":"019"},{"n":"St Pierre and Miquelon","a":"Saint Pierre and Miquelon","a2":"PM","a3":"SPM","n3":"666","sr":"","r":"019"},{"n":"St Vincent","a":"Saint Vincent and the Grenadines","a2":"VC","a3":"VCT","n3":"670","sr":"029","r":"019"},{"n":"Palestine","a":"oPT","a2":"PS","a3":"PSE","n3":"275","sr":"145","r":"142"},{"n":"Sudan","a":"","a2":"SD","a3":"SDN","n3":"729","sr":"015","r":"002"},{"n":"Suriname","a":"","a2":"SR","a3":"SUR","n3":"740","sr":"005","r":"019"},{"n":"Svalbard","a":"Svalbard and Jan Mayen Islands","a2":"SJ","a3":"SJM","n3":"744","sr":"154","r":"150"},{"n":"Swaziland","a":"","a2":"SZ","a3":"SWZ","n3":"748","sr":"018","r":"002"},{"n":"Sweden","a":"","a2":"SE","a3":"SWE","n3":"752","sr":"154","r":"150"},{"n":"Switzerland","a":"","a2":"CH","a3":"CHE","n3":"756","sr":"155","r":"150"},{"n":"Syria","a":"Syrian Arab Republic","a2":"SY","a3":"SYR","n3":"760","sr":"145","r":"142"},{"n":"Tajikistan","a":"","a2":"TJ","a3":"TJK","n3":"762","sr":"143","r":"142"},{"n":"Tanzania","a":"United Republic of Tanzania","a2":"TZ","a3":"TZA","n3":"834","sr":"014","r":"002"},{"n":"Thailand","a":"","a2":"TH","a3":"THA","n3":"764","sr":"035","r":"142"},{"n":"Togo","a":"","a2":"TG","a3":"TGO","n3":"768","sr":"011","r":"002"},{"n":"Tokelau","a":"","a2":"TK","a3":"TKL","n3":"772","sr":"061","r":"009"},{"n":"Tonga","a":"","a2":"TO","a3":"TON","n3":"776","sr":"061","r":"009"},{"n":"Trinidad and Tobago","a":"","a2":"TT","a3":"TTO","n3":"780","sr":"029","r":"019"},{"n":"Tunisia","a":"","a2":"TN","a3":"TUN","n3":"788","sr":"015","r":"002"},{"n":"Turkey","a":"","a2":"TR","a3":"TUR","n3":"792","sr":"145","r":"142"},{"n":"Turkmenistan","a":"","a2":"TM","a3":"TKM","n3":"795","sr":"143","r":"142"},{"n":"Turks and Caicos Islands","a":"","a2":"TC","a3":"TCA","n3":"796","sr":"029","r":"019"},{"n":"Tuvalu","a":"","a2":"TV","a3":"TUV","n3":"798","sr":"061","r":"009"},{"n":"UAE","a":"United Arab Emirates","a2":"AE","a3":"ARE","n3":"784","sr":"145","r":"142"},{"n":"Uganda","a":"","a2":"UG","a3":"UGA","n3":"800","sr":"014","r":"002"},{"n":"UK","a":"United Kingdom of Great Britain and Northern Ireland","a2":"GB","a3":"GBR","n3":"826","sr":"154","r":"150"},{"n":"Ukraine","a":"","a2":"UA","a3":"UKR","n3":"804","sr":"151","r":"150"},{"n":"Uruguay","a":"","a2":"UY","a3":"URY","n3":"858","sr":"005","r":"019"},{"n":"US Virgin Islands","a":"United States Virgin Islands","a2":"VI","a3":"VIR","n3":"850","sr":"029","r":"019"},{"n":"USA","a":"United States of America","a2":"US","a3":"USA","n3":"840","sr":"","r":"019"},{"n":"Uzbekistan","a":"","a2":"UZ","a3":"UZB","n3":"860","sr":"143","r":"142"},{"n":"Vanuatu","a":"","a2":"VU","a3":"VUT","n3":"548","sr":"054","r":"009"},{"n":"Venezuela","a":"Bolivarian Republic of Venezuela","a2":"VE","a3":"VEN","n3":"862","sr":"005","r":"019"},{"n":"Vietnam","a":"Viet Nam","a2":"VN","a3":"VNM","n3":"704","sr":"035","r":"142"},{"n":"Wallis and Futuna Islands","a":"","a2":"WF","a3":"WLF","n3":"876","sr":"061","r":"009"},{"n":"Western Sahara","a":"","a2":"EH","a3":"ESH","n3":"732","sr":"015","r":"002"},{"n":"Yemen","a":"","a2":"YE","a3":"YEM","n3":"887","sr":"145","r":"142"},{"n":"Zambia","a":"","a2":"ZM","a3":"ZMB","n3":"894","sr":"014","r":"002"},{"n":"Zimbabwe","a":"","a2":"ZW","a3":"ZWE","n3":"716","sr":"014","r":"002"},{"n":"Area 1","a":"Area1","a2":"","":"","n3":"","sr":"","r":"002"},{"n":"Global","a":"","a2":"","":"","n3":"","sr":"","r":"001"}];

var $header = $('<header/>',{'id': 'header', 'class': 'noselect'}),
	$main = $('<div/>',{'id': 'main'}),
	$content = $('<section/>',{'id': 'content'}),
	$sidebar = $('<section/>',{'id': 'sidebar'}),
	$footer = $('<footer/>',{'id': 'footer', 'class': 'noselect'});

function softAlert(message,type,closeable) {
	var timestamp = new Date().getTime();
	var $alertdiv = $('<div/>',{'id': 'alert-'+timestamp, 'class': 'alert'+((type)?' alert-'+type:''), 'html': message});
	if (closeable) {
		$('<span/>',{'class': 'close', 'title': 'Dismiss'}).appendTo($alertdiv).on('click', function() {
			$alertdiv.remove();
		});
	}
	$alertdiv.prependTo($main);
	$('#wrapper').scrollTop(0);
};

// Set up some variables that are used throughout the promise
var listPOs,
	listStartYears,
	listRegionCodes,
	listDonors,
	listCostCentres = [],
	listColumnsGrants = [],
	listColumnCostCentres = [],
	listColumnDeadlines = [];

alasql.promise('SELECT * FROM XLSX("'+xlsxurl+'",{sheetid:"Grants"})').then(function(grants) {
	
	listPOs = alasql('SELECT COLUMN DISTINCT [PO name] FROM ? WHERE [PO name] NOT NULL ORDER BY [PO name]',[grants]);
	listPOs.unshift('No Assigned PO')
	
	// Map and fix stuff in the grants array before creating a table
	grants.map(function(i) {
		Object.keys(i).forEach(function(key) {
			listColumnsGrants.push(key); // this is extremely wasteful, but for now it's the only way to list columns
			var k = toSlug(key);
			if (k !== key) {
				i[k] = i[key];
				delete i[key];
			}
			if (k.substring(0, 5) == 'date_' || k.substring(0, 9) == 'deadline_') { i[k] = excelDate(i[k]) } // if column name starts with "date_" or "deadline_" then convert to proper JS date
		});
		
		i['id'] = i['id'].toString();
		i['date_disbursement'] = i['date_disbursement'] || i['date_decision']; // if date of disbursenent is not defined, use decision date instead
		
		if (!i['po_name']) i['po_name'] = listPOs[0]; // add "No Assigned PO"
		i['po_id'] = listPOs.indexOf(i['po_name']); // assign ID numbers to POs

		i['country'] = (i['country']) ? i['country'].split(', ') : ['Global']; // split when a grant is given unearmarked to several countries, if no country specified then set "Global"
		
		if(i['partner']) i['partner'] = i['partner'].split(', ');
		if(i['sector']) i['sector'] = i['sector'].split(', ');
		
		// This will convert the country names into ISO 3166-2 codes (incl. alpha-2, alpha-3, num-3 and region codes)
		i['code_alpha2'] = [], i['code_alpha3'] = [], i['code_num3'] = [], i['code_subregion'] = [], i['code_region'] = [];
		var country_temp = [];
		for (var ii = 0; ii < i['country'].length; ii++) {
			var c = i['country'][ii];
			for (var iii = 0; iii < countries.length; iii++) {
				var cc = countries[iii];
				if (cc.n == c || cc.a == c) {
					i['code_alpha2'].push(cc.a2);
					i['code_alpha3'].push(cc.a3);
					i['code_num3'].push(cc.n3);
					i['code_subregion'].push(cc.sr);
					i['code_region'].push(cc.r);
					country_temp.push(cc.n);
				}
			}
		};
		i['country'] = country_temp; //this is to change all alternate country names to the usual names ("a" to "n")







		
	});
	listColumnsGrants = unique(listColumnsGrants).sort();

	for (var i = 0; i < listColumnsGrants.length; i++) {
		if (listColumnsGrants[i].substring(0, 11) == 'Cost centre') listColumnCostCentres.push(listColumnsGrants[i])
		else if (listColumnsGrants[i].substring(0, 8) == 'Deadline') listColumnDeadlines.push(toSlug(listColumnsGrants[i]));
		listColumnsGrants[i] = toSlug(listColumnsGrants[i]);
	};
		
	// Make a list of columns and cost centres
	for (var i = 0; i < listColumnCostCentres.length; i++) {
		var c = listColumnCostCentres[i];
		var cc = c.slice(12).split(', '),
			ccNumber = cc[0],
			ccDonor = cc[1],
			ccName = cc[2];
		listCostCentres.push({'donor': ccDonor, 'name': ccName, 'number': ccNumber, 'column_name': toSlug(c)});
		listColumnCostCentres[i] = toSlug(listColumnCostCentres[i]);
	};
	listCostCentres = alasql('SELECT donor, ARRAY(name) name, ARRAY(number) number, ARRAY(column_name) column_name FROM ? GROUP BY donor',[listCostCentres]);
	alasql('CREATE TABLE costcentre; SELECT * INTO costcentre FROM ?',[listCostCentres]);
	
	listDonors = alasql('SELECT COLUMN DISTINCT donor FROM costcentre');
	
	function nextDate(startDate, dates) {
		var startTime = +startDate;
		var nearestDate, nearestDiff = Infinity;
		for(var i = 0, n = dates.length;  i < n;  ++i) {
			var diff = +dates[i] - startTime;
			if(/*diff > 0 && */diff < nearestDiff) {
				nearestDiff = diff;
				nearestDate = dates[i];
			}
		}
		return nearestDate;
	}
	
	alasql.fn.flatArray = function(s) {
		return unique(s.join(',').split(',')).filter(function(v){return v!==''});
	}
	
	alasql.fn.upComing = function(arr) {
		var shortList = [];
		for (var i = 0; i < arr.length; i++) {
			if (moment(arr[i]).isBetween(moment().subtract(0.5, 'months'), moment().add(1, 'months'))) shortList.push(arr[i]); // the date is in less than a month or has passed less than half a month ago
		}
		return nextDate(new Date(), shortList);
	}

	// This function is used in the alaSQL query below for dinamically querying certain type of columns that might change in the future (e.g. new cost centres)
	function printQuery(list) {
		var res = [];
		for (var i in listCostCentres) {
			if (listCostCentres.hasOwnProperty(i)) {
				var column = listCostCentres[i],
					donor = toSlug(column['donor']),
					resArr = [];
				for (var c in column['column_name']) {
					resArr.push('SUM('+column['column_name'][c]+')');
				}
				if (!list) res.push(resArr.join('+')+' AS cost_'+donor); // this lists the donors and sums them
				else res.push('cost_'+donor, 'cost_all'); // this just lists the donors, used for declaring the columns
			}
		};
		if (!list) res.push('SUM('+listColumnCostCentres.join(')+SUM(')+') AS cost_all'); // this is a bit ugly but efficient
		if (!list) {
			for (var i = 0; i < listColumnDeadlines.length; i++) {
				res.push('upComing(ARRAY('+listColumnDeadlines[i]+')) AS '+listColumnDeadlines[i].replace('deadline_', 'deadline_closest_'));
			}			
		}
		else res = res.concat(listColumnDeadlines.map(function(i){return i.replace('deadline_', 'deadline_closest_');}));
		return res;
	};
	
	// CEILING(DATEDIFF(day, NEW Date(), NEW Date(MAX(date_project_end)))) AS days_left, 

	alasql('CREATE TABLE grant ('+listColumnsGrants+'); SELECT * INTO grant FROM ?',[grants]);
	alasql('CREATE TABLE project (id, code, coop, date_project_start, date_project_end, '+printQuery(true)+', level, title, country, code_alpha2, code_alpha3, code_num3, code_subregion, code_region, partner, sector, target_number, beneficiaries, deployment, monitoring_visit, po_id, po_name, link_url, link_last_db, link_pr_appeal, link_appeal, fundraising_number); \
			SELECT id, \
			LAST(DISTINCT code) AS code, \
			FIRST(coop) coop, \
			NEW Date(MIN(date_project_start)) AS date_project_start, \
			NEW Date(MAX(date_project_end)) AS date_project_end, '
			+printQuery()+', \
			FIRST([level]) level, \
			FIRST([title]) title, \
			flatArray(ARRAY(DISTINCT country)) country, \
			flatArray(ARRAY(DISTINCT code_alpha2)) code_alpha2, \
			flatArray(ARRAY(DISTINCT code_alpha3)) code_alpha3, \
			flatArray(ARRAY(DISTINCT code_num3)) code_num3, \
			flatArray(ARRAY(DISTINCT code_subregion)) code_subregion, \
			flatArray(ARRAY(DISTINCT code_region)) code_region, \
			flatArray(ARRAY(DISTINCT partner_name)) partner, \
			flatArray(ARRAY(DISTINCT sector)) sector, \
			flatArray(ARRAY(DISTINCT beneficiaries)) beneficiaries, \
			SUM(target_number) target_number, \
			ARRAY(DISTINCT deployment) deployment, \
			ARRAY(DISTINCT monitoring_visit) monitoring_visit, \
			LAST(DISTINCT po_id) po_id, \
			LAST(DISTINCT po_name) po_name, \
			LAST(DISTINCT link_url) link_url, \
			LAST(DISTINCT link_db) link_last_db, \
			LAST(DISTINCT link_pr_appeal) link_pr_appeal, \
			LAST(DISTINCT link_appeal) link_appeal, \
			LAST(DISTINCT fundraising_number) fundraising_number \
			INTO project \
			FROM grant \
			WHERE id != ? \
			GROUP BY id \
			ORDER BY date_project_start');
			

		
	listStartYears = alasql('SELECT COLUMN DISTINCT YEAR([date_project_start]) FROM project');
	
	
	console.log(alasql('SELECT * FROM project'))
	
	
	
	
	
	
	



}).catch(function(reason) {
	console.log('%c'+reason['message'],'color: red; font-family: monospace');
	softAlert('Something went wrong','danger',true);
}).then(function() {
	
	/* ================ MORE OR LESS ALL THE DOM STUFF IF BELOW THIS LINE ================ */

	/* TinySort 2.3.6 by Ron Valstar http://tinysort.sjeiti.com/ */
	!function(e,t){"use strict";function r(){return t}"function"==typeof define&&define.amd?define("tinysort",r):e.tinysort=t}(this,function(){"use strict";function e(e,n){function s(){0===arguments.length?v({}):t(arguments,function(e){v(x(e)?{selector:e}:e)}),d=$.length}function v(e){var t=!!e.selector,n=t&&":"===e.selector[0],o=r(e||{},m);$.push(r({hasSelector:t,hasAttr:!(o.attr===l||""===o.attr),hasData:o.data!==l,hasFilter:n,sortReturnNumber:"asc"===o.order?1:-1},o))}function S(){t(e,function(e,t){M?M!==e.parentNode&&(k=!1):M=e.parentNode;var r=$[0],n=r.hasFilter,o=r.selector,a=!o||n&&e.matchesSelector(o)||o&&e.querySelector(o),l=a?R:V,s={elm:e,pos:t,posn:l.length};B.push(s),l.push(s)}),D=R.slice(0)}function y(e,t,r){for(var n=r(e.toString()),o=r(t.toString()),a=0;n[a]&&o[a];a++)if(n[a]!==o[a]){var l=Number(n[a]),s=Number(o[a]);return l==n[a]&&s==o[a]?l-s:n[a]>o[a]?1:-1}return n.length-o.length}function N(e){for(var t,r,n=[],o=0,a=-1,l=0;t=(r=e.charAt(o++)).charCodeAt(0);){var s=46==t||t>=48&&57>=t;s!==l&&(n[++a]="",l=s),n[a]+=r}return n}function C(e,r){var n=0;for(0!==p&&(p=0);0===n&&d>p;){var l=$[p],s=l.ignoreDashes?f:u;if(t(h,function(e){var t=e.prepare;t&&t(l)}),l.sortFunction)n=l.sortFunction(e,r);else if("rand"==l.order)n=Math.random()<.5?1:-1;else{var c=a,g=w(e,l),m=w(r,l),v=""===g||g===o,S=""===m||m===o;if(g===m)n=0;else if(l.emptyEnd&&(v||S))n=v&&S?0:v?1:-1;else{if(!l.forceStrings){var C=x(g)?g&&g.match(s):a,b=x(m)?m&&m.match(s):a;if(C&&b){var A=g.substr(0,g.length-C[0].length),F=m.substr(0,m.length-b[0].length);A==F&&(c=!a,g=i(C[0]),m=i(b[0]))}}n=g===o||m===o?0:l.natural&&(isNaN(g)||isNaN(m))?y(g,m,N):m>g?-1:g>m?1:0}}t(h,function(e){var t=e.sort;t&&(n=t(l,c,g,m,n))}),n*=l.sortReturnNumber,0===n&&p++}return 0===n&&(n=e.pos>r.pos?1:-1),n}function b(){var e=R.length===B.length;if(k&&e)O?R.forEach(function(e,t){e.elm.style.order=t}):M?M.appendChild(A()):console.warn("parentNode has been removed");else{var t=$[0],r=t.place,n="org"===r,o="start"===r,a="end"===r,l="first"===r,s="last"===r;if(n)R.forEach(F),R.forEach(function(e,t){E(D[t],e.elm)});else if(o||a){var c=D[o?0:D.length-1],i=c&&c.elm.parentNode,u=i&&(o&&i.firstChild||i.lastChild);u&&(u!==c.elm&&(c={elm:u}),F(c),a&&i.appendChild(c.ghost),E(c,A()))}else if(l||s){var f=D[l?0:D.length-1];E(F(f),A())}}}function A(){return R.forEach(function(e){q.appendChild(e.elm)}),q}function F(e){var t=e.elm,r=c.createElement("div");return e.ghost=r,t.parentNode.insertBefore(r,t),e}function E(e,t){var r=e.ghost,n=r.parentNode;n.insertBefore(t,r),n.removeChild(r),delete e.ghost}function w(e,t){var r,n=e.elm;return t.selector&&(t.hasFilter?n.matchesSelector(t.selector)||(n=l):n=n.querySelector(t.selector)),t.hasAttr?r=n.getAttribute(t.attr):t.useVal?r=n.value||n.getAttribute("value"):t.hasData?r=n.getAttribute("data-"+t.data):n&&(r=n.textContent),x(r)&&(t.cases||(r=r.toLowerCase()),r=r.replace(/\s+/g," ")),null===r&&(r=g),r}function x(e){return"string"==typeof e}x(e)&&(e=c.querySelectorAll(e)),0===e.length&&console.warn("No elements to sort");var D,M,q=c.createDocumentFragment(),B=[],R=[],V=[],$=[],k=!0,z=e.length&&e[0].parentNode,L=z.rootNode!==document,O=e.length&&(n===o||n.useFlex!==!1)&&!L&&-1!==getComputedStyle(z,null).display.indexOf("flex");return s.apply(l,Array.prototype.slice.call(arguments,1)),S(),R.sort(C),b(),R.map(function(e){return e.elm})}function t(e,t){for(var r,n=e.length,o=n;o--;)r=n-o-1,t(e[r],r)}function r(e,t,r){for(var n in t)(r||e[n]===o)&&(e[n]=t[n]);return e}function n(e,t,r){h.push({prepare:e,sort:t,sortBy:r})}var o,a=!1,l=null,s=window,c=s.document,i=parseFloat,u=/(-?\d+\.?\d*)\s*$/g,f=/(\d+\.?\d*)\s*$/g,h=[],d=0,p=0,g=String.fromCharCode(4095),m={selector:l,order:"asc",attr:l,data:l,useVal:a,place:"org",returns:a,cases:a,natural:a,forceStrings:a,ignoreDashes:a,sortFunction:l,useFlex:a,emptyEnd:a};return s.Element&&function(e){e.matchesSelector=e.matchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,r=(t.parentNode||t.document).querySelectorAll(e),n=-1;r[++n]&&r[n]!=t;);return!!r[n]}}(Element.prototype),r(n,{loop:t}),r(e,{plugin:n,defaults:m})}());

	// Returns an s for English plurals if number is more than 1
	function pl(n) {
		if (n >= 2) return 's'; else return '';
	}
	
	// Update calculator in sidebar
	function updCalc() {
		var n = $('#projects > li:visible').length;
		if (n>0) $('#calculator').show().html('<span>Showing <b>'+n+'</b> project'+pl(n)+'</span>');
		else $('#calculator').empty().hide();
	}

	// Creates acronyms of strings
	function acr(s) {
		var words, acronym, nextWord;
		words = s.split(' ');
		acronym = "";
		index = 0
		while (index < words.length) {
			nextWord = words[index];
			acronym = acronym + nextWord.charAt(0);
			index = index + 1;
		}
		return acronym;
	};

	// Returns a string of how much time is left to a certain date using Moment.js
	function timeLeft(date) {
		var yearsLeft = -moment().diff(date,'years',true).toFixed(1),
			monthsLeft = -moment().diff(date,'months'),
			daysLeft = -moment().diff(date,'days');
		return (monthsLeft > 12) ? yearsLeft + ' year' + pl(yearsLeft) + ' left':
			   (monthsLeft > 1) ?  monthsLeft + ' month' + pl(monthsLeft) + ' left' : 
								   daysLeft + ' day' + pl(daysLeft) +  ' left';			
	};	
	
/* 	
	$.fn.extend({
		toggleAttr: function (attr, turnOn) {
			var justToggle = (turnOn === undefined);
			return this.each(function () {
				if ((justToggle && !$(this).is("[" + attr + "]")) ||
					(!justToggle && turnOn)) {
					$(this).attr(attr, attr);
				} else {
					$(this).removeAttr(attr);
				}
			});
		}
	});
*/
	var classesPO = [], classesYears = [], classesRegions = [];
		
	function filterProject() {
		$('#projects>li').hide();
		$('#projects').find(classesPO.join()).show();
		
		updCalc();
		window.scrollTo(0,0);
		
		console.log(classesPO);
		console.log(classesYears);
	};
	
	var $resetButton = $('<span/>',{'id': 'reset', 'class': 'filter'})
						.append($('<span/>',{'class': 'start on', 'title': 'Show all active projects from the last 2 years (TAB)', 'text': 'Start'})
							.on('click', function() { $(this).hide().siblings('.reset').show(); $('#projects li').show(); updCalc(); }))
						.append($('<span/>',{'class': 'showall', 'title': '', 'text': 'Show all'})
							.on('click', function() { $('#projects li').show(); }))
						.append($('<span/>',{'class': 'reset', 'title': 'Reset everything (ESC)', 'text': 'Reset'})
							.on('click', function() { $(this).hide().siblings('.start').show(); $('#projects li').hide(); updCalc(); }))
						.append($('<span/>',{'class': 'back', 'title': 'Go back', 'html': '<span>Back</span><svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>'}));
	
	
	function toggleMenu(b) {
		var $menu = b.parent();
		if ($menu.hasClass('on')) $menu.removeClass('on')
			else {
				$menu.siblings('.menu').removeClass('on');
				$menu.addClass('on');
			}
	};
	
	var $selectPO = $('<div>',{'id': 'POs', 'class': 'menu', html: '<ul></ul>'})
						.prepend($('<span/>',{'class': 'filter', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'})
							.on('click', function() { toggleMenu($(this)); })),
		$selectYear = $('<div>',{'id': 'years', 'class': 'menu', html: '<ul></ul>'})
						.prepend($('<span/>',{'class': 'filter', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'})
							.on('click', function() { toggleMenu($(this)); })),
		$selectRegion = $('<div>',{'id': 'regions', 'class': 'menu', html: '<ul></ul>'})
						.prepend($('<span/>',{'class': 'filter', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm4 8h-3v3h-2v-3H8V8h3V5h2v3h3v2z"/></svg>'})
							.on('click', function() { toggleMenu($(this)); }));
				
	for (var i = 0; i < listPOs.length; i++) {
		var p = listPOs[i];
		$('<li/>',{'id': 'PO-' + i, 'data-filter': '.PO-' + i, 'class': 'filter', 'text': (i!=0) ? acr(p) : 'N/A', 'title' : (i!=0) ? p.substr(0, p.indexOf(' ')) : p})
			.appendTo($selectPO.find('ul'))
			.on('click', function() {
				$(this).toggleClass('on');
				toggleArrayItem($(this).data('filter'), classesPO);
				filterProject();
			});
	};
				
	for (var i = 0; i < listStartYears.length; i++) {
		var y = listStartYears[i];
		$('<li/>',{'id': 'y-' + y, 'data-filter': '.y-' + y, 'class': 'filter', 'text': y})
			.appendTo($selectYear.find('ul'))
			.on('click', function() {
				$(this).toggleClass('on');
				toggleArrayItem($(this).data('filter'), classesYears);
				filterProject();
			});
	};

	for (var i = 0; i < listStartYears.length; i++) {
		var r = listStartYears[i];
		$('<li/>',{'id': 'r-' + r, 'data-filter': '.r-' + r, 'class': 'filter', 'text': r})
			.appendTo($selectRegion.find('ul'))
			.on('click', function() {
				$(this).toggleClass('on');
				toggleArrayItem($(this).data('filter'), classesRegions);
				filterProject();
			});
	};

	$pages = $('<div/>',{'class': 'right'})
				.append($('<div/>',{'id': 'showSidebar', 'class': 'menu'})
					.append($('<span/>',{'class': 'filter', title: 'Toggle sidebar', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>'})
						.on('click', function() { $('#sidebar').toggle(); })))
				.append($('<div/>',{'id': 'stats', 'class': 'menu'})
					.append($('<span/>',{'class': 'filter', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'})
						.on('click', function() { softAlert('Statistics is not implemented yet','warning',true) })))
				.append($('<form/>',{'id': 'search', 'class': 'menu'})
					.append($('<span/>',{'class': 'filter', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 	14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'})
						.on('click', function() { softAlert('Search is not implemented yet','warning',true) })));
	
	
	
	$header.append($resetButton, $selectPO, $selectRegion, $selectYear, $pages);

	$footer.append($('<div/>',{'class': 'right'})
				.append('<svg id="logo-cos" width="134" height="23" viewBox="0 0 645.2 110" xmlns="http://www.w3.org/2000/svg"><path class="st2" d="M578.4 0v32.2c0 12.8 3.5 20 9.6 26 6.1 6 14.6 9.3 23.8 9.3 9.2 0 17.8-3.3 23.8-9.3 6-6 9.6-13.2 9.6-26V0H578.4z"></path><path class="st0" d="M645.2 22.3h-22.3V0h-22.3v22.3H578.4v10c0 4.8 0.5 8.8 1.4 12.3h20.8V65.9c3.5 1.1 7.3 1.7 11.1 1.7 3.9 0 7.6-0.6 11.1-1.7V44.5h20.8c0.9-3.5 1.4-7.5 1.4-12.3V22.3z"></path><path class="st2" d="M625 30c-1.2-1.7-3.6-1.7-4.8-0.1 2.5 1 2.7 3.5 1.6 5.4 0 0-1.2-1-4.9-1.1 -1.9-0.1-2.7-0.1-2.7-0.1 -0.3-3.3 1.9-4.8 4.1-4.6 -0.2-2.2-3-2.6-4.2-1.9 0.9-2.5-2.3-4.7-2.3-4.7s-3.3 2.2-2.3 4.7c-1.2-0.7-4-0.3-4.2 1.9 2.2-0.1 4.4 1.3 4.1 4.6 0 0-0.8 0-2.7 0.1 -3.7 0.2-4.9 1.1-4.9 1.1 -1.1-2-0.9-4.4 1.6-5.4 -1.2-1.7-3.6-1.7-4.8 0.1 -1.2-2.5-4.7-1.9-4.7-1.9 2.6 3.4 5.4 8.1 7.4 12.3 0.8-0.5 2.7-1.3 5.5-1.5 2.8-0.2 5-0.2 5-0.2s2.2 0 5 0.2c2.8 0.2 4.7 1.1 5.5 1.5 2-4.2 4.8-8.9 7.4-12.3C629.7 28.1 626.2 27.4 625 30z"></path><path class="st1" d="M337.8 28.7c-6.6-2.8-9.5-4.1-9.5-8 0-3.8 3.6-6.5 8.8-6.5 5.1 0 9 2.7 10.1 3.6l3.9-5.9c-1.6-1.3-6.7-5-14.7-5 -9.9 0-16.9 5.9-16.9 14.5 0 9.9 8.9 13.1 12.9 14.9 4.9 2.2 10.6 3.9 10.6 9.1 0 4.5-3.2 7.5-9.1 7.5 -6.2 0-11-3.7-12-4.3 -0.1-0.1-0.2-0.2-0.2-0.2l-3.9 6.2c0 0 0.1 0.1 0.2 0.2l0 0c0.9 0.9 7.1 5.7 16.4 5.7 11.1 0 17.6-6.5 17.6-15.9C352.2 35.4 345.2 31.9 337.8 28.7z"></path><path class="st1" d="M71.7 59.4V38.8c0-4.8-0.1-7.5-1.8-9.2 -0.7-0.7-2.3-1.6-4.7-1.6 -4.2 0-7.9 2.4-8.4 2.8v28.6h-8.5V3.7h8.5v20.2c0 0 4.6-3.2 10.1-3.2 4.6 0 7.6 1.7 9.4 3.5 3.9 3.9 3.8 8.7 3.8 14.2v21H71.7z"></path><path class="st1" d="M112.3 59.4v-2.8c-0.6 0.5-5.3 3.8-11.2 3.8 -4.6 0-7.5-1.6-9.4-3.5 -3.9-3.9-3.8-8.7-3.8-14.2V21.8h8.5V42.3c0 4.8 0.1 7.5 1.8 9.2 0.8 0.8 2.2 1.6 4.8 1.6 4.4 0 7.9-2.5 8.2-2.8V21.8h8.5v37.6H112.3z"></path><path class="st1" d="M210.6 59.4V38.8c0-4.8-0.1-7.5-1.8-9.2 -0.7-0.7-2.3-1.6-4.7-1.6 -4.2 0-7.9 2.4-8.4 2.8v28.6h-8.5V3.7h8.5v20.2c0 0 4.6-3.2 10.1-3.2 4.6 0 7.6 1.7 9.4 3.5 3.9 3.9 3.8 8.7 3.8 14.2v21H210.6z"></path><path class="st1" d="M255.5 60.3c-10.8 0-18.2-7.9-18.2-19.6 0-11.8 7.6-19.9 18.9-19.9 10.8 0 18.2 7.9 18.2 19.6C274.4 52.2 266.8 60.3 255.5 60.3zM255.8 27.7c-6 0-9.9 5-9.9 12.6 0 7.8 4.3 12.9 10.2 12.9 6.2 0 9.8-4.9 9.8-12.6C265.8 32.9 261.6 27.7 255.8 27.7z"></path><path class="st1" d="M303.4 11.6c-0.4-0.2-2.8-1.7-5.5-1.7 -1.5 0-3.2 0.3-4.3 1.5 -1.8 1.8-1.8 4.2-1.8 7.2v3.3h11.4v6.9h-11.4v30.6h-8.5V28.7h-6.3v-6.9h6.3v-3.2c0-5.2 0.6-9.1 3.8-12.3 2.2-2.2 5.2-3.5 9.6-3.5 5.9 0 9.6 2.9 9.9 3.2L303.4 11.6z"></path><path class="st1" d="M397.2 59.4h-9.1l-7.6-28.3 -7.5 28.3h-8.9l-10.2-37.6h8.2l7 28.5 7.6-28.5h8.2l7.5 28.5 7.3-28.5h7.9L397.2 59.4z"></path><path class="st1" d="M443.6 43.1h-25.5c0 4.5 2.8 10.4 10.7 10.4 5.2 0 9.2-2.3 10.3-2.8l2.9 5.5c-0.4 0.2-5.8 4.1-13.9 4.1 -11.8 0-18.3-8.4-18.3-19.5 0-11.8 7.2-20.1 17.8-20.1 10.2 0 16.2 7.4 16.2 19.4C443.7 41.4 443.6 42.5 443.6 43.1zM427.7 27.2c-5.2 0-8.9 3.9-9.6 9.6h17.6C435.7 33.6 434.4 27.2 427.7 27.2z"></path><path class="st1" d="M475.8 59.4v-2.7c-0.5 0.4-4.3 3.6-10.4 3.6 -10.1 0-16.8-7.9-16.8-19.2 0-11.9 8.1-20.3 18.2-20.3 4.8 0 7.5 1.7 7.9 1.9V3.7h8.5v55.7H475.8zM474.7 29.8c-0.7-0.5-3-2-6.6-2 -6.3 0-10.9 4.7-10.9 13.1 0 7.7 4.5 12.4 10 12.4 4.1 0 6.9-2.2 7.5-2.6V29.8z"></path><path class="st1" d="M522.8 43.1h-25.5c0 4.5 2.8 10.4 10.7 10.4 5.2 0 9.2-2.3 10.3-2.8l2.9 5.5c-0.4 0.2-5.8 4.1-13.9 4.1 -11.8 0-18.3-8.4-18.3-19.5 0-11.8 7.2-20.1 17.8-20.1 10.2 0 16.2 7.4 16.2 19.4C523 41.4 522.8 42.5 522.8 43.1zM507 27.2c-5.2 0-8.9 3.9-9.6 9.6h17.6C515 33.6 513.7 27.2 507 27.2z"></path><path class="st1" d="M552.7 59.4V38.8c0-4.9-0.1-7.5-1.8-9.2 -0.7-0.7-2.3-1.6-4.7-1.6 -4.2 0-7.9 2.4-8.4 2.8v28.6h-8.5v-37.6h7.4v2.8c0.6-0.5 5.3-3.9 11.2-3.9 4.6 0 7.6 1.7 9.4 3.5 3.9 3.9 3.8 8.7 3.8 14.2v21H552.7z"></path><path class="st1" d="M150.8 21.3c-0.6-0.2-1.8-0.6-3.5-0.6 -7.6 0-11.9 5.3-12.2 5.9v-4.8h-7.4v37.6h8.5V33.7c0.8-1.2 4-5.8 10.9-5.8 0.8 0 2 0.1 2.5 0.2L150.8 21.3z"></path><path class="st1" d="M178.4 50.9c-1.5 0.8-4.7 2.3-8.7 2.3 -7.1 0-11.2-5.3-11.2-12.8 0-6.5 4.2-12.7 11.5-12.7 3.6 0 6.2 1.3 7.6 2.1l3.4-5.6c-1.8-1.3-5.8-3.5-11.5-3.5 -11.2 0-19.6 8.5-19.6 20.3 0 11.3 7.5 19.2 18.8 19.2 6.1 0 10.5-2.2 12.6-3.5L178.4 50.9z"></path><path class="st1" d="M38.7 49.2c-1.9 1.1-6.6 3.5-12.3 3.5 -10.5 0-17.2-7.6-17.2-19.2 0-11.9 7.9-18.9 17.7-18.9 5.6 0 9.7 2.2 11.4 3.3l3.5-6.5C39.5 9.7 34.3 6.9 26.4 6.9 11.7 6.9 0 17 0 34.1c0 16.6 11.1 26.3 25.4 26.3 8.6 0 14.4-3.2 16.8-4.8L38.7 49.2z"></path><text class="st1" x="0" y="110" style="font: 50px Arial;">HUMANITARIAN TEAM</text></svg>\
				<svg id="logo-act" height="14" viewBox="0 0 575.7 85.4" width="94" xmlns="http://www.w3.org/2000/svg"><path class="s0" d="M32.9 85.2c9.8 0 16.1-2.8 19.7-9.2v7.8h14.3V20.5H52.5v7.7c-4.1-6.3-10.7-9.3-19.9-9.3-9.5 0-17.1 3.1-23.5 9.8C3.2 34.8 0 43 0 51.9 0 70.7 14 85.2 32.9 85.2M33.1 33.5c9.3 0 17.8 8.2 17.8 18.9 0 9.8-8.4 18-17.6 18-9.9 0-18.3-7.8-18.3-18.7C15.1 41.4 23.3 33.5 33.1 33.5M104.5 85.4c13.4 0 23.9-6.6 29.1-18l-13.4-6.6c-2.6 6.7-7.9 10.1-15.8 10.1-10.4 0-18-8-18-18.7 0-11.1 7.7-19 17.6-19 7.5 0 12.9 3.3 16.4 9.8l13.3-6.6C128.4 25.1 117.6 18.5 104.7 18.5c-9.5 0-17.9 3.7-24.5 10.6-6 6.3-9.1 14.1-9.1 23 0 8.4 3.4 17.1 9.5 23.3C87 81.9 95 85.4 104.5 85.4"/><polygon class="s0" points="152 83.8 166.7 83.8 166.7 33.6 183.8 33.6 183.8 20.5 166.7 20.5 166.7 0 152 0 152 20.5 134.3 20.5 134.3 33.6 152 33.6"/><path class="s1" d="M214.2 85.2c9.8 0 16.1-2.8 19.7-9.2v7.8h14.3V20.5h-14.4v7.7c-4.1-6.2-10.7-9.3-19.9-9.3-9.5 0-17.1 3.1-23.5 9.8-5.9 6.1-9.1 14.4-9.1 23.2C181.3 70.7 195.3 85.2 214.2 85.2M214.4 33.5c9.3 0 17.8 8.3 17.8 18.9 0 9.8-8.4 18-17.6 18-9.9 0-18.3-7.8-18.3-18.7C196.4 41.4 204.6 33.5 214.4 33.5"/><polygon class="s1" points="268.4 6.2 261.2 6.2 254 6.2 254 83.8 268.4 83.8"/><polygon class="s1" points="288.7 6.2 281.9 6.2 274.3 6.2 274.3 83.8 288.7 83.8"/><path class="s1" d="M365.4 28.2c-4.1-6.2-10.7-9.3-19.9-9.3-9.5 0-17.1 3.1-23.5 9.8-5.9 6.1-9.1 14.4-9.1 23.2 0 18.9 14 33.4 32.9 33.4 9.8 0 16.1-2.8 19.7-9.2v7.8h14.3V20.5h-14.4V28.2zM346.3 70.4c-9.9 0-18.3-7.8-18.3-18.7 0-10.3 8.3-18.1 18-18.1 9.3 0 17.8 8.3 17.8 18.9C363.9 62.1 355.5 70.4 346.3 70.4M417 19.2c-7.2 0-12.6 2.7-17 8.5V20.5h-14.4v63.3h14.3V56.7c0-15.3 3.1-23.1 13.8-23.1 10.7 0 13.1 7.2 13.1 22.2v28.1h14.7V50.3c0-8.3-0.3-14.8-4.1-20.7C432.9 22.8 426.2 19.2 417 19.2M478.9 70.7c-10.4 0-18-8-18-18.7 0-11.1 7.7-19 17.6-19 7.5 0 13 3.3 16.5 9.9l13.3-6.6C503 25.2 492.2 18.5 479.3 18.5c-9.5 0-17.9 3.7-24.5 10.6-6 6.2-9.1 14.1-9.1 23 0 8.4 3.4 17.1 9.5 23.3 6.4 6.5 14.4 9.9 23.8 9.9 13.5 0 24-6.7 29.2-18.2l-13.4-6.6C492.2 67.3 486.9 70.7 478.9 70.7M575.7 53.4c0-8.4-1.8-15.1-6-20.7-6.6-9.1-16.5-14.3-27.5-14.3-8.7 0-17.1 3.8-23.6 10.6-5.9 6.2-9 14.1-9 23 0 8.5 3.4 17.1 9.4 23.3 6.4 6.6 14.4 9.9 23.7 9.9 11.7 0 21.5-5.6 27.5-15.5l-12.7-6.3h-0.1c-3.1 5.1-8.6 7.9-15.1 7.9-10 0-16.6-5.7-17.6-14.7h50.7C575.6 55.5 575.7 54.5 575.7 53.4M525.4 44.9c2.2-7.9 9.1-13 16.9-13 9 0 15.1 4.5 17.6 13H525.4zM294.1 83.8h14.4V27.6c0 0-6.6 0-6.6 0h-7.7V83.8zM300.5 6.2h-6.4v14.5h14.4V6.2H300.5z"/></svg>'))
			.append($('<div/>',{'class': 'left'})
				.append('<span class="year"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="5.5 -3.5 64 64"><path class="st1" d="M37.4-3.5c9 0 16.6 3.1 22.9 9.4 3 3 5.3 6.4 6.9 10.3 1.6 3.9 2.3 8 2.3 12.3 0 4.4-0.8 8.5-2.3 12.3 -1.5 3.8-3.8 7.2-6.8 10.1 -3.1 3.1-6.7 5.4-10.6 7.1 -4 1.6-8.1 2.5-12.3 2.5s-8.3-0.8-12.1-2.4c-3.9-1.6-7.3-4-10.4-7 -3.1-3.1-5.4-6.5-7-10.4S5.5 32.8 5.5 28.5c0-4.2 0.8-8.3 2.4-12.2 1.6-3.9 4-7.4 7.1-10.5C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.5 2.6-18.5 7.7 -2.5 2.6-4.4 5.4-5.8 8.6 -1.4 3.2-2 6.5-2 10 0 3.4 0.7 6.7 2 9.9 1.4 3.2 3.3 6 5.8 8.5 2.5 2.5 5.4 4.4 8.5 5.7 3.2 1.3 6.5 2 9.9 2 3.4 0 6.8-0.7 10-2 3.2-1.3 6.1-3.3 8.7-5.8 5-4.9 7.5-11 7.5-18.3 0-3.5-0.6-6.9-1.9-10.1 -1.3-3.2-3.2-6-5.7-8.5C51 4.8 44.8 2.3 37.6 2.3zM37.2 23.2l-4.3 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l3.9 2c-0.8 1.6-2 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.8-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C32.6 18.6 35.4 20.1 37.2 23.2zM55.6 23.2l-4.2 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l4 2c-0.9 1.6-2.1 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.7-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C51.1 18.6 53.9 20.1 55.6 23.2z"/></svg> <span>2016</span></span>\
				<span class="link2 popup credits">Credits</span>\
				<span class="link2 popup settings">Settings</span>')
				.append($('<span/>',{'class': 'link2 popup sqlconsole', 'text': 'Console'}).on('click', showConsole)));

	var $projects = $('<ul/>',{'id': 'projects'}),
		$upcoming = $('<ul/>',{'id': 'upcoming','class': 'deadlines'}),
		$recent = $('<ul/>',{'id': 'recent', 'class': 'deadlines'});
	
	// Loop through all projects
	for (var i = 0, len = alasql('SELECT * FROM project').length; i < len; i++) {
		var p = alasql('SELECT * FROM project')[i],
			deadlines = [{'c': 'dateAudit',			'd': p.deadline_closest_audit_report},
						 {'c': 'dateProjectReport',	'd': p.deadline_closest_project_report},
						 {'c': 'dateRHreport',		'd': p.deadline_closest_rh_report},
						 {'c': 'dateSpendRRM',		'd': p.deadline_closest_rrm},
						 {'c': 'dateSidaReport',	'd': p.deadline_closest_sida_report},
						 {'c': 'dateEnd',			'd': p.date_project_end}];

		// Loop through the 6 deadline types specified above
		for (var ii = 0; ii < deadlines.length; ii++) {
			var d = deadlines[ii]['d'];
			
			// Only do something if the deadline has passed less than 0.5 months ago or will come in less than a month
			if (d && moment(d).isBetween(moment().subtract(0.5, 'months'), moment().add(1, 'months'))) {
				var	c = deadlines[ii]['c'], t = '',
					dayDiff = moment().diff(d, 'days');
					switch(deadlines[ii]['c']) {
						case 'dateEnd':
							if (dayDiff < -1)		t = 'Project ends in <b>'+- dayDiff+'</b> days';
							else if (dayDiff > 1)	t = 'Project ended <b>'+dayDiff+'</b> days ago';
							else if (dayDiff == 1)	t = 'Project ended <b>yesterday</b>';
							else if (dayDiff == -1)	t = 'Project ends <b>tomorrow</b>';
							else					t = 'Project ends <b>TODAY</b>!';
							break;
						case 'dateProjectReport':
							if (dayDiff < -1)		t = 'Project report due in <b>'+- dayDiff+'</b> days';
							else if (dayDiff > 1)	t = 'Project report due <b>'+dayDiff+'</b> days ago';
							else if (dayDiff == 1)	t = 'Project report was due <b>yesterday</b>';
							else if (dayDiff == -1)	t = 'Project report due <b>tomorrow</b>';
							else					t = 'Project report due <b>TODAY</b>!';
							break;
						case 'dateSpendRRM':
							if (dayDiff < -1)		t = 'Must spend RRM in <b>'+- dayDiff+'</b> days';
							else if (dayDiff > 1)	t = 'RRM deadline was <b>'+dayDiff+'</b> days ago';
							else if (dayDiff == 1)	t = 'RRM deadline was <b>yesterday</b>';
							else if (dayDiff == -1)	t = 'Must spend RRM by <b>tomorrow</b>';
							else					t = 'RRM deadline <b>TODAY</b>!';
							break;
						case 'dateAudit':
							if (dayDiff < -1)		t = 'Audit report due in <b>'+- dayDiff+'</b> days';
							else if (dayDiff > 1)	t = 'Audit report was due <b>'+dayDiff+'</b> days ago';
							else if (dayDiff == 1)	t = 'Audit report was due <b>yesterday</b>';
							else if (dayDiff == -1)	t = 'Audit report due <b>tomorrow</b>';
							else					t = 'Audit report due <b>TODAY</b>!';
							break;
						case 'dateRHreport':
							if (dayDiff < -1)		t = 'RH report due in <b>'+- dayDiff+'</b> days';
							else if (dayDiff > 1)	t = 'RH report was due <b>'+dayDiff+'</b> days ago';
							else if (dayDiff == 1)	t = 'RH report was due <b>yesterday</b>';
							else if (dayDiff == -1)	t = 'RH report due <b>tomorrow</b>';
							else					t = 'RH report due <b>TODAY</b>!';
							break;
						case 'dateSidaReport':
							if (dayDiff < -1)		t = 'Sida report due in <b>'+- dayDiff+'</b> days';
							else if (dayDiff > 1)	t = 'Sida report was due <b>'+dayDiff+'</b> days ago';
							else if (dayDiff == 1)	t = 'Sida report was due <b>yesterday</b>';
							else if (dayDiff == -1)	t = 'Sida report due <b>tomorrow</b>';
							else					t = 'Sida report due <b>TODAY</b>!';
					};
				
				// Create a list item for each deadline and append it to either the "upcoming" or the "recent" list - but only if it has already started
				$('<li/>',{'data-time': d.getTime(), 'class': c, 'data-projectid': p.id})
					.append('<time title="'+moment(d).format('YYYY-MM-DD')+'"><span class="day">'+moment(d).format('D')+'</span> <span class="month">'+moment(d).format('MMM')+'</span></time> ')
					.append('<b>'+p.code+' <span>'+p.country.sort().join(', ')+'</span></b> ')
					.append($('<span/>',{'class': 'desc', 'html': t}))
					.on('click', function() { showProject(this.dataset.projectid); })
					.prependTo((d > moment() && p.date_project_start < new Date()) ? $upcoming : (d < moment()) ? $recent : '')
			}
		};

		var $donors = $('<ul/>');
		for (var ii = 0; ii < listDonors.length; ii++) {
			var d = 'cost_' + toSlug(listDonors[ii]);
			if (p[d] > 0) $donors.append($('<li/>',{'class': d, 'html': '<span class="col1">' +listDonors[ii].replace('Radiohjälpen','RH') + '</span><span class="col2">' + decCom(p[d].toFixed(0)) + '</span>'}));
		};

		// Create a list item for each project and append it to the #projects ul
		$('<li/>',{'id': 'id'+p.id, 'class': 'PO-'+p.po_id
											+' y-'+p.date_project_start.getFullYear()
											+' r-'+p.region})
			.append($('<div/>',{'class': 'p-front noselect'})
				.append($('<span/>',{'class': 'code', 'text': p.code}))
				.append($('<span/>',{'class': 'title'}).append($('<b/>',{'text': p.title})))
				.append($('<span/>',{'class': 'funds', 'text': parseFloat((p.cost_all/1000000).toFixed(2))+'M'}))
				.append($('<span/>',{'class': 'id', 'text': p.id}))
				.append($('<span/>',{'class': 'country', 'text': p.country.sort().join(', ')}))
				.append($('<ul/>',{'class': 'badges'})
					.append((p.level == 'L3') ? 	  $('<li class="level" title="Level 3 emergency">L3</li>') :
							(p.deployment[0]) ? 	  $('<li class="deployment" title="Deployment">D</li>') :
							(p.monitoring_visit[0]) ? $('<li class="monitored" title="Monitored">M</li>') : ''))
				.append(p.deadline_closest_project_report ? $('<span/>',{'class': 'report', 'html': 'Report from partner: <b>'+moment(p.deadline_closest_project_report).format('D MMMM')+'</b>'}):'')
				.on('click', function() { $(this).parent().addClass('on'); }))
			.append($('<progress/>',{'value': moment()-p.date_project_start, 'max': p.date_project_end-p.date_project_start}))
			.append($('<div />',{'class': 'p-back'})
				.append($('<span/>',{'class': 'close button'})
					.on('click', function() { $(this).parent().parent().removeClass('on'); }))
				.append($('<span class="moreinfo noselect" title="More info"></span>')
					.append($('<span/>',{'class': 'code', 'text': p.code}))
					.append($('<span/>',{'class': 'partner', 'text': p.partner.join(', ')}))
					.on('click', function() { showProject($(this).parent().parent().attr('id').substring(2)); }))
				.append($('<div/>',{'class': 'funds'}).append($donors))
				.append((!p.link_url) ? '<span class="novips noselect">No project link defined</span>' : $('<a/>',{'class': 'vipslink noselect', 'href': p.link_url, 'title': p.title, 'html': '<span class="r1">Link to</span><span class="r2">Vips</span><span class="r3">'+ p.id +'</span>'}))
				.append($('<div/>',{'class': 'links'})
					.append((p.link_last_db) ? '<a href="'+ p.link_last_db +'" class="link2" title="Open last decision">Last DB</a>' : '')
					.append((p.link_appeal) ? '<a href="'+ p.link_appeal +'" class="link2" title="Appeal / project application">APP</a>' : (p.link_pr_appeal) ? '<a href="'+ p.link_pr_appeal +'" title="Preliminary appeal">P.APP</a>' : ''))
				.append($('<div/>',{'class': 'timeleft'})
					.append($('<time/>',{'class': 'date-start', 'title': 'Project start: ' + moment(p.date_project_start).format('YYYY-MM-DD'), 'html': '<span class="year">'+ p.date_project_start.getFullYear() +'</span> <span class="month">'+ moment(p.date_project_start).format('MMM') +'</span>'}))
					.append($('<span/>',{'class': 'days', 'text': (p.date_project_start > new Date()) ? 'YET TO START' : (p.date_project_end < new Date()) ? 'FINISHED' : timeLeft(p.date_project_end)}))
					.append($('<time/>',{'class': 'date-end', 'title': 'Project end: ' + moment(p.date_project_end).format('YYYY-MM-DD'), 'html': '<span class="year">'+ p.date_project_end.getFullYear() +'</span> <span class="month">'+ moment(p.date_project_end).format('MMM') +'</span>'}))
					))

			.hide()
			.appendTo($projects);
	};
	$content.append($projects);
	tinysort($upcoming.children(),{data:'time'});
	tinysort($recent.children(),{data:'time',order:'desc'});
	$sidebar.append('<div id="calculator"></div><h3>Upcoming</h3>',$upcoming,'<h3>Recent</h3>',$recent);
	

	// Puts decimal commas in numbers
	function decCom(n) {
		if (n) {
			var parts = n.toString().split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return parts.join('.')
		}
	};
	
	
	// POPUP CODE BELOW
	var docTitle = document.title,
		body = document.getElementsByTagName('body')[0];
	
	// In order to add a removable event listener an external function is needed
	function closeOnEsc(e) {
		if (e.keyCode == 27) {
			e.preventDefault();
			closePopup();
		}
	};

	// Hide popup window
	function closePopup() {
		var popup = document.getElementById('popup'),
			shadow = document.getElementById('shadow');
		popup.parentNode.removeChild(popup);
		shadow.parentNode.removeChild(shadow);
		body.classList.remove('fullscreen');
		document.title = docTitle;
		
		document.removeEventListener('click', closeOnEsc);
		//history.pushState('', document.title, window.location.pathname); //remove hash
	};
	
	// Show popup window
	function openPopup(title,content,o) {
		document.title = ((o && o.pageTitle) ? o.pageTitle : title) + ' - ' + docTitle;	
		var shadow = document.createElement('div'),
			popup = document.createElement('div');
		shadow.id = 'shadow';
		popup.id = 'popup';

		if (o) {
			if (o.css) popup.setAttribute('style', o.css); // add custom css
			if (o.width) {
				popup.style.width = o.width;
				popup.style.marginLeft = 'calc(' + o.width + ' / -2)';
			}
			if (o.classes) for (var b = o.classes.split(' '), c=0, d=b.length; c<d; c++) popup.classList.add(b[c]); // add more than one classes to classList
		}
		if (is_iPhone) {
			popup.classList.add('fullscreen');
			popup.classList.remove('resizable');
		};
		
		popup.innerHTML = '<header><h1><span>' + title + '</span></h1><span class="close button" title="Close"></span><span class="resize button" title="Toggle full screen view"></span></header><main>' + content + '</main>';
		body.classList.add('fullscreen');
		body.appendChild(popup);
		body.appendChild(shadow);

		var popup = document.getElementById('popup');
		
		popup.getElementsByClassName('resize')[0].addEventListener('click', function(){ popup.classList.toggle('fullscreen'); if(cmdInput)cmdInput.select(); });
		
		popup.getElementsByClassName('close')[0].addEventListener('click', closePopup); // Close popup when clicking on the close button
		shadow.addEventListener('click', closePopup); // Close popup when clicking on the shadow background
		document.addEventListener('keydown', closeOnEsc); // Close popup on pressing Escape
	};
	
	// Show project code
	function showProject(projectid) {
		var pd = alasql('SELECT * FROM project WHERE [id] = "'+ projectid +'"')[0],
			gd = alasql('SELECT date_decision, date_disbursement, partner_name, link_db, '+listColumnCostCentres+' FROM grant WHERE [id] = "'+ projectid +'" ORDER BY date_disbursement, date_decision'),
			$gtable = $('<table/>',{'class': 'grantlist'}).append('<caption>Grant history</caption><tr><th>DB date</th><th>Disbursed</th><th>Grantee</th>' + (is_iPhone ? '<th>Cost centre</th>' : '<th>Donor</th><th>CoS cost centre</th>') + '<th>Amount</th></tr>');

		
	
		function printCountMany(columns) {
			var res = [];
			for (var i = columns.length; i--;) res.push('COUNT(' + columns[i] + ')');
			return res.join('+');
		};

		function printArrayMany(columns) {
			var res = [];
			for (var i = columns.length; i--;) res.push('ARRAY(' + columns[i] + ') AS ' + columns[i]);
			return res.join(', ');
		};


		var gd3 = alasql('SELECT date_decision, ARRAY(date_disbursement) AS date_disbursement, ARRAY(partner_name) AS partner_name, LAST(DISTINCT link_db) link_db, '+ printArrayMany(listColumnCostCentres) +' FROM ? GROUP BY date_decision',[gd]);
		
		var rowspanDec = alasql('SElECT COLUMN '+ printCountMany(listColumnCostCentres) +' FROM ? GROUP BY date_decision',[gd]),
			rowspanDis = 0;
		
		var rowsDis = 0;
			
		for (var i = 0; i < gd3.length; i++) {

			var decision = gd3[i],
				disbursements = decision.date_disbursement
				rowsDec = 0;

			for (var ii = listColumnCostCentres.length; ii--;) { // reversed loop so that "CoS" comes at the bottom
				
				var costCentre = listColumnCostCentres[ii];
				
				for (var iii = 0; iii < disbursements.length; iii++) {
					
					
					var amount = decision[costCentre][iii];
										
					if (amount) {

						var costCentreName, costCentreNumber, donor;
						for (var iiii = 0; iiii < listCostCentres.length; iiii++) {
							var n = listCostCentres[iiii]['column_name'].indexOf(costCentre);
							if (n > -1) {
								costCentreName = listCostCentres[iiii]['name'][n];
								costCentreNumber = listCostCentres[iiii]['number'][n];
								donor = listCostCentres[iiii]['donor'];
							};
						};

						$('<tr/>')
							.append((rowsDec == 0) ? 
								($('<td/>',{'rowspan': rowspanDec[i], 'class': 'date', html: (decision.link_db) ? 
									'<a href="'+ decision.link_db +'" title="Open DB'+moment(decision.date_decision).format('YYMMDD')+'">'+ moment(decision.date_decision).format('YYYY-MM-DD') +'</a>' :
									moment(decision.date_decision).format('YYYY-MM-DD')})) : '')
							.append((rowsDis == 0) ?
								($('<td/>',{'rowspan': rowspanDis, 'class': 'date', text: moment(disbursements[iii]).format('YYYY-MM-DD')})) : '')
							.append($('<td/>',{text: decision.partner_name[iii]}))
							.append((!is_iPhone) ? $('<td/>',{text: donor}) : '')
							.append($('<td/>',{text: is_iPhone ? donor + ' ' + costCentreNumber : (costCentreNumber + (costCentreName ? ' (' + costCentreName + ')' : ''))}))
							.append($('<td/>',{'class': 'amount', text: decCom(amount.toFixed()) + ' SEK'}))
							.appendTo($gtable);
							
						rowsDec++; //rowsDis++;
					}		
				}
			};
		}
		
	
		
		/*
		for (var i = 0; i < gd.length; i++) {
			var g = gd[i],
				rowspanDis = 0,
				rowsDis = 0;
						 
			for (var ii = listColumnCostCentres.length; ii--;) {
				if (g[listColumnCostCentres[ii]]) rowspanDis++;
			};
			
			for (var ii = listColumnCostCentres.length; ii--;) { // reversed loop so that "CoS" comes at the bottom
				var cc = listColumnCostCentres[ii];
				if (g[cc]) {
					
					for (var iii = 0; iii < listCostCentres.length; iii++) {		
						var n = listCostCentres[iii]['column_name'].indexOf(cc);
						if (n > -1) {
							g.costcentre = listCostCentres[iii]['name'][n];
							g.costcentreNumber = listCostCentres[iii]['number'][n];
							g.donor = listCostCentres[iii]['donor'];
						};
					};

					$('<tr/>')
						.append((g.date_decision != lastDec) ? 
							($('<td/>',{'class': 'date', 'rowspan': rowspanDec, html: (g.link_db) ? '<a href="'+ g.link_db +'" title="Open DB'+moment(g.date_decision).format('YYMMDD')+'">'+ moment(g.date_decision).format('YYYY-MM-DD') +'</a>' : moment(g.date_decision).format('YYYY-MM-DD')})) : '')
						.append((rowsDis == 0) ? 
							($('<td/>',{'class': 'date', 'rowspan': rowspanDis, text: moment(g.date_disbursement).format('YYYY-MM-DD')})) : '')
						.append((rowsDis == 0) ? 
							($('<td/>',{'rowspan': rowspanDis, text: g.partner_name})) : '')
						.append($('<td/>',{text: g.donor}))
						.append($('<td/>',{text: g.costcentreNumber + ((g.costcentre) ? ' ('+ g.costcentre +')' : '')}))
						.append($('<td/>',{'class': 'amount', text: decCom(g[cc].toFixed()) + ' SEK' }))
						.appendTo($gtable);
					
					lastDec = g.date_decision;
					rowsDis++;
				}
			};

		};*/
		//$gtable.rowspanizer({vertical_align: 'middle'});
		
		$('<tr class="sum"><td colspan="'+ (is_iPhone ? '4' : '5') +'">Total</td><td class="amount">'+ decCom(pd.cost_all.toFixed()) +' SEK</td></tr>').appendTo($gtable);



		

		var $content = $('<div/>',{'id': 'projectdetails'})
							.append($('<div/>',{'class': 'country'}))
							.append($('<ul/>',{'class': 'info'})
								.append($('<li/>',{'html': '<span>Project ID:</span> <span>'+ projectid +'</span>'}))
								.append($('<li/>',{'html': '<span style="padding-bottom: 20px;">Project code:</span> <span>'+ pd.code +'</span>'}))
								.append($('<li/>',{'html': '<span>'+ ((pd.country && pd.country.length == 1) ? 'Country:' : 'Countries:') +'</span> <span>'+ pd.country.join(', ') +'</span>'}))
								.append((pd.po_id != 0) ? $('<li/>',{'html': '<span>Programme officer:</span> <span>'+ pd.po_name +'</span>'}) : '')
								.append((pd.partner.length) ? $('<li/>',{'html': '<span>Partners:</span> <span>'+ pd.partner.join(', ') +'</span>'}) : '')
								.append((pd.sector.length) ? $('<li/>',{'html': '<span>Sector'+ pl(pd.sector.length) +':</span> <span>'+ pd.sector.join(', ') +'</span>'}) : '')
								.append($('<li/>',{'html': '<span>Project start:</span> <span>'+ moment(pd.date_project_start).format('YYYY-MM-DD') +'</span>'}))
								.append($('<li/>',{'html': '<span>Project end:</span> <span>'+ moment(pd.date_project_end).format('YYYY-MM-DD') +'</span>'})))
							.append((!pd.link_url) ? '' : $('<a/>',{'class': 'vipslink', 'href': pd.link_url, 'title': pd.title, 'html': '<span class="r1">Link to</span><span class="r2">Vips</span><span class="r3">'+ projectid +'</span>'}))
							.append($gtable);



	

		openPopup(pd.title,$content[0].outerHTML,{'pageTitle': pd.code}); // show project in popup

		// Async update the country img
		var mapUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=250x250&style=saturation:-100&'
					+ 'style=feature:water|element:geometry.fill|lightness:100&key='
					+ googleMapsApiKey,
			count_getJSONs_done = 0;
		// First loop through the the alpha-2 country codes and get the geocodes of the countries from Google's Geocode API
		for (var i = 0; i < pd.code_alpha2.length; i++) {
			var c = pd.code_alpha2[i];
			$.getJSON({
			    dataType:'json',
			    url: 'https://maps.googleapis.com/maps/api/geocode/json?components=country:' + c,
				key: googleMapsGeocodingKey,
			    success: function(responseData) {
					var b = responseData.results[0].geometry.bounds;
					mapUrl += '&visible=' + b.northeast.lat + ',' + b.northeast.lng + '&visible=' + b.southwest.lat + ',' + b.southwest.lng;
			    }
			})
			// Once the all JSON requests are finished, build the url and get the map image from Google's Static Maps API
			.always(function() {
		        count_getJSONs_done++;
		        if (count_getJSONs_done == pd.code_alpha2.length) $('#popup #projectdetails .country').append('<img src="'+ mapUrl +'" alt="" />');
	     	});
		};
	};







	$('#loading').remove();
	$('body').addClass('theme_cos').append($header,$('<div id="wrapper"></div>').append($main.append($sidebar,$content)).append($footer));
	
	if (!is_iPhone) $('#sidebar').show();

	updCalc();


















	
	// Shows alaSQL Console
	var cmdInput, lastWord, matched = [], lastMatch, input = '', inputLog = [''], inputN = 1,
		commands = ['ALTER TABLE', 'RENAME TO', 'ADD COLUMN',  'MODIFY COLUMN',  'RENAME COLUMN',  'DROP',  'ATTACH',  'DATABASE',  'ASSERT',  'BEGIN',  'COMMIT',  'CREATE',  'IF EXISTS',  'IF NOT EXISTS', 'CREATE TABLE', 'DELETE FROM', 'WHERE', 'DETACH DATABASE', 'INTO', 'INSERT INTO', 'VALUES', 'DEFAULT VALUES', 'SELECT', 'HELP', 'ROLLBACK', 'FROM', 'JOIN', 'ON', 'USING', 'GROUP BY', 'HAVING', 'ORDER BY', 'SET', 'SHOW', 'DATABASES', 'SHOW TABLES', 'SHOW CREATE TABLE', 'UPDATE', 'USE', 'clear', 'exit', 'project']; // autocomplete hints
	function showConsole() {
		var content = '<div id="console">'
					+ '<div><div class="display"><div data-timestamp="' + Date.now() + '">JS Console (beta)<br/><br/>Type ? for available commands<br/><br/></div></div></div>'
					+ '<form><textarea rows="1" autofocus></textarea></form>'
					+ '</div>';
		openPopup('Console',content,{width:'88ch',classes:'theme_dark resizable roundedcorners'}); // show console in popup

		var popup = document.getElementById('popup'),
			cmdForm = popup.getElementsByTagName('form')[0],
			display = popup.getElementsByClassName('display')[0],
			minmax = function(v) { return (Math.min(inputLog.length-1, Math.max(0, v))); }, // this ensures that a number (inputN) cannot be outside of the length of inputLog
			resizeCmd = function(resizeDisplay) {
				cmdForm.style.height = 'auto';
				cmdForm.style.height = cmdInput.scrollHeight+'px';
				cmdInput.scrollTop = cmdInput.scrollHeight;
				if (resizeDisplay) display.scrollIntoView(false); // scroll the display on pressing Enter only
			};
		cmdInput = popup.getElementsByTagName('textarea')[0];
		
		cmdInput.addEventListener('input', function(e) {
			if (this.value > input) { // Prevent firing event when deleting characters
				input = this.value;
			
				inputLog[inputLog.length-1] = this.value;
				inputN = inputLog.length-1;

				lastWord = input.split(/ |\n/).pop();
				matched = (lastWord) ? commands.filter(function (m) { return m.substr(0, lastWord.length).toUpperCase() == lastWord.toUpperCase() }) : [];

				if (matched.length) {
					this.value = input + matched[0].substr(lastWord.length);
					this.selectionStart = input.length;
				}

				// Autoresize textarea on input
				resizeCmd();
			} else {
				matched = [];
			}
		});		
	
		cmdInput.addEventListener('keydown', function(e) {
			input = this.value;
			if (!(e.shiftKey && e.keyCode == 13)) { // Escape the shift key (for shift+enter)
				switch(e.keyCode) {
					case 13: // ENTER
						e.preventDefault();
						input = input.trim(); // remove unnecessary spaces from around the input string - not crucial
						if (input !== '') {

							if (input.toLowerCase() == 'clr' || input.toLowerCase() == 'clear') {
								while (display.firstChild) {
									display.removeChild(display.firstChild);
								};
								if (inputN < inputLog.length) inputLog[inputLog.length-1] = input;
								inputN = inputLog.length;
								if (inputLog[inputLog.length-1]!=='') inputLog.push('');
							} else if (input.toLowerCase() == 'exit') {
								closePopup();
							} else {
								var displayInput = document.createElement('div'),
									displayOutput = document.createElement('div'),
									output;

								displayInput.innerHTML = '&#62; ' + input;
								displayInput.dataset.timestamp = Date.now();
								displayInput.className = 'input';
								display.appendChild(displayInput);
									
								if (input == '?') {
									output = 'Available commands:<br/>-------------------<br/>' + commands.join('<br/>');
								} else {
							
									alasql.promise(input).then(function(res) {

										if (inputN < inputLog.length) inputLog[inputLog.length-1] = input;
										inputN = inputLog.length;
										if (inputLog[inputLog.length-1]!=='') inputLog.push('');
										
										
										if (res.length) output = JSON.stringify(res); else output = 'No results';

									}).catch(function(err){
										output = err;
									}).then(function() {
										displayOutput.innerHTML = output;
										displayOutput.dataset.timestamp = Date.now();
										displayOutput.className = 'output';
										resizeCmd(true);
									});
									
								};
									
								display.appendChild(displayOutput);
								
							};

							this.value = '';
							resizeCmd(true);
						};

						break;
					case 38: // UP
						e.preventDefault();
						inputN = minmax(inputN-1);					
						this.value = inputLog[inputN];
						resizeCmd();
						break;
					case 40: // DOWN
						e.preventDefault();
						inputN = minmax(inputN+1);
						this.value = inputLog[inputN];
						resizeCmd();
						break;
					case 9:  // TAB
						e.preventDefault();
						if (matched.length) {
							if(/\s+$/g.test(this.value)) {
								this.value = this.value.trim().substring(0, this.value.length - lastMatch.length -1) + matched[0] + ' ';
							} else {
								this.value = this.value.substring(0, this.value.length - matched[0].length) + matched[0] + ' ';
							}
							lastMatch = matched[0];
							matched.push(matched.shift());
						}
						resizeCmd();
				};
			};
		});
		cmdInput.select(); // autoselect textarea
	}; // END OF CONSOLE















/*	$('.sqlconsole').on('click', function() {
		
		var	content = '<div id="console">'
					+ '<div><div><pre>SQL Console (beta) powered by AlaSQL '+alasql.version+'<br/><br/>Type HELP for available commands<br/><br/></pre></div></div>'
					+ '<form><textarea rows="1" autofocus /></form>'
					+ '</div>',
			inputLog = [''],
			inputN = 1;
			minmax = function(v) { return (Math.min(inputLog.length-1, Math.max(0, v))) },
			cmdResize = function() {
				var $cmd = $('#console>form'),
					$cmdT = $('#console>form>textarea');
				$cmd.height('auto');
				$cmd.height($cmdT[0].scrollHeight+'px');
			};
		
		popUp('SQL Console (beta)',content,'console resizable');
		
		$('#console textarea').select();
		
		var display = $('#console>div>div'),
			alasqlCommands = ['ALTER TABLE', 'RENAME TO', 'ADD COLUMN',  'MODIFY COLUMN',  'RENAME COLUMN',  'DROP',  'ATTACH',  'DATABASE',  'ASSERT',  'BEGIN',  'COMMIT',  'CREATE',  'IF EXISTS',  'IF NOT EXISTS', 'CREATE TABLE', 'DELETE FROM', 'WHERE', 'DETACH DATABASE', 'INTO', 'INSERT INTO', 'VALUES', 'DEFAULT VALUES', 'SELECT', 'HELP', 'ROLLBACK', 'FROM', 'JOIN', 'ON', 'USING', 'GROUP BY', 'HAVING', 'ORDER BY', 'SET', 'SHOW', 'DATABASES', 'SHOW TABLES', 'SHOW CREATE TABLE', 'UPDATE', 'USE']; // autocomplete hints
							
		$('#console textarea').on('keydown', function(e) {

			var input = $('#console textarea').val(),
				keypressed = (e.keyCode ? e.keyCode : e.which);
				
			
			if (keypressed == '13') { // ENTER
				
				if (input == '') {
					e.preventDefault();
				} else {
					if (input === 'clr') {
						display.empty();
					} else {
						
						display.append('<div class="input" data-timestamp="'+new Date().toString('yyyy-MM-dd HH:mm:ss.ssss')+'"><pre>&#62; '+input+'</pre></div>');
						
						var op;
						var $output = $('<div/>')
						
						alasql.promise(input).then(function(res) {
				
							var result;
							if (res.length > 1) {
								result = '<table>';
								for (var key in res[0]) {
									result += '<th>'+key+'</th>';
								};
								$.each(res, function(i, obj) {
									result += '<tr>';
									$.each(obj,function(i,text) {
										if (text) {
											if (text instanceof Date) text = text.toString('yyyy-MM-dd')
											else if (text.toString().substring(0, 4) == 'http') text = '<a href="'+text+'">link</a>'
											else if (text.toFixed) text = decCom(text);
											else if (text.constructor === Array) text = text.join(', ');
										}
										result += '<td>'+text+'</td>';
									});
									result += '</tr>';
								});
								result += '</table>';
							} else result = '<pre>No result</pre>';

							$output.addClass('result').html(result);
													
						}).catch(function(err){
							var error = (err.toString()).replace(/(?:\r\n|\r|\n)/g, '<br />');
							$output.addClass('error').append($('<pre>').html(error));
						}).then(function() {
							$output.attr('data-timestamp',new Date().toString('yyyy-MM-dd HH:mm:ss.ssss')).appendTo(display);
							cmdResize();
							$('#console>div>div')[0].scrollIntoView(false);
						});
						
					};
					inputLog[inputLog.length-1] = $('#console textarea').val();
					if (inputLog[inputLog.length-1]!=='') inputLog.push('');
					inputN = inputLog.length-1;				
				};
				
				$('#console textarea').val('');
				return false;
			
			} else if (keypressed == '38') { // UP
				e.preventDefault();
				inputN = minmax(inputN-1);					
				$('#console textarea').val(inputLog[inputN]);
				cmdResize();
				
			} else if (keypressed == '40') { // DOWN
				e.preventDefault();
				inputN = minmax(inputN+1);
				$('#console textarea').val(inputLog[inputN]);
				cmdResize();
			}

		});

		var lastWord, matched = [], matchedN = -1;
		$('#console textarea').on('input', function(e) {
			var input = $('#console textarea').val();
			
			//console.log(input.split(/ |\n/).pop());

			//console.log(alasqlCommands.filter(function (m) { return m.match(new RegExp('^' + input.split(/ |\n/).pop(), 'i')) }));
			
			lastWord = input.split(/ |\n/).pop();
			matched = (lastWord)?alasqlCommands.filter(function (m) { return m.substr(0, lastWord.length).toUpperCase() == lastWord.toUpperCase() }):[];
				
			console.log(matched)
			
			if (matched.length > 0) {
				$('#console textarea').val(input+matched[0].substr(lastWord.length));
				$('#console textarea')[0].selectionStart = input.length;
			}
			
		});

		
		// Autoresize textarea on input
		$('#console textarea').on('input', function() {
			cmdResize();
			inputLog[inputLog.length-1] = $(this).val();
			inputN = inputLog.length-1;
		});
		
		$('#console textarea').on('keydown', function(e) { // TAB
			var input = $('#console textarea').val();
			if (e.which == '9') {
				e.preventDefault();
				//matchedN = matchedN+1;
				$('#console textarea').val(input.slice(0,-matched[0].length)+matched[0])
				$('#console textarea')[0].selectionStart = input.length+1;
			} else if (e.which == '8') { // BACKSPACE fix
				console.log(window.getSelection())
				//e.preventDefault();
				//$('#console textarea').val(input.slice(0,-1))
			}
		})


		//$('#console textarea').tabcomplete(alasqlCommands);

	});
	
	//$('.sqlconsole').trigger('click');*/

});