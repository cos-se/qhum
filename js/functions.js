var xlsxurl = 'https://dl.dropboxusercontent.com/s/wrylh81p763xym8/cos-hum_grants_since_2000.xlsx'

alasql.promise(['SELECT * FROM XLSX("'+xlsxurl+'",{sheetid:"Grants", headers:true})']).then(function(grants) {
		
	// FUNCTIONS
	var is_iPhone = /iPhone|iPod/.test(navigator.platform);
	if(is_iPhone) {$("body").addClass("mobile")} else {$("body").addClass("nomobile")};

	// JavaScript Cookie by Klaus Hartl & Fagner Brack
	!function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*i.expires),i.expires=s}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(a){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],u=/(%[0-9A-Z]{2})+/g,d=0;d<p.length;d++){var f=p[d].split("="),l=f[0].replace(u,decodeURIComponent),m=f.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{if(m=t.read?t.read(m,l):t(m,l)||m.replace(u,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(a){}if(n===l){c=m;break}n||(c[l]=m)}catch(a){}}return c}}return o.set=o,o.get=function(e){return o(e)},o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});

	if (Cookies.get('theme')) $('body').addClass(Cookies.get('theme')); // set colour theme
	if (Cookies.get('showColours')) $('body').addClass('showPrRegions'); // colour projects by regions
	if (!Cookies.get('cookieconsent')) $('#settings').append('<div id="cookieconsent"><p>To save these custom preferences this site uses cookies!</p><span>Got it!</span></div>'); // check for cookie consent
	
	// Parses weird Excel dates into JS dates
	function excelDate(d) {
		return new Date((d - (25567 + 2))*86400*1000);
	};

	// Removes undefined items from array
	function cleanArray(a){
		var result = new Array();
		if (a.constructor === Array) {
			for(var i = 0; i<a.length; i++){
				if (a[i]){
					result.push(a[i]);
				}
			}
			return result;
		} else {
			return a;
		}
	};

	// Removes duplicates from array
	function uniqueArray(a) {
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

	// Sums numbers in array
	function sumArray(a) {
		result = 0;
		if (a) {
			if (a.constructor === Array) {
				for (var i = 0; i < a.length; i++) {
					result += a[i];
				}
				return result;
			} else {
				return a
			}
		}
	};

	// Sums numbers that are stored under the same key in an object
	function sumObjProps(items, prop){
	    return items.reduce( function(a, b){
	        return parseInt(a) + parseInt(b[prop]);
	    }, 0);
	};

	function sortByKey(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	};
	
	var anyMatchInArray = function (toMatch, target) {
		if (toMatch) {
			"use strict";
			var found, targetMap, i, j, cur;
			found = false;
			targetMap = {};
			// Put all values in the `target` array into a map, where
			//  the keys are the values from the array
			for (i = 0, j = target.length; i < j; i++) {
				cur = target[i];
				targetMap[cur] = true;
		}
		// Loop over all items in the `toMatch` array and see if any of
		//  their values are in the map from before
		for (i = 0, j = toMatch.length; !found && (i < j); i++) {
			cur = toMatch[i];
			found = !!targetMap[cur];
			// If found, `targetMap[cur]` will return true, otherwise it
			//  will return `undefined`...that's what the `!!` is for
		}
		return found;
	}};

	// Puts decimal commas in numbers
	function decCom(n) {
		if (n) {
			var parts = n.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".")
		}
	};

	// Checks the difference between two dates in weeks, days, etc.
	Date.dateDiff = function(datepart, fromdate, todate) {
		datepart = datepart.toLowerCase();
		var diff = todate - fromdate;
		var divideBy = {
			w: 604800000,
			d: 86400000,
			h: 3600000,
			n: 60000,
			s: 1000
		};
		return Math.floor(diff / divideBy[datepart]);
	}

	// Checks if a date is between two other dates
	function isBetween(date, agodays, indays) {
		if (Date.dateDiff("d", today, date) > agodays && Date.dateDiff("d", today, date) < indays) {
			return true;
		} else return false;
	}
	function dateInArray(dateArray, opt) {
	
		if (dateArray.constructor === Array) {
			if (opt === 'last') {
				// Check which one of the dates in the array is the last
			} else if (opt === 'first') {
				// ...
				for (var i = 0; i < dateArray.length; i++) {
					result = dateArray[i]
				}
			}
			return result
		} else {
			return dateArray
		}
	};

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
		return acronym
	}

	// Formats dates as YYYY-MM-DD
	function formatDate(date,format) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		
		if (format=='YYMMDD') return [year.toString().substring(2), month, day].join('');
		else return [year, month, day].join('-');
	}
	
	// Returns an s for English plurals if number is not 1
	function pl(n) {
		if (n !== 1) return 's'; else return '';
	}

	// VARIABLES, ARRAYS
	var POs 	 = ["No Assigned PO"],
		regions  = [],
		today    = new Date(),
		africa = ["Algeria", "Angola", "Area 1", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Central African Republic", "CAR", "Chad", "Comoros", "Congo", "DRC", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"],
		asiaPac = ["Afghanistan", "Australia", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "East Timor", "Fiji", "India", "Indonesia", "Japan", "Kazakhstan", "Kiribati", "Kyrgyzstan", "Laos", "Malaysia", "Maldives", "Marshall Islands", "Micronesia", "Mongolia", "Myanmar", "Nauru", "Nepal", "New Zealand", "North Korea", "Pakistan", "Palau", "Papua New Guinea", "Philippines", "Russia", "Samoa", "Singapore", "Solomon Islands", "South Korea", "Sri Lanka", "Tajikistan", "Thailand", "Tonga", "Turkmenistan", "Tuvalu", "Uzbekistan", "Vanuatu", "Vietnam"],
		middleEast = ["Bahrain", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon", "Oman", "Palestine", "Qatar", "Saudi Arabia", "Syria", "Turkey", "United Arab Emirates", "Yemen"],
		latinAndCar = ["Antigua and Barbuda", "Argentina", "Bahamas", "Barbados", "Belize", "Bolivia", "Brazil", "Central America", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "Ecuador", "El Salvador", "Grenada", "Guatemala", "Guyana", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Suriname", "Trinidad and Tobago", "Uruguay", "Venezuela"],
		europe = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia", "Bosnia and Herzegovina", "Bulgaria", "Chechnya", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"],
		monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// INITIALISE DATABASE
	var allYears   = [],
		allRegions = [],
		allGrantYears = [],
		allGrantStartYears = [];
	grants.map(function(i) {
		i["Vips"] = i["Vips"].toString();
		i["Date of decision"] = excelDate(i["Date of decision"]);
		i["Start date"] = excelDate(i["Start date"]);
		i["End date"] = excelDate(i["End date"]);
		i["Report from partner"] = excelDate(i["Report from partner"]);
		i["Audit"] = excelDate(i["Audit"]);
		i["Spend RRM"] = excelDate(i["Spend RRM"]);
		if(i["PO"]) {
			0 > $.inArray(i.PO,POs) ? POs.push(i.PO) : "" // list POs in a unique array
		}
		if(i["Date of decision"] != "Invalid Date") {
			if(i["Date of decision"].length!=0) {
				0 > $.inArray(i["Date of decision"].getFullYear(),allGrantYears) ? allGrantYears.push(i["Date of decision"].getFullYear()):""; // list grant years in a unique array
			}
			i.Year = i["Date of decision"].getFullYear().toString()
		}
		if(i["Date of disbursement"]) {
			i["Date of disbursement"] = excelDate(i["Date of disbursement"]);
		} else {
			i["Date of disbursement"] = i["Date of decision"];
		}
		if(i["Start date"] != "Invalid Date") {
			i.startYear = i["Start date"].getFullYear().toString()
			if(i["Start date"].length!=0) {
				0 > $.inArray(i["Start date"].getFullYear(),allGrantStartYears) ? allGrantStartYears.push(i["Start date"].getFullYear()):""; // list project start years in a unique array
			}
		}
		(i.Country)?i.Country = i.Country.split(", "):""; // split when a grant is given unearmarked to several countries
		(i.Sectors)?i.Sectors = i.Sectors.split(", "):""; // same with sectors
		(i.Partner)?i.Partner = i.Partner.split(", "):""; // and partners

		i["Region"] = (anyMatchInArray(i["Country"], africa)) ? "AFR Africa" : (anyMatchInArray(i["Country"], asiaPac)) ? "ASP Asia-Pacific" : (anyMatchInArray(i["Country"], middleEast)) ? "MEA Middle East" : (anyMatchInArray(i["Country"], latinAndCar)) ? "LAC Latin America and Caribbean" : (anyMatchInArray(i["Country"], europe)) ? "EUR Europe" : "GLB Global";
		0 > $.inArray(i["Region"],allRegions) ? allRegions.push(i["Region"]):"" // list regions in a unique array
	});
	
	var nineYearsAgo = (parseInt((allGrantStartYears.sort()).slice(-1).pop())-9);
	
	function yearSelect() {
		if(!Cookies.get('showAllYears')) {
			$('body').addClass('showYears9');
			return nineYearsAgo;
		} else {
			$('body').addClass('showAllYears');
			return 0;
		}
	};
	
	var projects = alasql('SELECT [Vips], FIRST([Code]) [Code], FIRST([Bilat/ACT]) [Type], FIRST([Title]) [Title], FIRST([Level]) [Level], FIRST([PO]) [PO], ARRAY([Partner]) [Partner], ARRAY([Country]) [Country], ARRAY([Sectors]) [Sectors], SUM([Target]) [Target], FIRST([Deployment]) [Deployment], ARRAY([Monitoring visit]) [Monitoring visit], FIRST([Start date]) [startDate], LAST([End date]) [endDate], LAST([Report from partner]) [reportDate], FIRST([Spend RRM]) [spendRRM], FIRST([URL]) [URL], FIRST([Alert]) [Alert], FIRST([Pr-Appeal]) [Pr-Appeal], FIRST([Appeal]) [Appeal], FIRST([DB]) [DB], FIRST([Region]) [Region], ARRAY([Comments]) [Comments], ARRAY([Own funds (100)]) [funds100], ARRAY([Raised funds (102)]) [funds102], ARRAY([Withdrawal (103)]) [funds103], ARRAY([Own contribution Sida (312)]) [funds312], ARRAY([Own contribution ECHO (403)]) [funds403], ARRAY([Sida major HUM (310)]) [funds310], ARRAY([Sida RRM (311)]) [funds311], ARRAY([ECHO (402)]) [funds402], ARRAY([Radiohjälpen (600)]) [funds600] FROM ? WHERE [Vips] != ? AND [startYear] > '+yearSelect()+' GROUP BY [Vips]',[grants]); // nicely group the grants by projects (Vips ID)
	
	// Clean and organise the projects array
	projects.map(function(i) { 
		i["funds100"] = cleanArray(i["funds100"]);
		i["funds102"] = cleanArray(i["funds102"]);
		i["funds103"] = cleanArray(i["funds103"]);
		i["funds312"] = cleanArray(i["funds312"]);
		i["funds403"] = cleanArray(i["funds403"]);
		i["funds310"] = cleanArray(i["funds310"]);
		i["funds311"] = cleanArray(i["funds311"]);
		i["funds402"] = cleanArray(i["funds402"]);
		i["funds600"] = cleanArray(i["funds600"]);
		i["Country"] = uniqueArray([].concat.apply([], i["Country"]));
		i["Sectors"] = cleanArray(uniqueArray([].concat.apply([], i["Sectors"])));
		i["Partner"] = cleanArray(uniqueArray([].concat.apply([], i["Partner"])));
		i["Comments"] = (cleanArray(i["Comments"])).join(", ");
		if(i["startDate"] != "Invalid Date") {
			if(i["startDate"].length!=0) {
				0 > $.inArray(i["startDate"].getFullYear(),allYears) ? allYears.push(i["startDate"].getFullYear()):""; // list project start years in a unique array
			}
			i.Year = i["startDate"].getFullYear().toString()
		};
		i["Monitoring visit"] = cleanArray(i["Monitoring visit"]);
	});	

/*
				███████╗    ██╗    ██╗         ████████╗    ███████╗    ██████╗     ███████╗
				██╔════╝    ██║    ██║         ╚══██╔══╝    ██╔════╝    ██╔══██╗    ██╔════╝
				█████╗      ██║    ██║            ██║       █████╗      ██████╔╝    ███████╗
				██╔══╝      ██║    ██║            ██║       ██╔══╝      ██╔══██╗    ╚════██║
				██║         ██║    ███████╗       ██║       ███████╗    ██║  ██║    ███████║
				╚═╝         ╚═╝    ╚══════╝       ╚═╝       ╚══════╝    ╚═╝  ╚═╝    ╚══════╝
*/

	var allFilters = [{
		filt: "finished", button: "Finished",
		desc: "",
		cond: function(p) {if (p.endDate < today) return "finished"}
	},{
		filt: "soon", button: "Soon",
		desc: "Ending soon",
		cond: function(p) {if (isBetween(p.endDate, "-1", "45")) return "soon"} // if today or less than 45 days left
	},{
		filt: "sida", button: "Sida",
		desc: "Supported by Sida",
		cond: function(p) {if (p.fundsSida != 0) return "sida"}
	},{
		filt: "rrm", button: "RRM",
		desc: "Supported by Sida's Rapid Response Mechanism",
		cond: function(p) {if (p.funds311 != 0) return "rrm"}
	},{
		filt: "rrmsoon", button: "noButton",
		desc: "",
		cond: function(p) {if (p.fundsRRM != 0 && isBetween(p.spendRRM, "-7", "30")) return "rrmsoon"} // the RRM spending deadline is in less than 30 days or it was less than 7 days ago
	},{
		filt: "ECHO", button: "ECHO",
		desc: "Supported by ECHO",
		cond: function(p) {if (p.fundsECHO != 0) return "ECHO"}
	},{
		filt: "RH", button: "RH-MH-VB",
		desc: "Supported by Radiohjälpen / Musikhjälpen / Världens Barn",
		cond: function(p) {if (p.fundsRH != 0) return "RH"}
	},{
		filt: "active", button: "Active",
		desc: "Still ongoing",
		cond: function(p) {if (p.endDate > today) return "active"}
	},{
		filt: "archived", button: "Archived",
		desc: "The project has been archived",
		cond: function(p) {if (p.endDate < today && !p.PO) return "archived"} // both finished and has no PO defined which mean archived
	},{
		filt: "lwf", button: "LWF",
		desc: "Implemented by LWF",
		cond: function(p) {if (/LWF/.test(p.partners)) return "lwf"}
	},{
		filt: "rp", button: "Refugee Pr.",
		desc: "Part of the Refugee Programme",
		cond: function(p) {if (p.vips == '500364' || p.vips == '500134' || p.vips == '500101' || p.vips == '500094' || p.vips == '500102' || p.vips == '500344' || p.vips == '500785' || p.vips == '500786') return 'rp'} // only the 8 projects that belong to the "Refugee Programme (2014-2016)"
	},{
		filt: "l1m", button: "<1M",
		desc: "Supported with less than 1 million SEK",
		cond: function(p) {if (p.funds < 1) return "l1m"} // grant is at least 1 million SEK or more
	},{
		filt: "m1m", button: "1M<",
		desc: "Supported with more than 1 million SEK",
		cond: function(p) {if (p.funds > 0.999) return "m1m"} // grant is at least 1 million SEK or more
	},{
		filt: "reportsoon", button: "Report soon",
		desc: "Partner report date is soon or has recently passed",
		cond: function(p) {if (isBetween(p.reportDate, "-30", "60")) return "reportsoon"} // if report date is in less than 60 days or it was less than 30 days ago.
	},{
		filt: "deployment", button: "Deployment",
		desc: "Received deployment",
		cond: function(p) {if (p.deployment) return "deployment"}
	},{
		filt: "monitored", button: "Monitored",
		desc: "Have been visited for monitoring",
		cond: function(p) {if (p.monitored.length > 0) return "monitored"}
	},{
		filt: "PO", button: "noButton",
		desc: "",
		cond: function(p) {if (p.PO) {return "PO-"+acr(p.PO)} else return "PO-NAP"}
	},{
		filt: "year", button: "noButton",
		desc: "",
		cond: function(p) {if (p.startDate) return "y-"+p.startDate.getFullYear()}
	},{
		filt: "region", button: "noButton",
		desc: "",
		cond: function(p) {if (p.region) return "r-"+p.region.substr(0,3)}
	},{
		filt: "appeal", button: "noButton",
		desc: "",
		cond: function(p) {if (!p.endDate < today && p.PO && p.Type == "ACT") return "appeal"} // this is to check if the project is an appeal (so that we can link the ACT Report Viewer sheet)
	}];

/*
				 ██████╗     ██████╗      █████╗     ███╗   ██╗    ████████╗    ███████╗
				██╔════╝     ██╔══██╗    ██╔══██╗    ████╗  ██║    ╚══██╔══╝    ██╔════╝
				██║  ███╗    ██████╔╝    ███████║    ██╔██╗ ██║       ██║       ███████╗
				██║   ██║    ██╔══██╗    ██╔══██║    ██║╚██╗██║       ██║       ╚════██║
				╚██████╔╝    ██║  ██║    ██║  ██║    ██║ ╚████║       ██║       ███████║
				 ╚═════╝     ╚═╝  ╚═╝    ╚═╝  ╚═╝    ╚═╝  ╚═══╝       ╚═╝       ╚══════╝
 */

	var ghtml = '<ol id="grants">';  // Grant listing begins here
	$.each(grants, function(i, item) {
		var g = grants[i];

		function colThis (n, v) {
			var s = " ";
			if (v) {
				if (v.constructor === Array) {
					s = v.join(", ")
				} else if (typeof v === 'number') {
					s = decCom(v.toFixed());
				} else s = v
			} 
			return '<span class="col'+n+'">'+s+'</span>'
		};

		ghtml += '<li id="id'+g["Vips"]+'">'
				+ colThis(1, formatDate(g["Date of decision"]))
				+ colThis(2, g["Own funds (100)"])
				+ colThis(3, g["Raised funds (102)"])
				+ colThis(4, g["Withdrawal (103)"])
				+ colThis(5, g["Own contribution Sida (312)"])
				+ colThis(6, g["Own contribution ECHO (403)"])
				+ colThis(7, g["Sida major HUM (310)"])
				+ colThis(8, g["Sida RRM (311)"])
				+ colThis(9, g["ECHO (402)"])
				+ colThis(10, g["Radiohjälpen (600)"])
				+ '</li>';
	
	});
	ghtml += "</ol>";  // Grant listing ends here



/*
			██████╗     ██████╗      ██████╗          ██╗    ███████╗     ██████╗    ████████╗    ███████╗
			██╔══██╗    ██╔══██╗    ██╔═══██╗         ██║    ██╔════╝    ██╔════╝    ╚══██╔══╝    ██╔════╝
			██████╔╝    ██████╔╝    ██║   ██║         ██║    █████╗      ██║            ██║       ███████╗
			██╔═══╝     ██╔══██╗    ██║   ██║    ██   ██║    ██╔══╝      ██║            ██║       ╚════██║
			██║         ██║  ██║    ╚██████╔╝    ╚█████╔╝    ███████╗    ╚██████╗       ██║       ███████║
			╚═╝         ╚═╝  ╚═╝     ╚═════╝      ╚════╝     ╚══════╝     ╚═════╝       ╚═╝       ╚══════╝
*/



	var html = '<ol id="project-list">';  // Project listing begins here
	$.each(projects, function(i, item) {
		var p        = projects[i]

		p.vips       = p["Vips"]
		p.fundsCoS   = parseInt(sumArray(p["funds100"])+sumArray(p["funds102"])+sumArray(p["funds103"])+sumArray(p["funds312"])+sumArray(p["funds403"]))
		p.fundsSida  = parseInt(sumArray(p["funds310"])+sumArray(p["funds311"]))
		p.fundsRRM   = parseInt(sumArray(p["funds311"]))
		p.fundsECHO  = parseInt(sumArray(p["funds402"]))
		p.fundsRH    = parseInt(sumArray(p["funds600"]))
		p.funds      = parseFloat(((p.fundsCoS+p.fundsSida+p.fundsECHO+p.fundsRH)/1000000).toFixed(2))
		p.partners   = (p["Partner"]) ? uniqueArray(p["Partner"]).join(", ") : "No partner defined."
		p.sectors    = (p["Sectors"]) ? uniqueArray(p["Sectors"]).join(", ") : "No sectors defined."
		p.code       = p["Code"]
		p.title      = p["Title"]
		p.deployment = p["Deployment"]
		p.monitored  = p["Monitoring visit"].join('; ')
		p.PO         = p["PO"]
		p.country    = p["Country"]
		p.region     = p["Region"]
		p.url        = p["URL"]
		p.level      = p["Level"]
		
        p.year       = p["startDate"].getFullYear().toString()
		p.grantDate  = p["Date of decision"]

		p.millisecsLeft = p.endDate - today;
		p.millisecsPassed = today - p.startDate;
		p.millisecsAll = p.endDate - p.startDate;
		p.monthsLeft = (Math.ceil(p.millisecsLeft / (1000 * 3600 * 24 * 30.4)*10)/10).toFixed(1);
		p.monthsLeftClean = ((p.monthsLeft.slice(-1)>2&&p.monthsLeft.slice(-1)<8)?Number(p.monthsLeft).toFixed(0)-1+".5":Number(p.monthsLeft).toFixed(0));
		p.timeLeft = (p.millisecsLeft < 0) ? "Finished" :((Date.dateDiff('d', today, p.endDate)) < 30)?Math.ceil(p.millisecsLeft/(1000 * 3600 * 24)) + " days left":p.monthsLeftClean+" months left";
		
		var pClasses = [];
		(function addClasses(o) {
			allFilters.forEach(function(i) {
				 pClasses.push(i.cond(o))
			})
		})(item);

		html += '<li id="id'+p.vips+'" class="'+cleanArray(uniqueArray(pClasses)).join(" ")+'">'
			  + '<div class="p-front">'
			  + '<span class="code">'+projects[i].Code+'</span>';
		//html += '<span class="fav" title="Add to favourites"><svg fill="rgba(0,0,0,0.1)" height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>';
		if (p.reportDate!='Invalid Date') {
		html += '<span class="report">Report from partner: <b>' + p.reportDate.getDate() + ' ' + monthName[p.reportDate.getMonth()] + '</b></span>';
		}
		if (p.fundsRRM != 0) {
		html += '<span class="spendrrm">Spend RRM by: <b>' + p.spendRRM.getDate() + ' ' + monthName[p.spendRRM.getMonth()] + '</b>!</span>';
		}
		html += '<span class="title"><b>' + p.title + '</b></span>';
		html += '<span class="funds">' + p.funds + 'M</span>';
		html += '<span class="vips">' + projects[i].Vips + '</span>';
		html += '<span class="country">' + projects[i].Country.join(", ") + '</span>';
		html += '<ul class="badges">';
		if (p.level == "L3") {
		html += '<li class="level" title="Level 3 emergency">L3</li>';
		}
		if (p.deployment) {
		html += '<li class="deployment" title="Deployment">D</li>';
		}
		if (p.monitored) {
		html += '<li class="monitored" title="Monitored">M</li>';
		}
		html += '</ul>';
		html += '</div><!-- .p-front -->';
		html += '<progress value="' + p.millisecsPassed + '" max="' + p.millisecsAll + '"></progress>';
		html += '<div class="p-back">';
		html += '<span class="code">' + projects[i].Code + '</span>';
		html += '<span class="details">';
		html += '<span class="partner">' + p.partners + '</span>';
		html += '<span class="sectors">' + p.sectors + '</span>';
		if (projects[i].Target) {
		html += '<span class="target">Target: <b>' + decCom(projects[i].Target) + '</b> people.</span>';
		}
		html += '</span><!-- .details -->';
		html += '<div class="funds"><div>';
		if (p.fundsCoS != 0) {
		html += '<p><span class="col1 cos">CoS </span><span class="col2">' + decCom(p.fundsCoS.toFixed(0)) + '</span></p>';
		}
		if (p.fundsSida != 0) {
		html += '<p><span class="col1 sida">Sida </span><span class="col2">' + decCom(p.fundsSida.toFixed(0)) + '</span></p>';
		}
		if (p.fundsRH != 0) {
		html += '<p><span class="col1 rh">RH </span><span class="col2">' + decCom(p.fundsRH.toFixed(0)) + '</span></p>';
		}
		if (p.fundsECHO != 0) {
		html += '<p><span class="col1 echo">ECHO </span><span class="col2">' + decCom(p.fundsECHO.toFixed(0)) + '</span></p>';
		}
		html += '</div></div>';
		if (p.url) {
		html += '<a class="vips" href="' + projects[i].URL + '" title="' + p.title + '"><span class="r1">Link to</span><span class="r2">Vips</span><span class="r3">' + projects[i].Vips + '</span></a>';
		} else {html += '<span class="novips">No project link defined</span>';}
		html += '<div class="links">';
		html += '<span class="more" data-projectid="'+projects[i].Vips+'" title="More info"><svg height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></span>';
		if (projects[i].Appeal) {
		html += '<a class="appeal" href="' + projects[i].Appeal + '" title="Appeal (or Application)">APP</a>';
		} else if (projects[i]["Pr-Appeal"]) {
		html += '<a class="appeal" href="' + projects[i]["Pr-Appeal"] + '" title="Preliminary Appeal">P. APP</a>';
		}
		if (projects[i].DB) {
		html += '<a class="db" href="' + projects[i].DB + '" title="Delegationsbeslut">DB</a>';
		}
		html += '</div><!-- .links -->';
		html += '<div class="inset">';
		html += '<span class="days">' + p.timeLeft + '</span>';
		html += '<time class="date-start" title="Project start: ' + formatDate(p.startDate) + '"><span class="year">' + p.startDate.getFullYear() + '</span><span class="month">' + monthShort[p.startDate.getMonth()] + '</span></time>';
		html += '<time class="date-end" title="Project end: ' + formatDate(p.endDate) + '"><span class="year">' + p.endDate.getFullYear() + '</span><span class="month">' + monthShort[p.endDate.getMonth()] + '</span></time>';
		html += '</div>';
		html += '<span class="close" title="Close"></span>';
		html += '</div><!-- .p-back -->';
		html += '<div class="moreinfo">';
		html += '<ul class="indent info2">';
		if (p.spendRRM!='Invalid Date') {
		html += '<li><span>Spend RRM by: </span><span>' + formatDate(p.spendRRM) + '</span></li>';
		}
		if (p.reportDate!='Invalid Date') {
		html += '<li><span>Report from partner: </span><span>' + formatDate(p.reportDate) + '</span></li>';
		}
		if (projects[i].Audit) {
		html += '<li><span>Audit: </span><span>' + projects[i].Audit + '</span></li>';
		}
		if (projects[i]["Sida report"]) {
		html += '<li><span>Sida report: </span><span>' + projects[i]["Sida report"] + '</span></li>';
		}
		if (projects[i]["RH report"]) {
		html += ' <li><span>RH report: </span><span>' + projects[i]["RH report"] + '</span></li>';
		}
		if (projects[i].Deployment) {
		html += '<li class="deployment"><span>Deployment: </span><span>' + projects[i].Deployment + '</span></li>';
		}
		if (p.monitored) {
		html += '<li class="monitored"><span>Monitoring visit: </span><span>' + p.monitored + '</span></li>';
		}
		if (projects[i]["Comments"]) {
		html += '<li class="comments"><span>Comments: </span><span>' + projects[i]["Comments"] + '</span></li>';
		}
		html += '</ul>';
		html += '<ul class="dates"><li><span>Project start: </span><span>' + formatDate(p.startDate) + '</span></li>';
		html += '<li><span>Project end: </span><span>' + formatDate(p.endDate) + '</span></li></ul>';
		html += '</div><!-- .moreinfo -->';
	});
	html += "</ol>";  // Project listing ends here

	var listPO = '';
	$.each(POs.sort(), function (i, item) {
		if (POs[i] != "No Assigned PO") {
			listPO += '<li id="PO-'+acr(POs[i])+'" title="'+POs[i].substr(0, POs[i].indexOf(" "))+'" class="filter" data-filter="'+POs[i]+'">'+acr(POs[i])+'</li>'; // Acronym to ID and text, first name to title
		}
	});
	listPO += '<li id="PO-NAP" title="Show old projects (no assigned PO)" class="filter" data-filter="No Assigned PO">N/A</li>'; // Show the "No Assigned PO" button

	var listYears = '';
	$.each(allYears.sort(), function (i, item) {
		if (!is_iPhone) {
			listYears += '<li id="y-'+allYears[i]+'" class="filter" data-filter="'+allYears[i]+'">'+allYears[i]+'</li>';
		} else {
			listYears += '<li id="y-'+allYears[i]+'" class="filter" data-filter="'+allYears[i]+'">&#39;'+(allYears[i].toString()).substring(2)+'</li>';
		}
	});

	var listRegions = '';
	$.each(allRegions.sort(), function (i, item) {
		if (allRegions[i] != "GLB Global") {
			listRegions += '<li id="r-'+allRegions[i].substr(0,3)+'" class="filter" data-filter="'+allRegions[i]+'" title="'+allRegions[i].substring(4)+'">'+allRegions[i].substr(0,3)+'</li>';
			} 
	});
	listRegions += '<li id="r-GLB" class="filter" data-filter="GLB Global" title="No defined region (global)">GLB</li>';

	var listFilters = ''
	$.each(allFilters.sort(), function (i, item) {
		if (allFilters[i].button != "noButton") {
			listFilters += '<li id="'+allFilters[i].filt+'" class="filter" data-filter="'+allFilters[i].filt+'" title="'+allFilters[i].desc+'">'+allFilters[i].button+'</li>';
		}
	});

   $('#POs').append(listPO);
   $('#years').append(listYears);
   $('#regions').append(listRegions);
   $('#filters').append(listFilters);
   $('#projects').append(html);

   function sortProjects(sortby) {
   		$("#projects>ol>li").sort(function(a,b) {
			if (sortby === 'sortCodeDesc') {
				return ($(b).children('div.p-front').children('span.code').text()) > ($(a).children('div.p-front').children('span.code').text()) ? 1 : -1;
			} else if (sortby === 'sortDateAsc') {
				return ($(b).find('time.date-start').attr('title')) < ($(a).find('time.date-start').attr('title')) ? 1 : -1;
			} else if (sortby === 'sortDateDesc') {
				return ($(b).find('time.date-start').attr('title')) > ($(a).find('time.date-start').attr('title')) ? 1 : -1;    
			} else { // sortCodeAsc
				return ($(b).children('div.p-front').children('span.code').text()) < ($(a).children('div.p-front').children('span.code').text()) ? 1 : -1;
			}})
   		.appendTo('#projects>ol');
   };
   sortProjects(Cookies.get('sortby'));
   $("#container #projects>ol>li").hide();

/*
					██████╗     ███████╗     █████╗     ██████╗     ██╗   ██╗
					██╔══██╗    ██╔════╝    ██╔══██╗    ██╔══██╗    ╚██╗ ██╔╝
					██████╔╝    █████╗      ███████║    ██║  ██║     ╚████╔╝ 
					██╔══██╗    ██╔══╝      ██╔══██║    ██║  ██║      ╚██╔╝  
					██║  ██║    ███████╗    ██║  ██║    ██████╔╝       ██║   
					╚═╝  ╚═╝    ╚══════╝    ╚═╝  ╚═╝    ╚═════╝        ╚═╝   
*/
	$(document).ready(function() {
		$("#loading").remove();

		// Include @scottjehl's Tappy library to remove tap delay from touch devices
		!function(t,n){t.tapHandling=!1,t.tappy=!0;var e=function(e){return e.each(function(){function e(t){n(t.target).trigger("tap",[t,n(t.target).attr("href")])}function i(t){var n=t.originalEvent||t,e=n.touches||n.targetTouches;return e?[e[0].pageX,e[0].pageY]:null}function a(t){if(t.touches&&t.touches.length>1||t.targetTouches&&t.targetTouches.length>1)return!1;var n=i(t);c=n[0],o=n[1]}function r(t){if(!h){var n=i(t);n&&(Math.abs(o-n[1])>s||Math.abs(c-n[0])>s)&&(h=!0)}}function u(n){if(clearTimeout(p),p=setTimeout(function(){t.tapHandling=!1,h=!1},1e3),!(n.which&&n.which>1||n.shiftKey||n.altKey||n.metaKey||n.ctrlKey)){if(n.preventDefault(),h||t.tapHandling&&t.tapHandling!==n.type)return void(h=!1);t.tapHandling=n.type,e(n)}}var p,o,c,h,f=n(this),s=10;f.bind("touchstart.tappy MSPointerDown.tappy",a).bind("touchmove.tappy MSPointerMove.tappy",r).bind("touchend.tappy MSPointerUp.tappy",u).bind("click.tappy",u)})},i=function(t){return t.unbind(".tappy")};if(n.event&&n.event.special)n.event.special.tap={add:function(){e(n(this))},remove:function(){i(n(this))}};else{var a=n.fn.bind,r=n.fn.unbind;n.fn.bind=function(t){return/(^| )tap( |$)/.test(t)&&e(this),a.apply(this,arguments)},n.fn.unbind=function(t){return/(^| )tap( |$)/.test(t)&&i(this),r.apply(this,arguments)}}}(this,jQuery);

		// Include Craig Campbell's Mousetrap plugin to speed up navigation
		!function(e,t,n){function r(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)}function a(e){if("keypress"==e.type){var t=String.fromCharCode(e.which);return e.shiftKey||(t=t.toLowerCase()),t}return p[e.which]?p[e.which]:f[e.which]?f[e.which]:String.fromCharCode(e.which).toLowerCase()}function i(e){var t=[];return e.shiftKey&&t.push("shift"),e.altKey&&t.push("alt"),e.ctrlKey&&t.push("ctrl"),e.metaKey&&t.push("meta"),t}function o(e){return"shift"==e||"ctrl"==e||"alt"==e||"meta"==e}function c(e,t){var n,r,a,i=[];for(n=e,"+"===n?n=["+"]:(n=n.replace(/\+{2}/g,"+plus"),n=n.split("+")),a=0;a<n.length;++a)r=n[a],d[r]&&(r=d[r]),t&&"keypress"!=t&&h[r]&&(r=h[r],i.push("shift")),o(r)&&i.push(r);if(n=r,a=t,!a){if(!u){u={};for(var c in p)c>95&&112>c||p.hasOwnProperty(c)&&(u[p[c]]=c)}a=u[n]?"keydown":"keypress"}return"keypress"==a&&i.length&&(a="keydown"),{key:r,modifiers:i,action:a}}function s(e,n){return null===e||e===t?!1:e===n?!0:s(e.parentNode,n)}function l(e){function n(e){e=e||{};var t,n=!1;for(t in m)e[t]?n=!0:m[t]=0;n||(g=!1)}function s(e,t,n,r,a,i){var c,s,l=[],u=n.type;if(!d._callbacks[e])return[];for("keyup"==u&&o(e)&&(t=[e]),c=0;c<d._callbacks[e].length;++c)if(s=d._callbacks[e][c],(r||!s.seq||m[s.seq]==s.level)&&u==s.action){var p;(p="keypress"==u&&!n.metaKey&&!n.ctrlKey)||(p=s.modifiers,p=t.sort().join(",")===p.sort().join(",")),p&&(p=r&&s.seq==r&&s.level==i,(!r&&s.combo==a||p)&&d._callbacks[e].splice(c,1),l.push(s))}return l}function u(e,t,n,r){d.stopCallback(t,t.target||t.srcElement,n,r)||!1!==e(t,n)||(t.preventDefault?t.preventDefault():t.returnValue=!1,t.stopPropagation?t.stopPropagation():t.cancelBubble=!0)}function p(e){"number"!=typeof e.which&&(e.which=e.keyCode);var t=a(e);t&&("keyup"==e.type&&k===t?k=!1:d.handleKey(t,i(e),e))}function f(e,t,r,i){function o(t){return function(){g=t,++m[e],clearTimeout(y),y=setTimeout(n,1e3)}}function s(t){u(r,t,e),"keyup"!==i&&(k=a(t)),setTimeout(n,10)}for(var l=m[e]=0;l<t.length;++l){var p=l+1===t.length?s:o(i||c(t[l+1]).action);h(t[l],p,i,e,l)}}function h(e,t,n,r,a){d._directMap[e+":"+n]=t,e=e.replace(/\s+/g," ");var i=e.split(" ");1<i.length?f(e,i,t,n):(n=c(e,n),d._callbacks[n.key]=d._callbacks[n.key]||[],s(n.key,n.modifiers,{type:n.action},r,e,a),d._callbacks[n.key][r?"unshift":"push"]({callback:t,modifiers:n.modifiers,action:n.action,seq:r,level:a,combo:e}))}var d=this;if(e=e||t,!(d instanceof l))return new l(e);d.target=e,d._callbacks={},d._directMap={};var y,m={},k=!1,b=!1,g=!1;d._handleKey=function(e,t,r){var a,i=s(e,t,r);t={};var c=0,l=!1;for(a=0;a<i.length;++a)i[a].seq&&(c=Math.max(c,i[a].level));for(a=0;a<i.length;++a)i[a].seq?i[a].level==c&&(l=!0,t[i[a].seq]=1,u(i[a].callback,r,i[a].combo,i[a].seq)):l||u(i[a].callback,r,i[a].combo);i="keypress"==r.type&&b,r.type!=g||o(e)||i||n(t),b=l&&"keydown"==r.type},d._bindMultiple=function(e,t,n){for(var r=0;r<e.length;++r)h(e[r],t,n)},r(e,"keypress",p),r(e,"keydown",p),r(e,"keyup",p)}var u,p={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},f={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},h={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},d={option:"alt",command:"meta","return":"enter",escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"};for(n=1;20>n;++n)p[111+n]="f"+n;for(n=0;9>=n;++n)p[n+96]=n;l.prototype.bind=function(e,t,n){return e=e instanceof Array?e:[e],this._bindMultiple.call(this,e,t,n),this},l.prototype.unbind=function(e,t){return this.bind.call(this,e,function(){},t)},l.prototype.trigger=function(e,t){return this._directMap[e+":"+t]&&this._directMap[e+":"+t]({},e),this},l.prototype.reset=function(){return this._callbacks={},this._directMap={},this},l.prototype.stopCallback=function(e,t){return-1<(" "+t.className+" ").indexOf(" mousetrap ")||s(t,this.target)?!1:"INPUT"==t.tagName||"SELECT"==t.tagName||"TEXTAREA"==t.tagName||t.isContentEditable},l.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)},l.init=function(){var e,n=l(t);for(e in n)"_"!==e.charAt(0)&&(l[e]=function(e){return function(){return n[e].apply(n,arguments)}}(e))},l.init(),e.Mousetrap=l,"undefined"!=typeof module&&module.exports&&(module.exports=l),"function"==typeof define&&define.amd&&define(function(){return l})}(window,document);
		!function(t){var o={},n=t.prototype.stopCallback;t.prototype.stopCallback=function(t,i,a,e){return this.paused?!0:o[a]||o[e]?!1:n.call(this,t,i,a)},t.prototype.bindGlobal=function(t,n,i){if(this.bind(t,n,i),t instanceof Array)for(n=0;n<t.length;n++)o[t[n]]=!0;else o[t]=!0},t.init()}(Mousetrap); // Global binding plugin for Mousetrap for input fields

		Mousetrap.bind(['space', 'mod+f'], function() { 
			$('#live-search span').trigger('click');
			return false;
		});
		Mousetrap.bind(['mod+a', 'shift'], function() { 
			Mousetrap.trigger('esc');
			$('#reset .showall').trigger('click');
			return false;
		});
		function hideProject() {
			$('body').removeClass('fullpage');
			$('#popup').empty().removeClass();
			document.title = 'QuickHUM'
			history.pushState('', document.title, window.location.pathname); //remove hash
		}
		Mousetrap.bindGlobal('esc', function() { 
			if ($('body').hasClass('fullpage')) {
				hideProject();
				return false;
			} else {
				$('#reset .back, #reset .reset').trigger('click');
				return false;
			}
		});
		Mousetrap.bindGlobal('tab', function() { 
			Mousetrap.trigger('esc');
			$('#reset .start').trigger('click');
			return false;
		});
		Mousetrap.bindGlobal('right', function() { 
			$('#projects>ol>li').addClass('on');
			return false;
		});
		Mousetrap.bindGlobal('left', function() { 
			$('#projects>ol>li').removeClass('on');
			return false;
		});

        var currentYears = allGrantStartYears.slice(-3).map(String);
		// used to be [(today.getFullYear()-1).toString(), today.getFullYear().toString()];

		$('#projects>ol li .p-front').bind("tap", function() {
			$(this).parent('li').addClass("on");
		});

		$('#projects>ol li .p-front .fav').bind("tap", function() {
			$(this).addClass('on');
			return false;
			// ADD TO FAVOURITES COOKIE !!! - TO DO
		});

		$('.details span.partner').bind("tap", function() {
			$(this).toggleClass('on');
			$(this).parent('.details').toggleClass('on');
		});

		// POPUP WINDOW
		function popUp(title,content,cssClass,pageTitle) {			
			$('body').addClass('fullpage');
			$('#popup').html('<header><h1><span>'+title+'</span></h1><span class="close" title="Close"></span></header><main>'+content+'</main>').addClass(cssClass);
			if (pageTitle) document.title = pageTitle+' - QuickHUM'; else document.title = title+' - QuickHUM'
			
			$('#popup span.close, #shadow').one('click', function() {
				hideProject();
			});
			
		};
		
		$('#footer .credits').on('click', function() {
			var content = '<section><p>Special thanks to: </p>';
			content += '<ul class="bold"><li>Anne Wachira</li><li>Erik Lindén</li><li>Tamas Marki</li></ul>';
			content += '<p>Open source projects used for building QuickHUM:</p>';
			content += '<ul><li><a href="http://alasql.org/">AlaSQL '+alasql.version+'</a> by Andrey Gerhsun</li>';
			content += '<li><a href="https://github.com/stephen-hardy/xlsx.js/">XLSX.js</a> by Stephen Hardy</li>';
			content += '<li><a href="https://github.com/js-cookie/js-cookie">JavaScript Cookie</a> by Klaus Hartl & Fagner Brack</li>';
			content += '<li><a href="https://gionkunz.github.io/chartist-js/">Chartist.js</a> by Gion Kunz</li>';
			content += '<li><a href="https://github.com/filamentgroup/tappy">Tappy!</a> by Scott Jehl</li>';
			content += '<li><a href="https://github.com/ccampbell/mousetrap">Mousetrap</a> by Craig Campbell</li>';
			content += '<li><a href="https://design.google.com/icons/">Material icons</a> by Google</li>';
			content += '<li><a href="https://jquery.com/">jQuery '+$.fn.jquery;+'</a>';
			content += '<li><a href="http://jsfiddle.net/umaar/t82gZ/">jQuery live search</a> by Umar Hansa</li></ul>';
			content += '<p>Download <em>a copy</em> of the original Excel database file: <a href="'+xlsxurl+'" class="download">'+xlsxurl.split('/').pop()+'</a></p>';
			content += '<p>QuickHUM works in all major browsers, but for best experience please use <a href="https://www.google.com/chrome/browser/desktop/">Chrome</a>!</p>';
			content += '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="5.5 -3.5 64 64"><path d="M37.4-3.5c9 0 16.6 3.1 22.9 9.4 3 3 5.3 6.4 6.9 10.3 1.6 3.9 2.3 8 2.3 12.3 0 4.4-0.8 8.5-2.3 12.3 -1.5 3.8-3.8 7.2-6.8 10.1 -3.1 3.1-6.7 5.4-10.6 7.1 -4 1.6-8.1 2.5-12.3 2.5s-8.3-0.8-12.1-2.4c-3.9-1.6-7.3-4-10.4-7 -3.1-3.1-5.4-6.5-7-10.4S5.5 32.8 5.5 28.5c0-4.2 0.8-8.3 2.4-12.2 1.6-3.9 4-7.4 7.1-10.5C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.5 2.6-18.5 7.7 -2.5 2.6-4.4 5.4-5.8 8.6 -1.4 3.2-2 6.5-2 10 0 3.4 0.7 6.7 2 9.9 1.4 3.2 3.3 6 5.8 8.5 2.5 2.5 5.4 4.4 8.5 5.7 3.2 1.3 6.5 2 9.9 2 3.4 0 6.8-0.7 10-2 3.2-1.3 6.1-3.3 8.7-5.8 5-4.9 7.5-11 7.5-18.3 0-3.5-0.6-6.9-1.9-10.1 -1.3-3.2-3.2-6-5.7-8.5C51 4.8 44.8 2.3 37.6 2.3zM37.2 23.2l-4.3 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l3.9 2c-0.8 1.6-2 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.8-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C32.6 18.6 35.4 20.1 37.2 23.2zM55.6 23.2l-4.2 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l4 2c-0.9 1.6-2.1 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.7-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C51.1 18.6 53.9 20.1 55.6 23.2z"/></svg> ';
			content += '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="5.5 -3.5 64 64"><path d="M37.4-3.5c9 0 16.6 3.1 22.7 9.3C66.4 12 69.5 19.5 69.5 28.5c0 9-3 16.5-9.1 22.5C53.9 57.3 46.2 60.5 37.4 60.5c-8.6 0-16.2-3.1-22.5-9.4C8.6 44.8 5.5 37.3 5.5 28.5c0-8.8 3.1-16.3 9.4-22.7C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.4 2.6-18.5 7.7 -5.2 5.3-7.8 11.5-7.8 18.6 0 7.1 2.6 13.2 7.8 18.4 5.2 5.2 11.4 7.8 18.5 7.8 7.1 0 13.3-2.6 18.6-7.8 5-4.8 7.5-11 7.5-18.3 0-7.3-2.6-13.5-7.7-18.6C51 4.8 44.8 2.3 37.6 2.3zM46.1 20.6v13.1h-3.7v15.5h-9.9V33.6h-3.7V20.6c0-0.6 0.2-1.1 0.6-1.5 0.4-0.4 0.9-0.6 1.5-0.6h13.1c0.5 0 1 0.2 1.4 0.6C45.9 19.5 46.1 20 46.1 20.6zM33 12.3c0-3 1.5-4.5 4.5-4.5s4.5 1.5 4.5 4.5c0 3-1.5 4.5-4.5 4.5S33 15.3 33 12.3z"/></svg> ';
			content += '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="5.5 -3.5 64 64"><path d="M37.4-3.5c9 0 16.5 3.1 22.7 9.3C66.4 12 69.5 19.5 69.5 28.5c0 9-3 16.5-9.1 22.5C53.9 57.3 46.3 60.5 37.4 60.5c-8.6 0-16.2-3.1-22.5-9.4C8.6 44.8 5.5 37.3 5.5 28.5c0-8.7 3.1-16.3 9.4-22.7C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.4 2.6-18.5 7.7 -5.2 5.3-7.8 11.5-7.8 18.5 0 7.1 2.6 13.3 7.8 18.4 5.2 5.2 11.4 7.8 18.5 7.8 7.1 0 13.3-2.6 18.6-7.8 5-4.9 7.5-11 7.5-18.3 0-7.3-2.6-13.5-7.7-18.5C51 4.8 44.8 2.3 37.6 2.3zM23.3 24c0.6-3.9 2.2-7 4.7-9.1 2.6-2.2 5.7-3.2 9.3-3.2 5 0 9 1.6 12 4.9 3 3.2 4.5 7.4 4.5 12.5 0 4.9-1.5 9-4.6 12.3 -3.1 3.3-7.1 4.9-12 4.9 -3.6 0-6.7-1.1-9.4-3.3 -2.6-2.2-4.2-5.3-4.7-9.3H31.1c0.2 3.9 2.5 5.8 7 5.8 2.2 0 4.1-1 5.4-2.9 1.4-1.9 2.1-4.5 2.1-7.8 0-3.4-0.6-6-1.9-7.7 -1.3-1.8-3.1-2.7-5.4-2.7 -4.3 0-6.7 1.9-7.2 5.7h2.3l-6.3 6.3 -6.3-6.3L23.3 24 23.3 24z"/></svg></section>';
			popUp('Credits',content,'credits')
		});
		
		$('#footer .settings').on('click', function() {
			
			var options = '<section>';
			options += '<div><span>Default PO</span><ul class="select pos">';
			options += '<li id="defPO-none" title="Start with a clean sheet">None</li>';
			var i = 0;
			while (POs[i]) {
				if (POs[i] != 'No Assigned PO')
					options += '<li id="defPO-'+acr(POs[i])+'" title="Set '+POs[i]+' as default PO">'+POs[i].substr(0, POs[i].indexOf(" "))+'</li>';
					i++;
			}
			options += '</ul></div>';
			
			options += '<div><span>Colour theme</span><ul class="select themes" title="Change colour">';
			options += '<li id="theme_original">Original</li>';
			options += '<li id="theme_red">Red</li>';
			options += '<li id="theme_green">Green</li>';
			options += '<li id="theme_blue">Blue</li>';
			//options += '<li id="theme_light">Light</li>';
			options += '</ul></div>';

			options += '<div><span>Sort projects by</span><ul class="select sortby">';
			options += '<li id="sortCodeAsc">Code (A&rarr;Z)</li>';
			options += '<li id="sortCodeDesc">Code (Z&rarr;A)</li>';
			options += '<li id="sortDateDesc">Newest first</li>';
			options += '<li id="sortDateAsc">Oldest first</li>';
			options += '</ul></div>';

			options += '<div><span>Years (requires reload):</span><ul class="select showyears">';
			options += '<li id="showYears9" title="Show projects from the last 9 years">Last 9 years</li>';
			options += '<li id="showAllYears" title="Show all projects in the database (slower)">Since '+allGrantStartYears.sort()[0]+'</li>';
			options += '</ul></div>';

			options += '<div><span>Region colours</span><ul class="select showcolours">';
			options += '<li id="showColoursYes" title="">Yes</li>';
			options += '<li id="showColoursNo" title="">No</li>';
			options += '</ul></div></section>';

			popUp('Settings',options,'settings')
			
			
			if (Cookies.get('startPO')) {
				$('#popup.settings ul.pos').find('#'+Cookies.get('startPO')+'').addClass('on');
			} else $('#popup.settings #defPO-none').addClass('on');

			if (Cookies.get('theme')) {
				$('#popup.settings ul.themes').find('#'+Cookies.get('theme')+'').addClass('on');
			} else $('#popup.settings #theme_original').addClass('on');

			if (Cookies.get('sortby')) {
				$('#popup.settings ul.sortby').find('#'+Cookies.get('sortby')+'').addClass('on');
			} else $('#popup.settings #sortCodeAsc').addClass('on');

			if (!Cookies.get('showAllYears')) {
				$('#showYears9').addClass('on');
			} else $('#popup.settings #showAllYears').addClass('on');
			
			if (Cookies.get('showColours')) {
				$('#popup.settings #showColoursYes').addClass('on');
			} else $('#popup.settings #showColoursNo').addClass('on');
			
			function settingsSelect(item) {
				//$('#settings .select li:not(.on):visible').hide();
				item.siblings().toggle();
				item.siblings().removeClass('on');
				item.addClass('on');
			};

			// Bind cookie handling to the PO list created above
			$('#popup.settings .pos li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				Cookies.set('startPO', $(this).attr('id'));
			});

			// Theme selector
			var themes = ['theme_light', 'theme_red','theme_green','theme_blue'];
			$('#popup.settings .themes li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				var theme = $(this).attr('id');
				$('body').removeClass(themes.join(' ')).addClass(theme);
				Cookies.set('theme', theme);
			});

			$('#popup.settings .sortby li').on('click', function(e) {
				e.stopPropagation();
				var sortby = $(this).attr('id');
				if (!$(this).hasClass('on')) { // here this is important otherwise it gets too slow
					Cookies.set('sortby', sortby);
					sortProjects(sortby);
				}
				settingsSelect($(this));
			});

			// Show All Years or not
			$('#popup.settings .showyears li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				var thisid = $(this).attr('id');
				
				if (thisid == 'showAllYears') {
					Cookies.set('showAllYears', 'yes');
				} else Cookies.remove('showAllYears');
				
				if ($(this).hasClass('on')) {
					if (!$('body').hasClass(thisid)) {
						$('#reset .back').addClass('reload').attr('title','Reload page');
					} else {
						$('#reset .back').removeClass('reload').removeAttr('title');
					}
				}
			});

			$('#popup.settings .showcolours li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				var thisid = $(this).attr('id');
				if (thisid == 'showColoursYes') {
					Cookies.set('showColours', 'yes');
					$('body').addClass('showPrRegions');
				} else {
					Cookies.remove('showColours');
					$('body').removeClass('showPrRegions');					
				}
			});

		
			$(document).click(function(){
				$('#popup.settings .select li:not(.on)').hide();
			});

			$('#cookieconsent span').on('click', function(e) {
				Cookies.set('cookieconsent', today);
				$('#cookieconsent').remove();
			});
			
			
			
			
			

		});
		
		// this will show the full page project page
		function showProject(id) {
			if (id) { // if user clicks on "More info"
				window.location.hash = id;
			} else if (window.location.hash) { // if user arrives from hash link, use that as id
				var id = window.location.href.split('#')[1];
			}
			if (id == null) {} else {

				$('body').addClass('fullpage');

				var thisproject = $('ol#project-list li#id'+id),
					grantsTable = alasql('SELECT [Date of decision], ARRAY([Date of disbursement]) AS [Disbursements], ARRAY([Partner]) AS [Partners], ARRAY([DB]) AS [DBs] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					PO = alasql('SELECT VALUE FIRST([PO]) FROM ? WHERE [Vips] = "'+id+'"',[grants]);
				
				// Probably faster to get these from the existing html tags:
				var code = $(thisproject).find('.p-front .code').text(),
					title = $(thisproject).find('.p-front .title b').text(),
					country = $(thisproject).find('.p-front .country').text(),
					partner = $(thisproject).find('.p-back .details .partner').text(),
					sectors = $(thisproject).find('.p-back .details .sectors').text(),
					vipslink = $(thisproject).find('.p-back a.vips').attr('href'),
					frnumber = cleanArray(uniqueArray(alasql('SELECT COLUMN ([Fundraising number]) FROM ? WHERE [Vips] = "'+id+'"',[grants])));
				
				var f100 = alasql('SELECT ARRAY([Own funds (100)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f102 = alasql('SELECT ARRAY([Raised funds (102)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f103 = alasql('SELECT ARRAY([Withdrawal (103)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f312 = alasql('SELECT ARRAY([Own contribution Sida (312)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f403 = alasql('SELECT ARRAY([Own contribution ECHO (403)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f310 = alasql('SELECT ARRAY([Sida major HUM (310)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f311 = alasql('SELECT ARRAY([Sida RRM (311)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f402 = alasql('SELECT ARRAY([ECHO (402)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]),
					f600 = alasql('SELECT ARRAY([Radiohjälpen (600)]) AS [Disbursements] FROM ? WHERE [Vips] = "'+id+'" GROUP BY [Date of decision] ORDER BY [Date of decision]',[grants]);
								
				info = '<li><span>Project ID: </span><span><a href="http://bit.do/qhum#'+id+'" class="link" title="Permalink to this project page">'+id+'</a></span></li>'
					 + '<li><span>Project code: </span><span>'+code+'</span></li>'
					 + '<li><span>Country: </span><span>'+country+'</span></li>';
				if (partner) info += '<li><span>Partners: </span><span>'+partner+'</span></li>';
				if (sectors) info += '<li><span>Sectors: </span><span>'+sectors+'</span></li>';
				if (frnumber.length>0) info += '<li><span>Fundraising number: </span><span>'+frnumber.join(', ')+'</span></li>';
				if (PO) info += '<li><span>Programme officer: </span><span>'+PO+'</span></li>';
				
				html = '<b>Grant history:</b> <table><th>DB date</th><th>Disbursed</th><th>Type of funds</th><th>Grantee</th><th>Amount</th>';

				for (var i = 0, len = grantsTable.length; i < len; i++) {
					
					var disbursements = grantsTable[i]["Disbursements"],
						partners = grantsTable[i]["Partners"],
						DBs = grantsTable[i]["DBs"],
						rspanDec = cleanArray(f100[i]["Disbursements"].concat(f102[i]["Disbursements"],f103[i]["Disbursements"],f312[i]["Disbursements"],f403[i]["Disbursements"],f310[i]["Disbursements"],f311[i]["Disbursements"],f402[i]["Disbursements"],f600[i]["Disbursements"])).length,
						rowsDec = 0;
					
					for (var d = 0, len2 = disbursements.length; d < len2; d++) {
						
						var rspanDis = cleanArray([f100[i]["Disbursements"][d],f102[i]["Disbursements"][d],f103[i]["Disbursements"][d],f312[i]["Disbursements"][d],f403[i]["Disbursements"][d],f310[i]["Disbursements"][d],f311[i]["Disbursements"][d],f402[i]["Disbursements"][d],f600[i]["Disbursements"][d]]).length,
							rowsDis = 0;
						
						function grantrow(type,grantee,amount) {

							if (DBs[d]) var dateDecision = '<a href="'+DBs[d]+'" title="Open DB'+formatDate(grantsTable[i]["Date of decision"],"YYMMDD")+'">'+formatDate(grantsTable[i]["Date of decision"])+'</a>';
							else var dateDecision = formatDate(grantsTable[i]["Date of decision"]);
						
							html += '<tr>';
							if (rowsDec==0) html += '<td class="date" rowspan="'+rspanDec+'">'+dateDecision+'</td>';
							if (rowsDis==0) html += '<td class="date" rowspan="'+rspanDis+'">'+formatDate(disbursements[d])+'</td>';
							html += '<td>'+type+'</td>'
								  + '<td>'+grantee+'</td>'
								  + '<td class="amount">'+decCom(parseInt(amount))+' SEK</td>'
								  + '</tr>'
							
							rowsDec++; rowsDis++;
						}
						
						if (f310[i]["Disbursements"][d]) grantrow('Sida Major HUM (310)',partners[d],f310[i]["Disbursements"][d]);
						if (f311[i]["Disbursements"][d]) grantrow('Sida RRM / Minor HUM (311)',partners[d],f311[i]["Disbursements"][d]);
						if (f402[i]["Disbursements"][d]) grantrow('ECHO (402)',partners[d],f402[i]["Disbursements"][d]);
						if (f600[i]["Disbursements"][d]) grantrow('RH/MH/VB (600)',partners[d],f600[i]["Disbursements"][d]);
						if (f100[i]["Disbursements"][d]) grantrow('CoS (100)',partners[d],f100[i]["Disbursements"][d]);
						if (f102[i]["Disbursements"][d]) grantrow('CoS (102)',partners[d],f102[i]["Disbursements"][d]);
						if (f103[i]["Disbursements"][d]) grantrow('CoS (103)',partners[d],f103[i]["Disbursements"][d]);
						if (f312[i]["Disbursements"][d]) grantrow('CoS (312)',partners[d],f312[i]["Disbursements"][d]);
						if (f403[i]["Disbursements"][d]) grantrow('CoS (403)',partners[d],f403[i]["Disbursements"][d]);
						
					}
					
				}
				html += '<tr class="sum"><td colspan="4">Total</td><td class="amount">'+decCom(alasql('SELECT VALUE SUM([fundsCoS])+SUM([fundsECHO])+SUM([fundsRH])+SUM([fundsSida]) FROM ? WHERE [vips] = "'+id+'"',[projects]))+' SEK</td>'+
						'</table>';
				
				if ($(thisproject).hasClass('appeal')) {
					html += '<p class="link-rviewer"><a href="http://reports.actalliance.org/ReportServer/Pages/ReportViewer.aspx?%2fExt_Act_Reports%2fAppeals&Appeal='+code+'">Open '+code+' in ACT Report Viewer</a></p>';
				};
				
				var content = '<ul class="indent info1">'+info+'</ul>'
				content += $(thisproject).find('.moreinfo').html();
				if(vipslink) {content += '<a class="vipslink" href="'+vipslink+'"><span class="r1">Link to</span> <span class="r2">Vips</span></a>'}
				content += '<div class="grantlist">'+html+'</ul>'

				popUp(title,content,'project',code)
			}
		};

		$('#projects>ol li span.close').bind("tap", function() {
			$(this).parent().parent('li').removeClass('on');
		});
		
		function toggle(S, x) {
			S[x] = 1 - (S[x]|0);
		}
		
		function toggleArrayItem(a, v) {
			var i = a.indexOf(v);
			if (i === -1) a.push(v);
			else a.splice(i,1);
		}

		$.fn.extend({ hasClasses: function (selectors) {
			var self = this;
			for (var i in selectors) {
				if ($(self).hasClass(selectors[i])) 
					return true;
				}
			return false;
		}});

		// Update calculator in sidebar
		function updCalc() {
			var n = $('#project-list li:visible').length,
			h = '<span>Showing <b>'+n+'</b> project'+pl(n)+'</span>';
			
			if (n>0) $('#calculator').show().html(h);
			else $('#calculator').empty().hide();
		}
		
		function applyFilter(e, a) {
			$(e).toggleClass("on");
			toggleArrayItem(a, e.attr("data-filter"));
			var ST = showThese.map(function(s) {
				return "."+s;
			});
			var PO = classesPO.sort().map(function(s) {
				return ".PO-"+acr(s);
			});
			var YR = classesYears.sort().map(function(s) {
				return ".y-"+s;
			});
			var RE = classesRegions.sort().map(function(s) {
				return ".r-"+s.substr(0,3);
			});
			var listElement = (ST.length!=0)?"#container #projects>ol>li"+ST.join(""):"#container #projects>ol>li";
			$("#container #projects>ol>li").hide();
			$(listElement).filter(PO.join()).filter(YR.join()).filter(RE.join()).show();

			$('#explain li ul li').removeClass("first last");
			$('#explain li ul').find('li:visible:first').addClass("first");
			$('#explain li ul').find('li:visible:last').addClass("last");

			$("#reset .start, #reset .showall").hide();
			$("#reset .reset").css('display', 'block');
			if (classesPO.length==0 && classesYears.length==0 && classesRegions.length==0 && showThese.length==0) { $( "#reset .reset" ).trigger("click") }; 
			updCalc();
			consolelog();
						
		};

		function addFilter(f, a) {
			$('#'+f).toggleClass('on');
			toggleArrayItem(a, f);
		};

		var classesPO      = [];
		var classesRegions = [];
		var classesYears   = [];
		var showThese      = []; // filters like Sida, LWF, etc.

		consolelog();

		showProject()

		$('#explain li ul').find('li:visible:first').addClass("first");
		$('#explain li ul').find('li:visible:last').addClass("last");

		function showStart(all) {
			classesPO      = POs;
			classesRegions = allRegions;
			classesYears   = [(today.getFullYear()-1).toString(), today.getFullYear().toString()];
			showThese      = []; // filters like Sida, LWF, etc.

    		$("#container").addClass("y-"+(today.getFullYear()-1)+" "+"y-"+(today.getFullYear())+" "
    			+$.map(POs, function(s) { return "PO-"+acr(s)}).join(" ")+" "
    			+$.map(classesRegions, function(s) { return "r-"+s.substr(0,3) }).join(" "));

    		$("#y-"+(today.getFullYear()-1)+", "+"#y-"+(today.getFullYear())+", "+$.map(POs, function(s) { return "#PO-"+acr(s)}).join(", ")+", "+$.map(classesRegions, function(s) { return "#r-"+s.substr(0,3) }).join(", ")+"").addClass("on");

    		var ST = showThese.map(function(s) {
    			return "."+s;
    		});
    		var PO = classesPO.sort().map(function(s) {
    			return ".PO-"+acr(s);
    		});
    		var YR = classesYears.sort().map(function(s) {
    			return ".y-"+s;
    		});
    		var RE = classesRegions.sort().map(function(s) {
    			return ".r-"+s.substr(0,3);
    		});
    		var listElement = (ST.length!=0)?"#container ol>li"+ST.join(""):"#container ol>li";
    		$("#container #projects>ol>li").hide();
    		$(listElement).filter(PO.join()).filter(YR.join()).filter(RE.join()).show();
			$( "#filters #active" ).trigger("click");
			updCalc();
		};

		// Start button
		$("#reset .start").bind("tap", function() {
    		$(this).hide();
    		$("#reset .reset").css('display', 'block');
    		showStart();
			window.scrollTo(0,0);
		});
		
		// Show all button
		$("#reset .showall").bind("tap", function() {
			$(this).hide();
			$("#reset .start").hide();
			$("#reset .reset").css('display', 'block');
			$("#container ol>li").css('display', 'inline-block');
			$("#POs>li, #years>li, #regions>li").addClass("on");
			$("#filters>li").removeClass("on");
			$('#projects>ol>li').removeClass('on');
			classesPO      = POs;
			classesYears   = allYears.map(function(s) {return s.toString()});
			classesRegions = allRegions;
			showThese      = [];
			consolelog();
			window.scrollTo(0,0);
		});
				
		// Reset button
		$("#reset .reset").bind("tap", function() {
			$(this).hide();
			$("#reset .start").css('display', 'block');
			$("#container #projects>ol>li, #explain").hide();
			$("#container").removeClass();
			$('body').removeClass('pageSearch pageSettings');
			$("#header li, #live-search, #filter, #filters>li, #projects>ol>li").removeClass("on");
			$('#filter-count').css('display', 'none');
			$("#filter").val('');
			if(is_iPhone) $("#reset .showall").css('display', 'block');
			classesPO      = [];
			classesRegions = [];
			classesYears   = [];
			showThese      = [];
			updCalc();
			consolelog();
			window.scrollTo(0,0);
		});

		// Back button
		$("#reset .back").bind("tap", function() {
			if (!$(this).hasClass('reload')) {
				$('body').removeClass('pageStats pageSettings');
			} else location.href = location.href; //location.reload();
			window.scrollTo(0,0);
		});

		// FILTERS
		$("#filters li").bind("tap", function() {
			if (classesYears.length==0) { // if no years are selected, select the current year and last year
				classesYears = classesYears.concat(currentYears);//(today.getFullYear()-1).toString(), today.getFullYear().toString());
				$("#container").addClass($.map(currentYears, function(s) { return "y-"+s }).join(" "));//"y-"+(today.getFullYear()-1)+" y-"+(today.getFullYear()));
                $(""+(currentYears.map(function(s) {return "#y-"+s})).join(", ")+"").addClass("on");
			}
			if (classesRegions.length==0) { // if no regions are selected, select all of them
				classesRegions = classesRegions.concat(allRegions);
				$("#container").addClass($.map(classesRegions, function(s) { return "r-"+s.substr(0,3) }).join(" "));
				$($.map(classesRegions, function(s) { return "#r-"+s.substr(0,3) }).join(", ")).addClass("on");           
			}
            if (classesPO.length==0) { // if no POs are selected, select all of them
                classesPO = classesPO.concat(POs);
                $("#container").addClass((classesPO.map(function(s) {return "PO-"+acr(s)})).join(" ")+"");
                $(""+(classesPO.map(function(s) {return "#PO-"+acr(s)})).join(", ")+"").addClass("on");

            }
			$("#container").toggleClass($(this).attr("id"));
			applyFilter($(this), showThese);
		});

		// POs
		$("#POs li").bind("tap", function() {
			$("#container").toggleClass("PO-"+acr($(this).attr("data-filter")));
            if (classesPO.length==0 && classesYears.length==0 && classesRegions.length==0 ) {

				if ($(this).attr('id') !== 'PO-NAP') { addFilter('active', showThese) }; // only show the PO's ongoing projects - except if it's the old projects (PO-NAP)

                var currPO = ($(this).attr("data-filter") != "No Assigned PO") ? '"'+$(this).attr("data-filter")+'"' : "undefined" // so that the empty cells in the PO column count as PO-NAP

                POregion = (alasql('SELECT COLUMN([region]) FROM ? WHERE [PO] = '+currPO+' GROUP BY [region]',[projects])).map(function(s) {if (s == undefined) return "GLO Global"; else return s}) // list the PO's projects' regions, change undefined to "GLO Global".
                
                POyear = cleanArray((alasql('SELECT COLUMN([year]) FROM ? WHERE [PO] = '+currPO+' GROUP BY [year]',[projects])).map(function(s) {
                        if (s != undefined && s != "NaN") {return s}
                })) // list the PO's projects' years, except if it's undefined or bad date (NaN)

                classesRegions = classesRegions.concat(POregion);
                classesYears   = classesYears.concat(POyear);

                $(""+(classesYears.map(function(s) {return "#y-"+s})).join(", ")+"").addClass("on");
                $(""+(classesRegions.map(function(s) {return "#r-"+s.substr(0,3)})).join(", ")+"").addClass("on");

                $("#container").addClass((classesRegions.map(function(s) {return "r-"+s.substr(0,3)})).join(" ")+" "+(classesYears.map(function(s) {return "y-"+s})).join(" "));

            }
			applyFilter($(this), classesPO);
		});

		// YEARS
		$("#years li").bind("tap", function() {
			$("#container").toggleClass("y-"+$(this).attr("data-filter"));
			applyFilter($(this), classesYears);
		});
		
		// REGIONS
		$("#regions li").bind("tap", function() {
			$("#container").toggleClass("r-"+$(this).attr("data-filter").substr(0,3));
			if (classesPO.length==0 && classesYears.length==0 && classesRegions.length==0 ) {

				addFilter('active', showThese);

				regionPO = (alasql('SELECT COLUMN([PO]) FROM ? WHERE [region] = "'+$(this).attr("data-filter")+'" GROUP BY [PO]',[projects])).map(function(s) {if (s == undefined) return "No Assigned PO"; else return s}); // list the region's POs, change undefined to "No Assigned PO"
				
                regionYear = cleanArray((alasql('SELECT COLUMN([year]) FROM ? WHERE [region] = "'+$(this).attr("data-filter")+'" GROUP BY [year]',[projects])).map(function(s) {
                        if (s != undefined && s != "NaN") {return s}
                }))

                classesPO    = classesPO.concat(regionPO);
				classesYears = classesYears.concat(regionYear);

                $(""+(classesYears.map(function(s) {return "#y-"+s})).join(", ")+"").addClass("on");
                $(""+(classesPO.map(function(s) {return "#PO-"+acr(s)})).join(", ")+"").addClass("on");

				$("#container").addClass((classesPO.map(function(s) {return "PO-"+acr(s)})).join(" ")+" "+(classesYears.map(function(s) {return "y-"+s})).join(" "));
    
    		}
			applyFilter($(this), classesRegions);
		});

		// Live search
		$("#filter").keyup(function(){
			// Retrieve the input field text and reset the count to zero
			var filter = $(this).val(), count = 0;
			var ST = showThese.map(function(s) {
				return "."+s;
			});
			var PO = classesPO.sort().map(function(s) {
				return ".PO-"+acr(s);
			});
			var YR = classesYears.sort().map(function(s) {
				return ".y-"+s;
			});
			var RE = classesRegions.sort().map(function(s) {
				return ".r-"+s.substr(0,3);
			});
			var listElement = (ST.length!=0)?"#container ol>li"+ST.join(""):"#container ol>li";
			$("#container #projects>ol>li").hide();
			$(listElement).filter(PO.join()).filter(YR.join()).filter(RE.join()).show();

			// Loop through the project list
			$(listElement).filter(PO.join()).filter(YR.join()).filter(RE.join()).each(function(){

				// If the list item does not contain the text phrase hide it
				if ($(this).text().search(new RegExp(filter, "i")) < 0) {
					$(this).hide();

				// Show the list item if the phrase matches and increase the count by 1
				} else {
					$(this).show();
					count++;
				}
			});

			// Update the count
			var numberItems = count;
			$("#filter-count").text(count);
		});

		$("#live-search span").bind("tap", function() {
			$('body').removeClass('pageSettings').addClass('pageSearch');
			$('#live-search input').select();
			$("#reset .showall").trigger( "click" );
		});
		$("#filter").keydown(function(){
			$(this).addClass("on");
			$('#filter-count').css('display', 'inline-block');
		});
		$("#menu span").bind("tap", function() {
			$('body').addClass('pageMenu');
		});

		if(Cookies.get('startPO') && Cookies.get('startPO') != 'defPO-none') {
			$('#POs #'+Cookies.get('startPO').substr(3)).trigger('click')
		};
		
		

/*
					███████╗    ████████╗     █████╗     ████████╗    ███████╗
					██╔════╝    ╚══██╔══╝    ██╔══██╗    ╚══██╔══╝    ██╔════╝
					███████╗       ██║       ███████║       ██║       ███████╗
					╚════██║       ██║       ██╔══██║       ██║       ╚════██║
					███████║       ██║       ██║  ██║       ██║       ███████║
					╚══════╝       ╚═╝       ╚═╝  ╚═╝       ╚═╝       ╚══════╝
*/

		// chartist tooltip plugin by Gion Kunz
		!function(a,b){"function"==typeof define&&define.amd?define(["chartist"],function(c){return a.returnExportsGlobal=b(c)}):"object"==typeof exports?module.exports=b(require("chartist")):a["Chartist.plugins.tooltips"]=b(Chartist)}(this,function(a){return function(a,b,c){"use strict";function d(a){a.classList.add("tooltip-show")}function e(a){a.classList.remove("tooltip-show")}function f(a,b){return(" "+a.getAttribute("class")+" ").indexOf(" "+b+" ")>-1}function g(a,b){do a=a.nextSibling;while(a&&!f(a,b));return a}function h(a){return a.innerText||a.textContent}var i={currency:void 0,tooltipOffset:{x:0,y:-20},appendToBody:!1,"class":void 0};c.plugins=c.plugins||{},c.plugins.tooltip=function(a){return a=c.extend({},i,a),function(i){function j(a,b,c){m.addEventListener(a,function(a){(!b||f(a.target,b))&&c(a)})}function k(b){o=o||n.offsetHeight,p=p||n.offsetWidth,a.appendToBody?(n.style.top=b.pageY-o+a.tooltipOffset.y+"px",n.style.left=b.pageX-p/2+a.tooltipOffset.x+"px"):(n.style.top=(b.layerY||b.offsetY)-o+a.tooltipOffset.y+"px",n.style.left=(b.layerX||b.offsetX)-p/2+a.tooltipOffset.x+"px")}var l="ct-point";i instanceof c.Bar?l="ct-bar":i instanceof c.Pie&&(l=i.options.donut?"ct-slice-donut":"ct-slice-pie");var m=i.container,n=m.querySelector(".chartist-tooltip");n||(n=b.createElement("div"),n.className=a["class"]?"chartist-tooltip "+a["class"]:"chartist-tooltip",a.appendToBody?b.body.appendChild(n):m.appendChild(n));var o=n.offsetHeight,p=n.offsetWidth;e(n),j("mouseover",l,function(b){var e=b.target,f="",j=e.getAttribute("ct:meta")||"",l=e.getAttribute("ct:value");if(a.tooltipFnc)f=a.tooltipFnc(j,l);else{if(j='<span class="chartist-tooltip-meta">'+j+"</span>",l='<span class="chartist-tooltip-value">'+parseFloat((l/1000000).toFixed(2))+" M</span>",j)f+=j+"<br>";else if(i instanceof c.Pie){var m=g(e,"ct:meta");m.length>0&&(f+=h(m)+"<br>")}a.currency&&(l=a.currency+l.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g,"$1,")),f+=l}n.innerHTML=f,k(b),d(n),o=n.offsetHeight,p=n.offsetWidth}),j("mouseout",l,function(){e(n)}),j("mousemove",null,function(a){k(a)})}}}(window,document,a),a.plugins.tooltips});

		// chartist legend plugin by CodeYellowBV (minus the use of labels - use name instead)
		(function (root, factory) {
		    if (typeof define === 'function' && define.amd) {
		        // AMD. Register as an anonymous module.
		        define(['chartist', 'jquery'], function (chartist, jquery) {
		            return (root.returnExportsGlobal = factory(chartist, jquery));
		        });
		    } else if (typeof exports === 'object') {
		        // Node. Does not work with strict CommonJS, but
		        // only CommonJS-like enviroments that support module.exports,
		        // like Node.
		        module.exports = factory(require('chartist'), require('jquery'));
		    } else {
		        root['Chartist.plugins.legend'] = factory(root.chartist, root.jquery);
		    }
		}(this, function () {
		    // This Chartist plugin creates a legend to show next to the chart.
		    (function (Chartist, $) {
		        'use strict';

		        var defaultOptions = {
		            className: '',
		            legendNames: false,
		            clickable: true
		        };

		        Chartist.plugins = Chartist.plugins || {};

		        Chartist.plugins.legend = function (options) {

		            options = Chartist.extend({}, defaultOptions, options);

		            return function legend(chart) {

		                // Set a unique className for each series so that when a series is removed,
		                // the other series still have the same color.
		                if (options.clickable) {
		                    chart.data.series.forEach(function (series, seriesIndex) {
		                        if (typeof series !== 'object') {
		                            series = {
		                                data: series
		                            };
		                        }

		                        series.className = series.className || chart.options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex);
		                    });
		                }

		                var $chart = $(chart.container),
		                    legendClass = chart instanceof Chartist.Pie ? 'ct-legend-inside' : '',
		                    $legend = $chart.siblings('div.legend')
		                    .html('<ul class="ct-legend"></ul>')
		                    .find('.ct-legend')
		                    .addClass(legendClass)
		                    .addClass(options.className);
							
		                var insertLegendItem = function (i, name, v) {
							name = (options.shorten) ? name.substring(4) : name; // get rid of the region codes
		                    if (v != 0) {
								$legend.append('<li class="ct-series-' + i + '" data-legend="' + i + '"><svg width="20" height="20"><rect width="20" height="20"/></svg> <span class="name">' + name + '</span> <span class="funds">'+ decCom(parseInt(v).toFixed()) +' SEK</span></li>');
		                    }
		                };

		                var removedSeries = [],
		                    originalSeries = chart.data.series.slice(0);

		                if (options.clickable) {
		                    $legend.on('click', 'li', function (e) {
		                        e.preventDefault();

		                        var seriesIndex = parseInt($(this).attr('data-legend')),
		                            removedSeriesIndex = removedSeries.indexOf(seriesIndex);

		                        if (removedSeriesIndex > -1) {
		                            // Add to series again.
		                            removedSeries.splice(removedSeriesIndex, 1);

		                            $(this).removeClass('inactive');
		                        } else {
		                            // Remove from series, only if a minimum of one series is still visible.
		                            if (chart.data.series.length > 1) {
		                                removedSeries.push(seriesIndex);

		                                $(this).addClass('inactive');
		                            }
		                        }

		                        // Reset the series to original and remove each series that
		                        // is still removed again, to remain index order.
		                        var seriesCopy = originalSeries.slice(0);

		                        // Reverse sort the removedSeries to prevent removing the wrong index.
		                        removedSeries.sort().reverse();

		                        removedSeries.forEach(function (series) {
		                            seriesCopy.splice(series, 1);
		                        });

		                        chart.data.series = seriesCopy;

		                        chart.update();
		                    });
		                }

		                // Get the right array to use for generating the legend.
		                var legendNames = chart.data.series;

		                legendNames = options.legendNames || legendNames;

		                // Loop through all legends to set each name in a list item.
		                legendNames.forEach(function (legend, i) {
		                    var legendName = legend.name || legend;

		                    insertLegendItem(i, legendName, legend.value);
		                });

		                
		                $legend.append('<li class="ct-series-total"><span class="name">TOTAL</span><span class="funds">'+decCom(sumObjProps(legendNames, "value"))+' SEK</span></li>');
		            };

		        };

		    }(Chartist, $));

		    return Chartist.plugins.legend;

		}));

	   	// Look up funds from array (like allStats) per year (and if 'd' if defined per donor)
		function findByYear(a, y, d) {
			for (var i = 0; i < a.length; i++) {
				var result = [];
		    	if (a[i].Year === y) {
		      		if (d) {
		      			result = a[i][d]
		      		}
		      		else {
		      			for (var v in a[i]) {
		      				if (a[i][v] !== y) {
		      					for (var vv in a[i][v]) {
									result.push(a[i][v][vv])
								}
							}
						}
		      		}
			    	return cleanArray(result)
		    	}
			}
			return null
		};

		function sumStatYear (donor, year) {
			return sumArray(findByYear(allStats, year, donor)).toFixed();
		};

		function updChart (year) {

			$('#grantYears>li').removeClass('on');
			$('#grantYears li#gy-'+year).addClass('on');

			var stats = alasql('SELECT [Region], SUM([Own funds (100)])+SUM([Raised funds (102)])+SUM([Withdrawal (103)])+SUM([Own contribution Sida (312)])+SUM([Own contribution ECHO (403)]) AS [CoS], SUM([Sida major HUM (310)])+SUM([Sida RRM (311)]) AS [Sida], SUM([ECHO (402)]) AS [ECHO], SUM([Radiohjälpen (600)]) AS [RH] FROM ? WHERE [Year] = "'+year+'" GROUP BY [Region]',[grants]);

			function sumDonor (donor) {
				var result = alasql('SELECT VALUE SUM(['+donor+']) FROM ?',[stats]);
				return (result) ? result : 0;
			};
			function sumRegion (region) {
				var result = alasql('SELECT VALUE SUM([CoS])+SUM([Sida])+SUM([ECHO])+SUM([RH]) FROM ? WHERE [Region] = "'+region+'"',[stats]);
				return (result) ? result : 0;
			};

			grantStat.series[0].value = sumDonor('CoS');
			grantStat.series[1].value = sumDonor('Sida');
			grantStat.series[2].value = sumDonor('RH');
			grantStat.series[3].value = sumDonor('ECHO');

			grantStatRegions.series[0].value = sumRegion('AFR Africa');
			grantStatRegions.series[1].value = sumRegion('ASP Asia-Pacific');
			grantStatRegions.series[2].value = sumRegion('EUR Europe');
			grantStatRegions.series[3].value = sumRegion('GLB Global');
			grantStatRegions.series[4].value = sumRegion('LAC Latin America and Caribbean');
			grantStatRegions.series[5].value = sumRegion('MEA Middle East');

			$("#stats h1").html(year);
			var donorYear = new Chartist.Pie('.grantStat .ct-chart', grantStat, {
				width: 400, height: 400, 
			  	plugins: [Chartist.plugins.legend({clickable:false})],
			  	labelInterpolationFnc: function(v) {
			  		var percentage = Math.round(v / sumObjProps(grantStat.series, 'value') * 100)
	    			if (percentage > 4) return percentage + '%' // show percentage only if chart slice is big enough
	  			}, legendNames: name
			});
			var regionYear = new Chartist.Pie('.grantStatRegions .ct-chart', grantStatRegions, {
				width: 400, height: 400, 
			  	plugins: [Chartist.plugins.legend({clickable:false, shorten:true})],
			  	labelInterpolationFnc: function(v) {
			  		var percentage = Math.round(v / sumObjProps(grantStatRegions.series, 'value') * 100)
	    			if (percentage > 4) return percentage + '%' // show percentage only if chart slice is big enough
	  			}, legendNames: name, donut: true
			});

			$('#stats .grantStatNumbers .n-partners strong').html(alasql('SELECT VALUE COUNT(DISTINCT [Partner]) FROM ? WHERE [Year] = "'+year+'"',[grants]))
			$('#stats .grantStatNumbers .n-appeals strong').html(alasql('SELECT VALUE COUNT(DISTINCT [Vips]) FROM ? WHERE [Year] = "'+year+'" AND [Bilat/ACT] = "ACT"',[grants]))
			$('#stats .grantStatNumbers .n-bilat strong').html(alasql('SELECT VALUE COUNT(DISTINCT [Vips]) FROM ? WHERE [Year] = "'+year+'" AND [Bilat/ACT] = "Bilateral"',[grants]))
			$('#stats .grantStatNumbers .n-appeals i').html(alasql('SELECT VALUE COUNT(*) FROM ? WHERE [Year] = "'+year+'" AND [Bilat/ACT] = "ACT"',[grants]))
			$('#stats .grantStatNumbers .n-bilat i').html(alasql('SELECT VALUE COUNT(*) FROM ? WHERE [Year] = "'+year+'" AND [Bilat/ACT] = "Bilateral"',[grants]))
		
		};
		
		// List grant years in header
		var listGrantYears = '';
		$.each(allGrantYears.sort(), function (i, item) {
			listGrantYears += '<li id="gy-'+allGrantYears[i]+'" class="filter" data-filter="'+allGrantYears[i]+'">'+allGrantYears[i]+'</li>';
		});
		$('#grantYears').append(listGrantYears);

		// List grant regions in header
		var listGrantRegions = '';
		$.each(allRegions.sort(), function (i, item) {
			listGrantRegions += '<li id="gr-'+allRegions[i]+'" class="filter" data-filter="'+allRegions[i]+'">'+allRegions[i].substring(4)+'</li>';
		});
		//$('#grantRegions').append(listGrantRegions);

		// Setup the list of donors in the right format for the chart
		var grantStat = {
		 	series: [
			  	{value: 0, name: 'Church of Sweden', meta: 'CoS'},
			  	{value: 0, name: 'Sida', meta: 'Sida'},
			  	{value: 0, name: 'Radiohjälpen', meta: 'Radiohjälpen'},
			  	{value: 0, name: 'ECHO', meta: 'ECHO'}
			]
		};

		// Setup the list of regions in the right format for the chart
		var grantStatRegions = {series: []};
		(function(){
			var arLength = allRegions.length;
			for (var i = 0; i < arLength; i++) {
		    	var s = allRegions[i];
	    		grantStatRegions.series.push({value: 0, name: s, meta: s})
			}
		})();

		// This only needs to be updated once as it is an overview containing all the years.
		function updCompare() {

			var statsCoS = alasql('SELECT COLUMN(SUM([Own funds (100)])+SUM([Raised funds (102)])+SUM([Withdrawal (103)])+SUM([Own contribution Sida (312)])+SUM([Own contribution ECHO (403)])) FROM ? GROUP BY [Year]',[grants]);
			var statsSida = alasql('SELECT COLUMN(SUM([Sida major HUM (310)])+SUM([Sida RRM (311)])) FROM ? GROUP BY [Year]',[grants]);
			var statsECHO = alasql('SELECT COLUMN(SUM([ECHO (402)])) FROM ? GROUP BY [Year]',[grants]);
			var statsRH = alasql('SELECT COLUMN(SUM([Radiohjälpen (600)])) FROM ? GROUP BY [Year]',[grants]);
			
			new Chartist.Line('.grantStatCompare .ct-chart', {
				labels: allGrantYears,
				series: [
					{
						name: 'Church of Sweden' , data: statsCoS
					}, {
						name: 'Sida', data: statsSida
					}, {
						name: 'Radiohjälpen (MH/VB)', data: statsRH
					}, {
						name: 'ECHO', data: statsECHO
					}
				]
			}, {
				fullWidth: true,
				chartPadding: {
					right: 20
				},
				axisX: {
					labelOffset: {
			        	x: -19,
			        	y: 8
					}
				},
				axisY: {
					labelInterpolationFnc: function(value) {
					return (value>0)?(value/1000000).toFixed() + 'M':'0';
					},
					labelOffset: {
						x: -4,
						y: 8
					}
				}
			});

			var $chart = $('.grantStatCompare .ct-chart');

			var $toolTip = $chart
			  .append('<div class="tooltip"></div>')
			  .find('.tooltip')
			  .hide();

			$chart.on('mouseenter', '.ct-point', function() {
			  var $point = $(this),
			    value = ($point.attr('ct:value'))?decCom(parseInt($point.attr('ct:value')).toFixed()):"0",
			    seriesName = $point.parent().attr('ct:series-name');
			  $toolTip.html(seriesName + '<br>' + value +' SEK').show();
			});

			$chart.on('mouseleave', '.ct-point', function() {
			  $toolTip.hide();
			});

			$chart.on('mousemove', function(event) {
			  $toolTip.css({
			    left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
			    top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
			  });
			});

		};

		$("#statsMenu>span").bind('tap', function() {
			$('body').addClass('pageStats');
	    	updChart(today.getFullYear().toString());
			updCompare();
			window.scrollTo(0,0);
			//$.getScript('js/html2canvas.js');
			//$.getScript('js/base64.js');
			//$.getScript('js/canvas2image.js');
			//$.getScript('js/html2canvas.svg.min.js');

		});

		$('#grantYears li').bind('tap', function() {
			updChart($(this).attr("data-filter"));
		});
		
		
		$(function() { 
			$("span.dlasimg").click(function() { 
				html2canvas($("section.grantStat"), {
					onrendered: function(canvas) {
						theCanvas = canvas;
						$("section.grantStat").append(canvas);

						// Convert and download as image 
						Canvas2Image.saveAsPNG(canvas); 
						$("#img-out").append(canvas);
						// Clean up 
						//document.body.removeChild(canvas);
					}
				});
			});
		}); 
		
		
/*
		███████╗    ███████╗    ████████╗    ████████╗    ██╗    ███╗   ██╗     ██████╗     ███████╗
		██╔════╝    ██╔════╝    ╚══██╔══╝    ╚══██╔══╝    ██║    ████╗  ██║    ██╔════╝     ██╔════╝
		███████╗    █████╗         ██║          ██║       ██║    ██╔██╗ ██║    ██║  ███╗    ███████╗
		╚════██║    ██╔══╝         ██║          ██║       ██║    ██║╚██╗██║    ██║   ██║    ╚════██║
		███████║    ███████╗       ██║          ██║       ██║    ██║ ╚████║    ╚██████╔╝    ███████║
		╚══════╝    ╚══════╝       ╚═╝          ╚═╝       ╚═╝    ╚═╝  ╚═══╝     ╚═════╝     ╚══════╝
*/
   		$('#settings>span').bind('tap', function() {
			$('body').addClass('pageSettings');

			var options = '<div><span>Default PO</span><ul class="select pos">';
			options += '<li id="defPO-none" title="Start with a clean sheet">None</li>';
			var i = 0;
			while (POs[i]) {
				if (POs[i] != 'No Assigned PO')
					options += '<li id="defPO-'+acr(POs[i])+'" title="Set '+POs[i]+' as default PO">'+POs[i].substr(0, POs[i].indexOf(" "))+'</li>';
					i++;
			}
			options += '</ul></div>';
			
			options += '<div><span>Colour theme</span><ul class="select themes" title="Change colour">';
			options += '<li id="theme_original">Original</li>';
			options += '<li id="theme_red">Red</li>';
			options += '<li id="theme_green">Green</li>';
			options += '<li id="theme_blue">Blue</li>';
			options += '<li id="theme_cos">CoS <i>(Beta)</i></li>';
			//options += '<li id="theme_light">Light</li>';
			options += '</ul></div>';

			options += '<div><span>Sort projects by</span><ul class="select sortby">';
			options += '<li id="sortCodeAsc">Code (A&rarr;Z)</li>';
			options += '<li id="sortCodeDesc">Code (Z&rarr;A)</li>';
			options += '<li id="sortDateDesc">Newest first</li>';
			options += '<li id="sortDateAsc">Oldest first</li>';
			options += '</ul></div>';

			options += '<div><span>Years (requires reload):</span><ul class="select showyears">';
			options += '<li id="showYears9" title="Show projects from the last 9 years">Last 9 years</li>';
			options += '<li id="showAllYears" title="Show all projects in the database (slower)">Since '+allGrantStartYears.sort()[0]+'</li>';
			options += '</ul></div>';

			options += '<div><span>Region colours</span><ul class="select showcolours">';
			options += '<li id="showColoursYes" title="">Yes</li>';
			options += '<li id="showColoursNo" title="">No</li>';
			options += '</ul></div>';
			
			$(this).siblings('.options').html(options);

			if (Cookies.get('startPO')) {
				$('#settings ul.pos').find('#'+Cookies.get('startPO')+'').addClass('on');
			} else $('#defPO-none').addClass('on');

			if (Cookies.get('theme')) {
				$('#settings ul.themes').find('#'+Cookies.get('theme')+'').addClass('on');
			} else $('#theme_original').addClass('on');

			if (Cookies.get('sortby')) {
				$('#settings ul.sortby').find('#'+Cookies.get('sortby')+'').addClass('on');
			} else $('#sortCodeAsc').addClass('on');

			if (!Cookies.get('showAllYears')) {
				$('#showYears9').addClass('on');
			} else $('#showAllYears').addClass('on');
			
			if (Cookies.get('showColours')) {
				$('#settings #showColoursYes').addClass('on');
			} else $('#settings #showColoursNo').addClass('on');
			
			function settingsSelect(item) {
				/*$('#settings .select li:not(.on):visible').hide();*/
				item.siblings().toggle();
				item.siblings().removeClass('on');
				item.addClass('on');
			};

			// Bind cookie handling to the PO list created above
			$('#settings .pos li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				Cookies.set('startPO', $(this).attr('id'), { expires: 365 });
			});

			// Theme selector
			var themes = ['theme_light', 'theme_red','theme_green','theme_blue','theme_cos'];
			$('#settings .themes li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				var theme = $(this).attr('id');
				$('body').removeClass(themes.join(' ')).addClass(theme);
				Cookies.set('theme', theme, { expires: 365 });
			});

			$('#settings .sortby li').on('click', function(e) {
				e.stopPropagation();
				var sortby = $(this).attr('id');
				if (!$(this).hasClass('on')) { // here this is important otherwise it gets too slow
					Cookies.set('sortby', sortby, { expires: 365 });
					sortProjects(sortby);
				}
				settingsSelect($(this));
			});

			// Show All Years or not
			$('#settings .showyears li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				var thisid = $(this).attr('id');
				
				if (thisid == 'showAllYears') {
					Cookies.set('showAllYears', 'yes', { expires: 365 });
				} else Cookies.remove('showAllYears');
				
				if ($(this).hasClass('on')) {
					if (!$('body').hasClass(thisid)) {
						$('#reset .back').addClass('reload').attr('title','Reload page');
					} else {
						$('#reset .back').removeClass('reload').removeAttr('title');
					}
				}
			});

			$('#settings .showcolours li').on('click', function(e) {
				e.stopPropagation();
				settingsSelect($(this));
				var thisid = $(this).attr('id');
				if (thisid == 'showColoursYes') {
					Cookies.set('showColours', 'yes', { expires: 365 });
					$('body').addClass('showPrRegions');
				} else {
					Cookies.remove('showColours');
					$('body').removeClass('showPrRegions');					
				}
			});

		
			$(document).click(function(){
				$('#settings .select li:not(.on)').hide();
			});

			$('#cookieconsent span').on('click', function(e) {
				Cookies.set('cookieconsent', today, { expires: 365 });
				$('#cookieconsent').remove();
			});
			
		});


        // DEV

		function consolelog() {
			//console.clear(); 
			console.log(classesPO);
			console.log(classesYears);
			console.log(classesRegions);
			console.log(showThese);
		};
		
		// LIST OF UPCOMING DEADLINES IN SIDEBAR
		if(!is_iPhone) {
					
			var upcoming = alasql(
				'SELECT * FROM ('+
					'SELECT [Vips], [Code], [country], [region], DATE([endDate]) AS [deadline], "endDate" AS [dltype], DATEDIFF(Day, DATE([endDate]), DATE(Date())) [daysLeft] FROM $0 WHERE [PO] != ? AND DATEDIFF(Day, DATE([endDate]), DATE(Date())) BETWEEN -31 AND 30 UNION ALL '+
					'SELECT [Vips], [Code], [country], [region], DATE([reportDate]) AS [deadline], "reportDate" AS [dltype], DATEDIFF(Day, DATE([reportDate]), DATE(Date())) [daysLeft] FROM $0 WHERE [PO] != ? AND DATEDIFF(Day, DATE([reportDate]), DATE(Date())) BETWEEN -31 AND 30 UNION ALL '+
					'SELECT [Vips], [Code], [country], [region], DATE([spendRRM]) AS [deadline], "spendRRM" AS [dltype], DATEDIFF(Day, DATE([spendRRM]), DATE(Date())) [daysLeft] FROM $0 WHERE [PO] != ? AND DATEDIFF(Day, DATE([spendRRM]), DATE(Date())) BETWEEN -31 AND 30 '+
				') ORDER BY [deadline]',[projects]);
			
			var upchtml = '<h3>Upcoming</h3><ul class="upcoming">',
				rechtml = '<h3>Recent</h3><ul class="recent">';
			
			$.each(upcoming, function(i, item) {
				var u = upcoming[i]
				u.timeDiff = Math.ceil(u["daysLeft"]-1)
				
				if (u.timeDiff <= 0) {
					upchtml += '<li class="'+u["dltype"]+' r-'+u["region"].substr(0,3)+'" data-projectid="'+u.Vips+'">'
							 + '<time title="'+formatDate(u["deadline"])+'"><span class="day">'+u["deadline"].getDate()+'</span> <span class="month">'+monthShort[u["deadline"].getMonth()]+'</span></time> <b>'+u["Code"]+' <span>'+u.country+'</span></b> ';
				} else {
					rechtml += '<li class="'+u["dltype"]+' r-'+u["region"].substr(0,3)+'" data-projectid="'+u.Vips+'">'
							 + '<time title="'+formatDate(u["deadline"])+'"><span class="day">'+u["deadline"].getDate()+'</span> <span class="month">'+monthShort[u["deadline"].getMonth()]+'</span></time> <b>'+u["Code"]+' <span>'+u.country+'</span></b> ';
				}
							
				if (u["dltype"] == "endDate") {
				
					if (u.timeDiff > 1) 	  { rechtml += '<span class="desc">Project ended <b>'+u.timeDiff+'</b> days ago</span>' }
					else if (u.timeDiff < -1) { upchtml += '<span class="desc">Project ends in <b>'+- u.timeDiff+'</b> days</span>' }
					else if (u.timeDiff == 1) { rechtml += '<span class="desc">Project ended <b>yesterday</b></span>' }
					else if (u.timeDiff == -1){ upchtml += '<span class="desc">Project ends <b>tomorrow</b></span>' }
					else					  { upchtml += '<span class="desc">Project ends <b>TODAY</b>!</span>' }
				
				} else if (u["dltype"] == "reportDate") {

					if (u.timeDiff > 1)		  { rechtml += '<span class="desc">Report was due <b>'+u.timeDiff+'</b> days ago</span>' }
					else if (u.timeDiff < -1) { upchtml += '<span class="desc">Report due in <b>'+- u.timeDiff+'</b> days</span>' }
					else if (u.timeDiff == 1) { rechtml += '<span class="desc">Report was due <b>yesterday</b></span>' }
					else if (u.timeDiff == -1){ upchtml += '<span class="desc">Report due <b>tomorrow</b></span>' }
					else					  { upchtml += '<span class="desc">Report due <b>TODAY</b>!</span>' }
				
				} else if (u["dltype"] == "spendRRM") {

					if (u.timeDiff > 1)		  { rechtml += '<span class="desc">RRM deadline was <b>'+u.timeDiff+'</b> days ago</span>' }
					else if (u.timeDiff < -1) { upchtml += '<span class="desc">Must spend RRM in <b>'+- u.timeDiff+'</b> days</span>' }
					else if (u.timeDiff == 1) { rechtml += '<span class="desc">RRM deadline was <b>yesterday</b></span>' }
					else if (u.timeDiff == -1){ upchtml += '<span class="desc">Must spend RRM by <b>tomorrow</b></span>' }
					else					  { upchtml += '<span class="desc">RRM deadline <b>TODAY</b>!</span>' }
				
				}
				
				if (u.timeDiff < 1) { upchtml += '</li>' }
				else				{ rechtml += '</li>' }

			});
			
			upchtml += '</ul>';
			rechtml += '</ul>';

			$('#upcoming').append(upchtml,rechtml);

			$('.links .more').bind("tap", function() {
				showProject($(this).data('projectid'));
			});

			$('#upcoming>ul>li').bind("tap", function() {
				var id = $(this).data('projectid');
				showProject(id);
				$('ol#project-list li#id'+id).addClass('temp');
			});
			
			$('#upcoming>ul.recent').append($('#upcoming>ul.recent>li').get().reverse()); // this reverses the order of list items in ul.recent

		};

		//console.log(projects)

		
		function formatPhone(s) {
			if (s && s.substr(0,3) == '+46') {				
				return s.substr(0,3) + ' (0) ' + s.substr(3,2) + '-' + s.substr(5,3) + ' ' + s.substr(8,2) + ' ' + s.substr(10);
				//+46702981847

			} else {
				return s
			}
		}
		
		// CONTACTS POPUP
		$('#footer .contacts').on('click', function() {

			popUp('Contacts','','contacts');

			alasql('SELECT * FROM XLSX("https://dl.dropboxusercontent.com/s/3amvsgg6rchvn44/cos-hum_contacts.xlsx",{sheetid:"Contacts", headers:true}) ORDER BY [First name]',[],function(contacts){

				var html = '<section><ul class="contactlist">';
				$.each(contacts, function(i, item) {
					
					var c      = contacts[i]
					c.fullName = c["First name"]+' '+c["Last name"]

					html += '<li>';
					html += '<span class="col1">'+c.fullName+'</span> ';
					html += '<span class="col2"><a href="mailto:'+c["Email"]+'">'+c["Email"]+'</a></span> ';
					html += '<span class="col3">'+formatPhone(c["Phone"])+'</span> ';
					html += '<span class="col4">'+formatPhone(c["Mobile"])+'</span> ';
					html += '<span class="col5"><a href="skype:'+c["Skype"]+'?add" class="skype" title="'+c["Skype"]+'" target="_self"><span>Skype</span></a></span>';
					html += '</li>';

				})
				html += '</ul></section>';

				$('#popup main').html(html);

			})
		});

    });
	
	$('#footer .year>span').html(new Date().getFullYear()); // Current year in footer
	
})/*.catch(function(reason){ console.log('Error:',reason) })*/;

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-73072736-1', 'auto');
ga('send', 'pageview');