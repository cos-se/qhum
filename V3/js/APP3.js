var is_iPhone = /iPhone|iPod|iPhone Simulator/.test(navigator.platform);

var setup = {
		xlsxurl: 'https://dl.dropboxusercontent.com/s/wrylh81p763xym8/cos-hum_grants_since_2000.xlsx',
		googleMapsApiKey: 'AIzaSyDo-siqnczOSWCRoUEygoTySkDUsSsX-ak',
		googleMapsGeocodingKey: 'AIzaSyDs3bo2R4NPqiU0geRF7ZOEtsx_KDWZSPU',
		dropboxAccessToken: 'aespR2ILdtAAAAAAAAAHEl6pViZWzZAt3JqBkjfGJORg9yANRQZrM9ROpBbihdgQ',
		dropboxFileId: 'id:QegsPur5FeAAAAAAAAAAAQ',
		dropboxMonitor: [30, 0], // in seconds, first desktop, second mobile (0 if false)
		vipsImg: 'http://vips.svenskakyrkan.se/_layouts/15/Images/Precio.NGO.UI/layout/logo.png', // this image will be checked to see if the user has access to Vips (intranet)
		RP1417: ['500364', '500134', '500101', '500094', '500102', '500344', '500785', '500786'], // these are the Vips ID numbers of the projects that belong to the Refugee Programme 2014-2017
		permalink: 'https://bit.do/qhum',
		defaultPrefs: {
			showRegionColours: true,
			showYearsStripe: false,
			showLast9yearsOnly: false,
			showSidebar: true
		}
	},
	baseUrl = window.location.href.slice(0,-window.location.search.length),
	dbx = new Dropbox({ accessToken: setup.dropboxAccessToken }),
	today = new Date(),
	userPrefs = localStorage.getItem('userPrefs') ? JSON.parse(localStorage.getItem('userPrefs')) : setup.defaultPrefs;




var $header,
	$main,
	$sidebar,
	$content,
	$filters,
	$infobar,
	$footer;

function start() {
	if (is_iPhone) document.body.className = 'mobileApp';
	else document.body.className = 'noMobile';	
	document.body.classList.add('theme_cos');
	for (var key in userPrefs) if (userPrefs[key]) document.body.classList.add(key);

	
	$('#problem,#loading').remove();
	$('body').append($header,$('<div id="wrapper"></div>').append($main.append($sidebar,$content.prepend($filters,$infobar))).append($footer));

}

document.addEventListener('DOMContentLoaded', function(event) {
	start();
});