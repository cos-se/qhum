'use strict';
var is_iPhone = /iPhone|iPod|iPhone Simulator/.test(navigator.platform),
	tap = (is_iPhone) ? 'tap' : 'click',
	today = new Date();

var setup = {
		xlsxurl: 				'https://dl.dropboxusercontent.com/s/wrylh81p763xym8/cos-hum_grants_since_2000.xlsx',
		googleMapsApiKey:		'AIzaSyDo-siqnczOSWCRoUEygoTySkDUsSsX-ak',
		googleMapsGeocodingKey:	'AIzaSyDs3bo2R4NPqiU0geRF7ZOEtsx_KDWZSPU',
		dropboxAccessToken:		'aespR2ILdtAAAAAAAAAHEl6pViZWzZAt3JqBkjfGJORg9yANRQZrM9ROpBbihdgQ',
		dropboxFileId:			'id:QegsPur5FeAAAAAAAAAAAQ',
		dropboxMonitor:			[30, 0], // in seconds, first desktop, second mobile (0 if false)
		RP1417:					['500364', '500134', '500101', '500094', '500102', '500344', '500785', '500786'], // Vips ID numbers of projects that belong to the Refugee Programme 2014-2017
		permalink:				'https://bit.do/qhum',
		defaultPrefs: {
								showRegionColours:	true,
								showYearsStripe:	false,
								showLast9yearsOnly:	false,
								showSidebar:		true
		},
		vipsImg:				'http://vips.svenskakyrkan.se/_layouts/15/Images/Precio.NGO.UI/layout/logo.png' // this image will be checked to see if the user has access to Vips (intranet)

	},
	baseUrl = window.location.href.slice(0,-window.location.search.length),
	dbx = new Dropbox({ accessToken: setup.dropboxAccessToken }),
	today = new Date(),
	userPrefs = localStorage.getItem('userPrefs') ? JSON.parse(localStorage.getItem('userPrefs')) : setup.defaultPrefs,
	tap = (is_iPhone) ? 'tap' : 'click',
	
	// Setup DOM elements
	$wrapper	= $('<div/>',{'id': 'wrapper'}),
	$header		= $('<header/>',{'id': 'header', 'class': 'noselect'}),
	$main		= $('<div/>',{'id': 'main'}),
	$sidebar	= $('<section/>',{'id': 'sidebar'}),
	$content	= $('<section/>',{'id': 'content'}),
	$filters	= $('<ul/>',{'id': 'filters', 'class': 'noselect'}),
	$infobar	= $('<div/>',{'id': 'infobar'}),
	$footer		= $('<footer/>',{'id': 'footer', 'class': 'noselect'});
	

// FUNCTIONS

// Parses weird Excel dates into JS dates
function excelDate(d) {
	return new Date((d - (25567 + 2))*86400*1000);
}

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

function toTitleCase(s) {
	return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
}

// Returns an s for English plurals if number is more than 1
function pl(n) {
	if (n >= 2) return 's'; else return '';
}

// Returns a string of how much time is left to a certain date using Moment.js
function timeLeft(date) {
	var yearsLeft = -moment().diff(date,'years',true).toFixed(1),
		monthsLeft = Math.ceil(-moment().diff(date,'months',true).toFixed()),
		weeksLeft = -moment().diff(date,'weeks',true).toFixed(),
		daysLeft = Math.ceil(-moment().diff(date,'days',true));
	return (monthsLeft > 12) ? yearsLeft + ' year' + pl(yearsLeft) + ' left' :
		   (weeksLeft > 3) ?  monthsLeft + ' month' + pl(monthsLeft) + ' left' : 
		   (daysLeft > 7) ?   weeksLeft + ' week' + pl(weeksLeft) + ' left' :
							   daysLeft + ' day' + pl(daysLeft) +  ' left';			
}

// Removes undefined items from array
function clean(a){
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
}

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

function toggleArrayItem(item, array) {
	var i = array.indexOf(item);
	if (i === -1) array.push(item);
	else array.splice(i,1);
}

//function softAlert(message,type,uncloseable,autoclose,dismissText,dismissFunction,attachTo) {
function softAlert(message,type,o) {
	var o = o ? o : {};
	var timestamp = new Date().getTime();
	var $alertText = $('<div/>',{'class': 'left', 'html': message});
	var $alertButtons = $('<div/>',{'class': 'right'});
	var $alertdiv = $('<div/>',{'id': 'alert-'+timestamp, 'class': 'alert'+((type)?' alert-'+type:'')}).append($alertText).append($alertButtons);
	function closeAlert() {
		$alertdiv.remove();
		if (o.confirmation) o.confirmation.confFunc();
		else if (o.dismissFunction) o.dismissFunction();
		else $alertdiv.remove();
	};
	if (o.dismissText) $('<span/>',{'class': 'dismiss', html: '<span>'+ o.dismissText +'</span>'}).appendTo($alertButtons).on(tap, closeAlert)
	else if (!o.uncloseable) $('<span/>',{'class': 'close', title: 'Dismiss'}).appendTo($alertButtons).on(tap, closeAlert);
	if (o.autoclose) {
		var delayWith = (typeof o.autoclose === 'number' && (o.autoclose % 1) === 0) ? o.autoclose : 1500; // if "autoclose" is a number use it as milliseconds for the delay
		$alertdiv.delay(delayWith).slideUp(200, function() { $alertdiv.remove(); });
	};
	if (o.confirmation) {
		$('<span/>',{'class': 'dismiss', html: '<span>'+ (o.confirmation.confText ? o.confirmation.confText : 'YES') +'</span>'}).appendTo($alertButtons).on(tap, closeAlert);
	};
	$alertdiv.prependTo(o.attachTo ? $(o.attachTo) : $main);
	$(o.attachTo ? o.attachTo : $main).parent().scrollTop(0);
}


function conslog() {
	console.log(showClasses.POs);
	console.log(showClasses.years);
	console.log(showClasses.regions);
	console.log(showClasses.filters);
}

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

alasql.fn.NOW = function() {
	return new Date;
};

alasql.fn.flatArray = function(s) {
	return unique(s.join(',').split(',')).filter(function(v){return v!==''});
};

alasql.fn.string = function(s) {
	return s ? s.toString() : false;
};

alasql.fn.upComing = function(arr) {
	var shortList = [];
	for (var i = 0; i < arr.length; i++) {
		if (moment(arr[i]).isBetween(moment().subtract(0.5, 'months'), moment().add(1, 'months'))) shortList.push(arr[i]); // the date is in less than a month or has passed less than half a month ago
	}
	return nextDate(new Date(), shortList);
};

// This is to avoid projects classified as "Global" if they also have a country specified
alasql.fn.notGLB = function(s) {
	if (s.length > 1 && s[s.length-1] == 'GLB') return s[s.length-2];
	else return s[s.length-1];
};

// END OF FUNCTIONS

function start() {
	if (is_iPhone) document.body.className = 'mobileApp';
	else document.body.className = 'noMobile';	
	document.body.classList.add('theme_cos');
	for (var key in userPrefs) if (userPrefs[key]) document.body.classList.add(key);
	
	$('#problem,#loading').remove();
	$('body').append($header,$wrapper.append($main.append($sidebar,$content.prepend($filters,$infobar))).append($footer));
}

document.addEventListener('DOMContentLoaded', function(event) {
	start();
});
