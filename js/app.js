'use strict';
var setup = {
		xlsxurl:				'https://dl.dropboxusercontent.com/s/395ur04rbc60j2z/cos-hum_grants_since_2000.xlsx',
		googleMapsApiKey:		'AIzaSyDo-siqnczOSWCRoUEygoTySkDUsSsX-ak',
		googleMapsGeocodingKey:	'AIzaSyDs3bo2R4NPqiU0geRF7ZOEtsx_KDWZSPU',
		dropboxAccessToken:		'qHq3oxKk4KAAAAAAAAAAFYoLFXZU2WBcTSXfgumkvMzrO5O3l0jQsZsXIBYihlce',
		dropboxFileId:			'id:MJwWNNyFvtAAAAAAAAAABw',
		dropboxMonitor:			[30, 0], // in seconds, first desktop, second mobile (0 if false)
		RP1417:					['500364', '500134', '500101', '500094', '500102', '500344', '500785', '500786'], // Vips ID numbers of projects that belong to the Refugee Programme 2014-2017
		permalink:				'https://bit.do/qhum',
		iatiID:					'SE-KK-2520026135', // IATI organisational identifier for CoS
		defaultPrefs: {			showRegionColours:	true,
								showYearsStripe:	false,
								showLast9yearsOnly:	false,
								showSidebar:		true,
								sortBy: 'startdate-desc' },
		vipsImg:				'http://vips.svenskakyrkan.se/_layouts/15/Images/Precio.NGO.UI/layout/logo.png' // this image will be checked to see if the user has access to Vips (intranet)
	},
	
	is_iPhone = /iPhone|iPod|iPhone Simulator/.test(navigator.platform),
	baseUrl = window.location.href.slice(0, -window.location.search.length),
	dbx = new Dropbox({ accessToken: setup.dropboxAccessToken }),
	today = new Date(),
	nineYearsAgo = ((new Date(new Date().getFullYear() - 8, 0, 1).getTime()) / 86400000) + 25569, // This is 1st January nine years ago in the weird fomat Excel stores its dates in
	userPrefs = localStorage.getItem('userPrefs') ? JSON.parse(localStorage.getItem('userPrefs')) : setup.defaultPrefs,
	tap = (is_iPhone) ? 'tap' : 'click',
	
	// Setup DOM elements
	wrapper	= 	$('<div/>',{'id': 'wrapper'}),
	header	= 	$('<header/>',{'id': 'header', 'class': 'noselect'}),
	main	= 	$('<div/>',{'id': 'main'}),
	sidebar	= 	$('<section/>',{'id': 'sidebar'}),
	content	= 	$('<section/>',{'id': 'content'}),
	filters	= 	$('<ul/>',{'id': 'filters', 'class': 'noselect'}),
	infobar	= 	$('<div/>',{'id': 'infobar'}),
	footer	= 	$('<footer/>',{'id': 'footer', 'class': 'noselect'}),
	projects = 	$('<ul/>',{'id': 'projects'}),
	upcoming = 	$('<ul/>',{'id': 'upcoming','class': 'deadlines'}),
	recent = 	$('<ul/>',{'id': 'recent', 'class': 'deadlines'}),
	
	list = {
	regionNames: {
		'AFR': 'Africa',
		'ASP': 'Asia-Pacific',
		'EUR': 'Europe',
		'LAC': 'Latin-America and Caribbean',
		'MEA': 'Middle East',
		'GLB': 'Global'
	},
	countries: [
		{n:'Afghanistan',a:'',a2:'AF',a3:'AFG',n3:'004',sr:'034',r:'142',cr:'ASP'},{n:'Åland',a:'Åland Islands',a2:'AX',a3:'ALA',n3:'248',sr:'154',r:'150',cr:'EUR'},{n:'Albania',a:'',a2:'AL',a3:'ALB',n3:'008',sr:'039',r:'150',cr:'EUR'},{n:'Algeria',a:'',a2:'DZ',a3:'DZA',n3:'012',sr:'015',r:'002',cr:'AFR'},{n:'American Samoa',a:'',a2:'AS',a3:'ASM',n3:'016',sr:'061',r:'009',cr:'ASP'},{n:'Andorra',a:'',a2:'AD',a3:'AND',n3:'020',sr:'039',r:'150',cr:'EUR'},{n:'Angola',a:'',a2:'AO',a3:'AGO',n3:'024',sr:'017',r:'002',cr:'AFR'},{n:'Anguilla',a:'',a2:'AI',a3:'AIA',n3:'660',sr:'029',r:'019',cr:'LAC'},{n:'Antigua and Barbuda',a:'',a2:'AG',a3:'ATG',n3:'028',sr:'029',r:'019',cr:'LAC'},{n:'Area 1',a:'Area1',a2:'',a3:'',n3:'',sr:'',r:'002',cr:'AFR'},{n:'Argentina',a:'',a2:'AR',a3:'ARG',n3:'032',sr:'005',r:'019',cr:'LAC'},{n:'Armenia',a:'',a2:'AM',a3:'ARM',n3:'051',sr:'145',r:'142',cr:'ASP'},{n:'Aruba',a:'',a2:'AW',a3:'ABW',n3:'533',sr:'029',r:'019',cr:'LAC'},{n:'Australia',a:'',a2:'AU',a3:'AUS',n3:'036',sr:'053',r:'009',cr:'ASP'},{n:'Austria',a:'',a2:'AT',a3:'AUT',n3:'040',sr:'155',r:'150',cr:'EUR'},{n:'Azerbaijan',a:'',a2:'AZ',a3:'AZE',n3:'031',sr:'145',r:'142',cr:'ASP'},{n:'Bahamas',a:'',a2:'BS',a3:'BHS',n3:'044',sr:'029',r:'019',cr:'LAC'},{n:'Bahrain',a:'',a2:'BH',a3:'BHR',n3:'048',sr:'145',r:'142',cr:'MEA'},{n:'Bangladesh',a:'',a2:'BD',a3:'BGD',n3:'050',sr:'034',r:'142',cr:'ASP'},{n:'Barbados',a:'',a2:'BB',a3:'BRB',n3:'052',sr:'029',r:'019',cr:'LAC'},{n:'Belarus',a:'',a2:'BY',a3:'BLR',n3:'112',sr:'151',r:'150',cr:'EUR'},{n:'Belgium',a:'',a2:'BE',a3:'BEL',n3:'056',sr:'155',r:'150',cr:'EUR'},{n:'Belize',a:'',a2:'BZ',a3:'BLZ',n3:'084',sr:'013',r:'019',cr:'LAC'},{n:'Benin',a:'',a2:'BJ',a3:'BEN',n3:'204',sr:'011',r:'002',cr:'AFR'},{n:'Bermuda',a:'',a2:'BM',a3:'BMU',n3:'060',sr:'',r:'019',cr:'LAC'},{n:'Bhutan',a:'',a2:'BT',a3:'BTN',n3:'064',sr:'034',r:'142',cr:'ASP'},{n:'Bolivia',a:'Plurinational State of Bolivia',a2:'BO',a3:'BOL',n3:'068',sr:'005',r:'019',cr:'LAC'},{n:'Bonaire, Sint Eustatius and Saba',a:'',a2:'BQ',a3:'BES',n3:'535',sr:'029',r:'019',cr:'LAC'},{n:'Bosnia',a:'Bosnia and Herzegovina',a2:'BA',a3:'BIH',n3:'070',sr:'039',r:'150',cr:'EUR'},{n:'Botswana',a:'',a2:'BW',a3:'BWA',n3:'072',sr:'018',r:'002',cr:'AFR'},{n:'Brazil',a:'',a2:'BR',a3:'BRA',n3:'076',sr:'005',r:'019',cr:'LAC'},{n:'British Virgin Islands',a:'',a2:'VG',a3:'VGB',n3:'092',sr:'029',r:'019',cr:'LAC'},{n:'Brunei',a:'Brunei Darussalam',a2:'BN',a3:'BRN',n3:'096',sr:'035',r:'142',cr:'ASP'},{n:'Bulgaria',a:'',a2:'BG',a3:'BGR',n3:'100',sr:'151',r:'150',cr:'EUR'},{n:'Burkina Faso',a:'',a2:'BF',a3:'BFA',n3:'854',sr:'011',r:'002',cr:'AFR'},{n:'Burundi',a:'',a2:'BI',a3:'BDI',n3:'108',sr:'014',r:'002',cr:'AFR'},{n:'Cambodia',a:'',a2:'KH',a3:'KHM',n3:'116',sr:'035',r:'142',cr:'ASP'},{n:'Cameroon',a:'',a2:'CM',a3:'CMR',n3:'120',sr:'017',r:'002',cr:'AFR'},{n:'Canada',a:'',a2:'CA',a3:'CAN',n3:'124',sr:'',r:'019',cr:''},{n:'Cape Verde',a:'Cabo Verde',a2:'CV',a3:'CPV',n3:'132',sr:'011',r:'002',cr:'AFR'},{n:'CAR',a:'Central African Republic',a2:'CF',a3:'CAF',n3:'140',sr:'017',r:'002',cr:'AFR'},{n:'Cayman Islands',a:'',a2:'KY',a3:'CYM',n3:'136',sr:'029',r:'019',cr:'LAC'},{n:'Chad',a:'',a2:'TD',a3:'TCD',n3:'148',sr:'017',r:'002',cr:'AFR'},{n:'Channel Islands',a:'',a2:'',a3:'',n3:'830',sr:'154',r:'150',cr:'EUR'},{n:'Chile',a:'',a2:'CL',a3:'CHL',n3:'152',sr:'005',r:'019',cr:'LAC'},{n:'China',a:'',a2:'CN',a3:'CHN',n3:'156',sr:'030',r:'142',cr:'ASP'},{n:'Colombia',a:'',a2:'CO',a3:'COL',n3:'170',sr:'005',r:'019',cr:'LAC'},{n:'Comoros',a:'',a2:'KM',a3:'COM',n3:'174',sr:'014',r:'002',cr:'AFR'},{n:'Congo',a:'',a2:'CG',a3:'COG',n3:'178',sr:'017',r:'002',cr:'AFR'},{n:'Cook Islands',a:'',a2:'CK',a3:'COK',n3:'184',sr:'061',r:'009',cr:'ASP'},{n:'Costa Rica',a:'',a2:'CR',a3:'CRI',n3:'188',sr:'013',r:'019',cr:'LAC'},{n:'Croatia',a:'',a2:'HR',a3:'HRV',n3:'191',sr:'039',r:'150',cr:'EUR'},{n:'Cuba',a:'',a2:'CU',a3:'CUB',n3:'192',sr:'029',r:'019',cr:'LAC'},{n:'Curacao',a:'Curaçao',a2:'CW',a3:'CUW',n3:'531',sr:'029',r:'019',cr:'LAC'},{n:'Cyprus',a:'',a2:'CY',a3:'CYP',n3:'196',sr:'145',r:'142',cr:'MEA'},{n:'Czech Republic',a:'',a2:'CZ',a3:'CZE',n3:'203',sr:'151',r:'150',cr:'EUR'},{n:'Denmark',a:'',a2:'DK',a3:'DNK',n3:'208',sr:'154',r:'150',cr:'EUR'},{n:'Djibouti',a:'',a2:'DJ',a3:'DJI',n3:'262',sr:'014',r:'002',cr:'AFR'},{n:'Dominica',a:'',a2:'DM',a3:'DMA',n3:'212',sr:'029',r:'019',cr:'LAC'},{n:'Dominican Republic',a:'',a2:'DO',a3:'DOM',n3:'214',sr:'029',r:'019',cr:'LAC'},{n:'DRC',a:'Democratic Republic of the Congo',a2:'CD',a3:'COD',n3:'180',sr:'017',r:'002',cr:'AFR'},{n:'East Timor',a:'Timor-Leste',a2:'TL',a3:'TLS',n3:'626',sr:'035',r:'142',cr:'ASP'},{n:'Ecuador',a:'',a2:'EC',a3:'ECU',n3:'218',sr:'005',r:'019',cr:'LAC'},{n:'Egypt',a:'',a2:'EG',a3:'EGY',n3:'818',sr:'015',r:'002',cr:'MEA'},{n:'El Salvador',a:'',a2:'SV',a3:'SLV',n3:'222',sr:'013',r:'019',cr:'LAC'},{n:'Equatorial Guinea',a:'',a2:'GQ',a3:'GNQ',n3:'226',sr:'017',r:'002',cr:'AFR'},{n:'Eritrea',a:'',a2:'ER',a3:'ERI',n3:'232',sr:'014',r:'002',cr:'AFR'},{n:'Estonia',a:'',a2:'EE',a3:'EST',n3:'233',sr:'154',r:'150',cr:'EUR'},{n:'Ethiopia',a:'',a2:'ET',a3:'ETH',n3:'231',sr:'014',r:'002',cr:'AFR'},{n:'Faeroe Islands',a:'',a2:'FO',a3:'FRO',n3:'234',sr:'154',r:'150',cr:'EUR'},{n:'Falkland Islands',a:'Malvinas',a2:'FK',a3:'FLK',n3:'238',sr:'005',r:'019',cr:'LAC'},{n:'Fiji',a:'',a2:'FJ',a3:'FJI',n3:'242',sr:'054',r:'009',cr:'ASP'},{n:'Finland',a:'',a2:'FI',a3:'FIN',n3:'246',sr:'154',r:'150',cr:'EUR'},{n:'France',a:'',a2:'FR',a3:'FRA',n3:'250',sr:'155',r:'150',cr:'EUR'},{n:'French Guiana',a:'',a2:'GF',a3:'GUF',n3:'254',sr:'005',r:'019',cr:'LAC'},{n:'French Polynesia',a:'',a2:'PF',a3:'PYF',n3:'258',sr:'061',r:'009',cr:'ASP'},{n:'Gabon',a:'',a2:'GA',a3:'GAB',n3:'266',sr:'017',r:'002',cr:'AFR'},{n:'Gambia',a:'',a2:'GM',a3:'GMB',n3:'270',sr:'011',r:'002',cr:'AFR'},{n:'Georgia',a:'',a2:'GE',a3:'GEO',n3:'268',sr:'145',r:'142',cr:'ASP'},{n:'Germany',a:'',a2:'DE',a3:'DEU',n3:'276',sr:'155',r:'150',cr:'EUR'},{n:'Ghana',a:'',a2:'GH',a3:'GHA',n3:'288',sr:'011',r:'002',cr:'AFR'},{n:'Gibraltar',a:'',a2:'GI',a3:'GIB',n3:'292',sr:'039',r:'150',cr:'EUR'},{n:'Global',a:'',a2:'',a3:'',n3:'',sr:'',r:'001',cr:''},{n:'Greece',a:'',a2:'GR',a3:'GRC',n3:'300',sr:'039',r:'150',cr:'EUR'},{n:'Greenland',a:'',a2:'GL',a3:'GRL',n3:'304',sr:'',r:'019',cr:''},{n:'Grenada',a:'',a2:'GD',a3:'GRD',n3:'308',sr:'029',r:'019',cr:'LAC'},{n:'Guadeloupe',a:'',a2:'GP',a3:'GLP',n3:'312',sr:'029',r:'019',cr:'LAC'},{n:'Guam',a:'',a2:'GU',a3:'GUM',n3:'316',sr:'057',r:'009',cr:'ASP'},{n:'Guatemala',a:'',a2:'GT',a3:'GTM',n3:'320',sr:'013',r:'019',cr:'LAC'},{n:'Guernsey',a:'',a2:'GG',a3:'GGY',n3:'831',sr:'154',r:'150',cr:'EUR'},{n:'Guinea',a:'',a2:'GN',a3:'GIN',n3:'324',sr:'011',r:'002',cr:'AFR'},{n:'Guinea-Bissau',a:'',a2:'GW',a3:'GNB',n3:'624',sr:'011',r:'002',cr:'AFR'},{n:'Guyana',a:'',a2:'GY',a3:'GUY',n3:'328',sr:'005',r:'019',cr:'LAC'},{n:'Haiti',a:'',a2:'HT',a3:'HTI',n3:'332',sr:'029',r:'019',cr:'LAC'},{n:'Holy See',a:'',a2:'VA',a3:'VAT',n3:'336',sr:'039',r:'150',cr:'EUR'},{n:'Honduras',a:'',a2:'HN',a3:'HND',n3:'340',sr:'013',r:'019',cr:'LAC'},{n:'Hong Kong',a:'China, Hong Kong Special Administrative Region',a2:'HK',a3:'HKG',n3:'344',sr:'030',r:'142',cr:'ASP'},{n:'Hungary',a:'',a2:'HU',a3:'HUN',n3:'348',sr:'151',r:'150',cr:'EUR'},{n:'Iceland',a:'',a2:'IS',a3:'ISL',n3:'352',sr:'154',r:'150',cr:'EUR'},{n:'India',a:'',a2:'IN',a3:'IND',n3:'356',sr:'034',r:'142',cr:'ASP'},{n:'Indonesia',a:'',a2:'ID',a3:'IDN',n3:'360',sr:'035',r:'142',cr:'ASP'},{n:'Iran',a:'Islamic Republic of Iran',a2:'IR',a3:'IRN',n3:'364',sr:'034',r:'142',cr:'MEA'},{n:'Iraq',a:'',a2:'IQ',a3:'IRQ',n3:'368',sr:'145',r:'142',cr:'MEA'},{n:'Ireland',a:'',a2:'IE',a3:'IRL',n3:'372',sr:'154',r:'150',cr:'EUR'},{n:'Isle of Man',a:'',a2:'IM',a3:'IMN',n3:'833',sr:'154',r:'150',cr:'EUR'},{n:'Israel',a:'',a2:'IL',a3:'ISR',n3:'376',sr:'145',r:'142',cr:'MEA'},{n:'Italy',a:'',a2:'IT',a3:'ITA',n3:'380',sr:'039',r:'150',cr:'EUR'},{n:'Ivory Coast',a:'Cote d\'Ivoire',a2:'CI',a3:'CIV',n3:'384',sr:'011',r:'002',cr:'AFR'},{n:'Jamaica',a:'',a2:'JM',a3:'JAM',n3:'388',sr:'029',r:'019',cr:'LAC'},{n:'Japan',a:'',a2:'JP',a3:'JPN',n3:'392',sr:'030',r:'142',cr:'ASP'},{n:'Jersey',a:'',a2:'JE',a3:'JEY',n3:'832',sr:'154',r:'150',cr:'EUR'},{n:'Jordan',a:'',a2:'JO',a3:'JOR',n3:'400',sr:'145',r:'142',cr:'MEA'},{n:'Kazakhstan',a:'',a2:'KZ',a3:'KAZ',n3:'398',sr:'143',r:'142',cr:'ASP'},{n:'Kenya',a:'',a2:'KE',a3:'KEN',n3:'404',sr:'014',r:'002',cr:'AFR'},{n:'Kiribati',a:'',a2:'KI',a3:'KIR',n3:'296',sr:'057',r:'009',cr:'ASP'},{n:'Kuwait',a:'',a2:'KW',a3:'KWT',n3:'414',sr:'145',r:'142',cr:'MEA'},{n:'Kyrgyzstan',a:'',a2:'KG',a3:'KGZ',n3:'417',sr:'143',r:'142',cr:'ASP'},{n:'Laos',a:'Lao People\'s Democratic Republic',a2:'LA',a3:'LAO',n3:'418',sr:'035',r:'142',cr:'ASP'},{n:'Latvia',a:'',a2:'LV',a3:'LVA',n3:'428',sr:'154',r:'150',cr:'EUR'},{n:'Lebanon',a:'',a2:'LB',a3:'LBN',n3:'422',sr:'145',r:'142',cr:'MEA'},{n:'Lesotho',a:'',a2:'LS',a3:'LSO',n3:'426',sr:'018',r:'002',cr:'AFR'},{n:'Liberia',a:'',a2:'LR',a3:'LBR',n3:'430',sr:'011',r:'002',cr:'AFR'},{n:'Libya',a:'',a2:'LY',a3:'LBY',n3:'434',sr:'015',r:'002',cr:'AFR'},{n:'Liechtenstein',a:'',a2:'LI',a3:'LIE',n3:'438',sr:'155',r:'150',cr:'EUR'},{n:'Lithuania',a:'',a2:'LT',a3:'LTU',n3:'440',sr:'154',r:'150',cr:'EUR'},{n:'Luxembourg',a:'',a2:'LU',a3:'LUX',n3:'442',sr:'155',r:'150',cr:'EUR'},{n:'Macao',a:'China, Macao Special Administrative Region',a2:'MO',a3:'MAC',n3:'446',sr:'030',r:'142',cr:'ASP'},{n:'Macedonia',a:'The former Yugoslav Republic of Macedonia',a2:'MK',a3:'MKD',n3:'807',sr:'039',r:'150',cr:'EUR'},{n:'Madagascar',a:'',a2:'MG',a3:'MDG',n3:'450',sr:'014',r:'002',cr:'AFR'},{n:'Malawi',a:'',a2:'MW',a3:'MWI',n3:'454',sr:'014',r:'002',cr:'AFR'},{n:'Malaysia',a:'',a2:'MY',a3:'MYS',n3:'458',sr:'035',r:'142',cr:'ASP'},{n:'Maldives',a:'',a2:'MV',a3:'MDV',n3:'462',sr:'034',r:'142',cr:'ASP'},{n:'Mali',a:'',a2:'ML',a3:'MLI',n3:'466',sr:'011',r:'002',cr:'AFR'},{n:'Malta',a:'',a2:'MT',a3:'MLT',n3:'470',sr:'039',r:'150',cr:'EUR'},{n:'Marshall Islands',a:'',a2:'MH',a3:'MHL',n3:'584',sr:'057',r:'009',cr:'ASP'},{n:'Martinique',a:'',a2:'MQ',a3:'MTQ',n3:'474',sr:'029',r:'019',cr:'LAC'},{n:'Mauritania',a:'',a2:'MR',a3:'MRT',n3:'478',sr:'011',r:'002',cr:'AFR'},{n:'Mauritius',a:'',a2:'MU',a3:'MUS',n3:'480',sr:'014',r:'002',cr:'AFR'},{n:'Mayotte',a:'',a2:'YT',a3:'MYT',n3:'175',sr:'014',r:'002',cr:'AFR'},{n:'Mexico',a:'',a2:'MX',a3:'MEX',n3:'484',sr:'013',r:'019',cr:'LAC'},{n:'Micronesia',a:'Federated States of Micronesia',a2:'FM',a3:'FSM',n3:'583',sr:'057',r:'009',cr:'ASP'},{n:'Moldova',a:'Republic of Moldova',a2:'MD',a3:'MDA',n3:'498',sr:'151',r:'150',cr:'EUR'},{n:'Monaco',a:'',a2:'MC',a3:'MCO',n3:'492',sr:'155',r:'150',cr:'EUR'},{n:'Mongolia',a:'',a2:'MN',a3:'MNG',n3:'496',sr:'030',r:'142',cr:'ASP'},{n:'Montenegro',a:'',a2:'ME',a3:'MNE',n3:'499',sr:'039',r:'150',cr:'EUR'},{n:'Montserrat',a:'',a2:'MS',a3:'MSR',n3:'500',sr:'029',r:'019',cr:'LAC'},{n:'Morocco',a:'',a2:'MA',a3:'MAR',n3:'504',sr:'015',r:'002',cr:'AFR'},{n:'Mozambique',a:'Moçambique',a2:'MZ',a3:'MOZ',n3:'508',sr:'014',r:'002',cr:'AFR'},{n:'Myanmar',a:'Burma',a2:'MM',a3:'MMR',n3:'104',sr:'035',r:'142',cr:'ASP'},{n:'Namibia',a:'',a2:'NA',a3:'NAM',n3:'516',sr:'018',r:'002',cr:'AFR'},{n:'Nauru',a:'',a2:'NR',a3:'NRU',n3:'520',sr:'057',r:'009',cr:'ASP'},{n:'Nepal',a:'',a2:'NP',a3:'NPL',n3:'524',sr:'034',r:'142',cr:'ASP'},{n:'Netherlands',a:'',a2:'NL',a3:'NLD',n3:'528',sr:'155',r:'150',cr:'EUR'},{n:'New Caledonia',a:'',a2:'NC',a3:'NCL',n3:'540',sr:'054',r:'009',cr:'ASP'},{n:'New Zealand',a:'',a2:'NZ',a3:'NZL',n3:'554',sr:'053',r:'009',cr:'ASP'},{n:'Nicaragua',a:'',a2:'NI',a3:'NIC',n3:'558',sr:'013',r:'019',cr:'LAC'},{n:'Niger',a:'',a2:'NE',a3:'NER',n3:'562',sr:'011',r:'002',cr:'AFR'},{n:'Nigeria',a:'',a2:'NG',a3:'NGA',n3:'566',sr:'011',r:'002',cr:'AFR'},{n:'Niue',a:'',a2:'NU',a3:'NIU',n3:'570',sr:'061',r:'009',cr:'ASP'},{n:'Norfolk Island',a:'',a2:'NF',a3:'NFK',n3:'574',sr:'053',r:'009',cr:'ASP'},{n:'North Korea',a:'Democratic People\'s Republic of Korea',a2:'KP',a3:'PRK',n3:'408',sr:'030',r:'142',cr:'ASP'},{n:'Northern Mariana Islands',a:'',a2:'MP',a3:'MNP',n3:'580',sr:'057',r:'009',cr:'ASP'},{n:'Norway',a:'',a2:'NO',a3:'NOR',n3:'578',sr:'154',r:'150',cr:'EUR'},{n:'Oman',a:'',a2:'OM',a3:'OMN',n3:'512',sr:'145',r:'142',cr:'MEA'},{n:'Pakistan',a:'',a2:'PK',a3:'PAK',n3:'586',sr:'034',r:'142',cr:'ASP'},{n:'Palau',a:'',a2:'PW',a3:'PLW',n3:'585',sr:'057',r:'009',cr:'ASP'},{n:'Palestine',a:'oPT',a2:'PS',a3:'PSE',n3:'275',sr:'145',r:'142',cr:'MEA'},{n:'Panama',a:'',a2:'PA',a3:'PAN',n3:'591',sr:'013',r:'019',cr:'LAC'},{n:'Papua New Guinea',a:'',a2:'PG',a3:'PNG',n3:'598',sr:'054',r:'009',cr:'ASP'},{n:'Paraguay',a:'',a2:'PY',a3:'PRY',n3:'600',sr:'005',r:'019',cr:'LAC'},{n:'Peru',a:'',a2:'PE',a3:'PER',n3:'604',sr:'005',r:'019',cr:'LAC'},{n:'Philippines',a:'',a2:'PH',a3:'PHL',n3:'608',sr:'035',r:'142',cr:'ASP'},{n:'Pitcairn',a:'',a2:'PN',a3:'PCN',n3:'612',sr:'061',r:'009',cr:'ASP'},{n:'Poland',a:'',a2:'PL',a3:'POL',n3:'616',sr:'151',r:'150',cr:'EUR'},{n:'Portugal',a:'',a2:'PT',a3:'PRT',n3:'620',sr:'039',r:'150',cr:'EUR'},{n:'Puerto Rico',a:'',a2:'PR',a3:'PRI',n3:'630',sr:'029',r:'019',cr:'LAC'},{n:'Qatar',a:'',a2:'QA',a3:'QAT',n3:'634',sr:'145',r:'142',cr:'MEA'},{n:'Reunion',a:'Réunion',a2:'RE',a3:'REU',n3:'638',sr:'014',r:'002',cr:'AFR'},{n:'Romania',a:'',a2:'RO',a3:'ROU',n3:'642',sr:'151',r:'150',cr:'EUR'},{n:'Russia',a:'Russian Federation',a2:'RU',a3:'RUS',n3:'643',sr:'151',r:'150',cr:'EUR'},{n:'Rwanda',a:'',a2:'RW',a3:'RWA',n3:'646',sr:'014',r:'002',cr:'AFR'},{n:'Samoa',a:'',a2:'WS',a3:'WSM',n3:'882',sr:'061',r:'009',cr:'ASP'},{n:'San Marino',a:'',a2:'SM',a3:'SMR',n3:'674',sr:'039',r:'150',cr:'EUR'},{n:'Sao Tome and Principe',a:'',a2:'ST',a3:'STP',n3:'678',sr:'017',r:'002',cr:'AFR'},{n:'Sark',a:'',a2:'',a3:'',n3:'680',sr:'154',r:'150',cr:'EUR'},{n:'Saudi Arabia',a:'',a2:'SA',a3:'SAU',n3:'682',sr:'145',r:'142',cr:'MEA'},{n:'Senegal',a:'',a2:'SN',a3:'SEN',n3:'686',sr:'011',r:'002',cr:'AFR'},{n:'Serbia',a:'',a2:'RS',a3:'SRB',n3:'688',sr:'039',r:'150',cr:'EUR'},{n:'Seychelles',a:'',a2:'SC',a3:'SYC',n3:'690',sr:'014',r:'002',cr:'AFR'},{n:'Sierra Leone',a:'',a2:'SL',a3:'SLE',n3:'694',sr:'011',r:'002',cr:'AFR'},{n:'Singapore',a:'',a2:'SG',a3:'SGP',n3:'702',sr:'035',r:'142',cr:'ASP'},{n:'Slovakia',a:'',a2:'SK',a3:'SVK',n3:'703',sr:'151',r:'150',cr:'EUR'},{n:'Slovenia',a:'',a2:'SI',a3:'SVN',n3:'705',sr:'039',r:'150',cr:'EUR'},{n:'Solomon Islands',a:'',a2:'SB',a3:'SLB',n3:'090',sr:'054',r:'009',cr:'ASP'},{n:'Somalia',a:'',a2:'SO',a3:'SOM',n3:'706',sr:'014',r:'002',cr:'AFR'},{n:'South Africa',a:'',a2:'ZA',a3:'ZAF',n3:'710',sr:'018',r:'002',cr:'AFR'},{n:'South Korea',a:'Republic of Korea',a2:'KR',a3:'KOR',n3:'410',sr:'030',r:'142',cr:'ASP'},{n:'South Sudan',a:'',a2:'SS',a3:'SSD',n3:'728',sr:'014',r:'002',cr:'AFR'},{n:'Spain',a:'',a2:'ES',a3:'ESP',n3:'724',sr:'039',r:'150',cr:'EUR'},{n:'Sri Lanka',a:'',a2:'LK',a3:'LKA',n3:'144',sr:'034',r:'142',cr:'ASP'},{n:'St Barts',a:'Saint Barthélemy',a2:'BL',a3:'BLM',n3:'652',sr:'029',r:'019',cr:'LAC'},{n:'St Helena',a:'Saint Helena',a2:'SH',a3:'SHN',n3:'654',sr:'011',r:'002',cr:'AFR'},{n:'St Kitts and Nevis',a:'Saint Kitts and Nevis',a2:'KN',a3:'KNA',n3:'659',sr:'029',r:'019',cr:'LAC'},{n:'St Lucia',a:'Saint Lucia',a2:'LC',a3:'LCA',n3:'662',sr:'029',r:'019',cr:'LAC'},{n:'St Maarten',a:'Sint Maarten',a2:'SX',a3:'SXM',n3:'534',sr:'029',r:'019',cr:'LAC'},{n:'St Martin',a:'Saint Martin',a2:'MF',a3:'MAF',n3:'663',sr:'029',r:'019',cr:'LAC'},{n:'St Pierre and Miquelon',a:'Saint Pierre and Miquelon',a2:'PM',a3:'SPM',n3:'666',sr:'',r:'019',cr:'LAC'},{n:'St Vincent',a:'Saint Vincent and the Grenadines',a2:'VC',a3:'VCT',n3:'670',sr:'029',r:'019',cr:'LAC'},{n:'Sudan',a:'',a2:'SD',a3:'SDN',n3:'729',sr:'015',r:'002',cr:'AFR'},{n:'Suriname',a:'',a2:'SR',a3:'SUR',n3:'740',sr:'005',r:'019',cr:'LAC'},{n:'Svalbard',a:'Svalbard and Jan Mayen Islands',a2:'SJ',a3:'SJM',n3:'744',sr:'154',r:'150',cr:'EUR'},{n:'Swaziland',a:'',a2:'SZ',a3:'SWZ',n3:'748',sr:'018',r:'002',cr:'AFR'},{n:'Sweden',a:'',a2:'SE',a3:'SWE',n3:'752',sr:'154',r:'150',cr:'EUR'},{n:'Switzerland',a:'',a2:'CH',a3:'CHE',n3:'756',sr:'155',r:'150',cr:'EUR'},{n:'Syria',a:'Syrian Arab Republic',a2:'SY',a3:'SYR',n3:'760',sr:'145',r:'142',cr:'MEA'},{n:'Tajikistan',a:'',a2:'TJ',a3:'TJK',n3:'762',sr:'143',r:'142',cr:'ASP'},{n:'Tanzania',a:'United Republic of Tanzania',a2:'TZ',a3:'TZA',n3:'834',sr:'014',r:'002',cr:'AFR'},{n:'Thailand',a:'',a2:'TH',a3:'THA',n3:'764',sr:'035',r:'142',cr:'ASP'},{n:'Togo',a:'',a2:'TG',a3:'TGO',n3:'768',sr:'011',r:'002',cr:'AFR'},{n:'Tokelau',a:'',a2:'TK',a3:'TKL',n3:'772',sr:'061',r:'009',cr:'ASP'},{n:'Tonga',a:'',a2:'TO',a3:'TON',n3:'776',sr:'061',r:'009',cr:'ASP'},{n:'Trinidad and Tobago',a:'',a2:'TT',a3:'TTO',n3:'780',sr:'029',r:'019',cr:'LAC'},{n:'Tunisia',a:'',a2:'TN',a3:'TUN',n3:'788',sr:'015',r:'002',cr:'AFR'},{n:'Turkey',a:'',a2:'TR',a3:'TUR',n3:'792',sr:'145',r:'142',cr:'MEA'},{n:'Turkmenistan',a:'',a2:'TM',a3:'TKM',n3:'795',sr:'143',r:'142',cr:'ASP'},{n:'Turks and Caicos Islands',a:'',a2:'TC',a3:'TCA',n3:'796',sr:'029',r:'019',cr:'LAC'},{n:'Tuvalu',a:'',a2:'TV',a3:'TUV',n3:'798',sr:'061',r:'009',cr:'ASP'},{n:'UAE',a:'United Arab Emirates',a2:'AE',a3:'ARE',n3:'784',sr:'145',r:'142',cr:'MEA'},{n:'Uganda',a:'',a2:'UG',a3:'UGA',n3:'800',sr:'014',r:'002',cr:'AFR'},{n:'UK',a:'United Kingdom of Great Britain and Northern Ireland',a2:'GB',a3:'GBR',n3:'826',sr:'154',r:'150',cr:'EUR'},{n:'Ukraine',a:'',a2:'UA',a3:'UKR',n3:'804',sr:'151',r:'150',cr:'EUR'},{n:'Uruguay',a:'',a2:'UY',a3:'URY',n3:'858',sr:'005',r:'019',cr:'LAC'},{n:'US Virgin Islands',a:'United States Virgin Islands',a2:'VI',a3:'VIR',n3:'850',sr:'029',r:'019',cr:'LAC'},{n:'USA',a:'United States of America',a2:'US',a3:'USA',n3:'840',sr:'',r:'019',cr:''},{n:'Uzbekistan',a:'',a2:'UZ',a3:'UZB',n3:'860',sr:'143',r:'142',cr:'ASP'},{n:'Vanuatu',a:'',a2:'VU',a3:'VUT',n3:'548',sr:'054',r:'009',cr:'ASP'},{n:'Venezuela',a:'Bolivarian Republic of Venezuela',a2:'VE',a3:'VEN',n3:'862',sr:'005',r:'019',cr:'LAC'},{n:'Vietnam',a:'Viet Nam',a2:'VN',a3:'VNM',n3:'704',sr:'035',r:'142',cr:'ASP'},{n:'Wallis and Futuna Islands',a:'',a2:'WF',a3:'WLF',n3:'876',sr:'061',r:'009',cr:'ASP'},{n:'Western Sahara',a:'',a2:'EH',a3:'ESH',n3:'732',sr:'015',r:'002',cr:'AFR'},{n:'Yemen',a:'',a2:'YE',a3:'YEM',n3:'887',sr:'145',r:'142',cr:'MEA'},{n:'Zambia',a:'',a2:'ZM',a3:'ZMB',n3:'894',sr:'014',r:'002',cr:'AFR'},{n:'Zimbabwe',a:'',a2:'ZW',a3:'ZWE',n3:'716',sr:'014',r:'002',cr:'AFR'}], // iso3 codes from: http://unstats.un.org/unsd/methods/m49/m49regin.htm
	abc: 'abcdefghijklmnopqrstuvwxyz',
	POs: '',
	startYears: '',
	regions: '',
	donors: '',
	costCentres: [],
	columnsGrants: [],
	columnCostCentres: [],
	columnDeadlines: [],
	rrmColumnName: ''
	},
	showClasses = {page: getAllUrlParams().page, project: getAllUrlParams().project, POs: [], years: [], regions: [], filters: []};

// console.log(dbx.filesListFolder({path: '/CoS HUM Team Folder/CoS Grants/'})); // For finding Dropbox file IDs (paths)

// FUNCTIONS

function getAllUrlParams(url) {
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split('#')[0];
		var arr = queryString.split('&');
		for (var i=0; i<arr.length; i++) {
			var a = arr[i].split('=');
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function(v) {
				paramNum = v.slice(1,-1);
				return '';
			});
			var paramValue = typeof(a[1])==='undefined' ? true : a[1];
			paramName = paramName.toLowerCase();
			paramValue = paramValue.toLowerCase();
			if (obj[paramName]) {
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				if (typeof paramNum === 'undefined') {
					obj[paramName].push(paramValue);
				} else obj[paramName][paramNum] = paramValue;
			} else obj[paramName] = paramValue;
		};
	};
	return obj;
}

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
	var words = s.split(' '),
		acronym = "",
		index = 0,
		nextWord;
	while (index < words.length) {
		nextWord = words[index];
		acronym = acronym + nextWord.charAt(0);
		index = index + 1;
	}
	return acronym;
}

// Returns an s (for English plurals) if number is more than 1
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
	} else return a;
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
	$alertdiv.prependTo(o.attachTo ? $(o.attachTo) : main);
	$(o.attachTo ? o.attachTo : main).parent().scrollTop(0);
}

// For debugging
function conslog() {
	console.log(showClasses.page);
	console.log(showClasses.project);
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
};

alasql.fn.NOW = function() {
	return new Date;
};

alasql.fn.flatArray = function(s) {
	return unique(s.join(',').split(',')).filter(function(v){return v!==''});
};

alasql.fn.cleanArray = function(a) {
	return clean(a);
}

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

/* JSON Date Extensions, Version 1.2.1 */
(function(n){"use strict";var t,i,r;JSON&&!JSON.dateParser&&(t=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/,i=/^\/Date\((d|-|.*)\)[\/|\\]$/,JSON.parseMsAjaxDate=!1,JSON.useDateParser=function(t){t!==n?JSON._parseSaved&&(JSON.parse=JSON._parseSaved,JSON._parseSaved=null):JSON._parseSaved||(JSON._parseSaved=JSON.parse,JSON.parse=JSON.parseWithDate)},r=function(r){return function(u,f){var o=f,e,s;return typeof f=="string"&&(e=t.exec(f),e?o=new Date(f):JSON.parseMsAjaxDate&&(e=i.exec(f),e&&(s=e[1].split(/[-+,.]/),o=new Date(s[0]?+s[0]:0-+s[1])))),r!==n?r(u,o):o}},JSON.dateParser=r(),JSON.parseWithDate=function(n,t){var i=JSON._parseSaved?JSON._parseSaved:JSON.parse;try{return i(n,r(t))}catch(u){throw new Error("JSON content could not be parsed");}},JSON.dateStringToDate=function(n,r){var u,f;return(r||(r=null),!n)?r:n.getTime?n:((n[0]==='"'||n[0]==="'")&&(n=n.substr(1,n.length-2)),u=t.exec(n),u)?new Date(n):JSON.parseMsAjaxDate?(u=i.exec(n),u)?(f=u[1].split(/[-,.]/),new Date(+f[0])):r:r})})();

// END OF FUNCTIONS


// Page loading functions

function loadDB(grants) {
	
	list.POs = alasql('SELECT COLUMN DISTINCT [PO name] FROM ? WHERE [PO name] NOT NULL ORDER BY [PO name]',[grants]);
	list.POs.unshift('No Assigned PO');
	
	// Map and fix stuff in the grants array before creating a table
	grants.map(function(i) {
		Object.keys(i).forEach(function(key) {
			list.columnsGrants.push(key); // this is extremely wasteful, but for now it's the only way to list columns
			var k = toSlug(key);
			if (k !== key) {
				i[k] = i[key];
				delete i[key];
			}
			if (k.substring(0, 5) == 'date_' || k.substring(0, 9) == 'deadline_') { i[k] = excelDate(i[k]) } // if column name starts with "date_" or "deadline_" then convert to proper JS date
		});
		i['id'] = i['id'].toString();
		i['date_disbursement'] = i['date_disbursement'] || i['date_decision']; // if date of disbursenent is not defined, use decision date instead
		
		if (!i['po_name']) i['po_name'] = list.POs[0]; // add "No Assigned PO"
		i['po_id'] = list.POs.indexOf(i['po_name']); // assign ID numbers to POs

		i['country'] = (i['country']) ? i['country'].split(', ') : ['Global']; // split when a grant is given unearmarked to several countries, if no country specified then set "Global"
		
		if(i['partner']) i['partner'] = i['partner'].split(', ');
		if(i['sector']) i['sector'] = i['sector'].split(', ');
		
		// This will convert the country names into ISO 3166-2 codes (incl. alpha-2, alpha-3, num-3 and region codes)
		i['code_alpha2'] = [], i['code_alpha3'] = [], i['code_num3'] = [], i['code_subregion'] = [], i['code_region'] = [], i['cos_region'] = [];
		var country_temp = [];
		for (var ii = 0; ii < i['country'].length; ii++) {
			var c = i['country'][ii];
			for (var iii = 0; iii < list.countries.length; iii++) {
				var cc = list.countries[iii];
				if (cc.n == c || cc.a == c) {
					i['code_alpha2'].push(cc.a2);
					i['code_alpha3'].push(cc.a3);
					i['code_num3'].push(cc.n3);
					i['code_subregion'].push(cc.sr);
					i['code_region'].push(cc.r);
					i['cos_region'] = cc.cr ? cc.cr : 'GLB';
					country_temp.push(cc.n);
				}
			}
		};
		i['country'] = country_temp; // this is to change all alternate country names to the usual names ("a" to "n")		
	});

	// Make lists
	list.columnsGrants.push('code_alpha2','code_alpha3','code_num3','code_subregion','code_region','cos_region'); // these didn't get included above
	list.columnsGrants = unique(list.columnsGrants).sort();

	for (var i = 0; i < list.columnsGrants.length; i++) {
		if (list.columnsGrants[i].substring(0, 11) == 'Cost centre') list.columnCostCentres.push(list.columnsGrants[i])
		else if (list.columnsGrants[i].substring(0, 8) == 'Deadline') list.columnDeadlines.push(toSlug(list.columnsGrants[i]));
		list.columnsGrants[i] = toSlug(list.columnsGrants[i]);
	};
	
	// Make a list of columns and cost centres
	for (var i = 0; i < list.columnCostCentres.length; i++) {
		var c = list.columnCostCentres[i];
		var cc = c.slice(12).split(', '),
			ccNumber = cc[0],
			ccDonor = cc[1],
			ccName = cc[2];
		if (list.columnCostCentres[i].indexOf('RRM') !== -1) list.rrmColumnName = toSlug(list.columnCostCentres[i]);
		list.costCentres.push({'donor': ccDonor, 'name': ccName, 'number': ccNumber, 'column_name': toSlug(c)});
		list.columnCostCentres[i] = toSlug(list.columnCostCentres[i]);
	};
	list.costCentres = alasql('SELECT donor, ARRAY(name) name, ARRAY(number) number, ARRAY(column_name) column_name FROM ? GROUP BY donor',[list.costCentres]);

	// Make a list of donors
	alasql('CREATE TABLE costcentre; SELECT * INTO costcentre FROM ?',[list.costCentres]);
	list.donors = alasql('SELECT COLUMN DISTINCT donor FROM costcentre WHERE donor NOT NULL');
	
	function printQuery(justList) { // this function is used in the alaSQL query for dinamically querying certain type of columns that might change in the future (e.g. new cost centres)
		var res = [];
		for (var i in list.costCentres) {
			if (list.costCentres.hasOwnProperty(i)) {
				var column = list.costCentres[i],
					donor = toSlug(column['donor']),
					resArr = [];
				for (var c in column['column_name']) {
					resArr.push('SUM('+column['column_name'][c]+')');
				}
				if (!justList) res.push(resArr.join('+')+' AS cost_' + donor); // this lists the donors and sums them
				else res.push('cost_' + donor); // this just lists the donors, used for declaring the columns
			}
		};
		if (!justList) res.push('SUM('+list.columnCostCentres.join(')+SUM(')+') AS cost_all'); // this is a bit ugly but efficient
		else res.push('cost_all');
		if (!justList) {
			for (var i = 0; i < list.columnDeadlines.length; i++) {
				res.push('upComing(ARRAY('+list.columnDeadlines[i]+')) AS '+list.columnDeadlines[i].replace('deadline_', 'deadline_closest_'));
			}			
		} else res = res.concat(list.columnDeadlines.map(function(i){return i.replace('deadline_', 'deadline_closest_');}));
		return res;
	}	
	
	// Create tables
	//alasql('CREATE LOCALSTORAGE DATABASE cos_grants; ATTACH LOCALSTORAGE DATABASE cos_grants; USE DATABASE cos_grants');
	alasql('CREATE TABLE grant ('+ list.columnsGrants +'); SELECT * INTO grant FROM ?',[grants]);
	alasql('CREATE TABLE project (id, code, coop, date_project_start, date_project_end, '+ printQuery(true) +', rrm, level, title, country, code_alpha2, code_alpha3, code_num3, code_subregion, code_region, cos_region, partner, sector, target_number, beneficiaries, deployment, monitoring_visit, comments, po_id, po_name, link_last_db, link_pr_appeal, link_appeal, fundraising_number); \
			SELECT id, \
			LAST(DISTINCT code) AS code, \
			FIRST(coop) coop, \
			NEW Date(MIN(date_project_start)) AS date_project_start, \
			NEW Date(MAX(date_project_end)) AS date_project_end, '
			+ printQuery() +', \
			COUNT('+ list.rrmColumnName +') AS rrm, \
			FIRST([level]) level, \
			FIRST([title]) title, \
			flatArray(ARRAY(DISTINCT country)) country, \
			flatArray(ARRAY(DISTINCT code_alpha2)) code_alpha2, \
			flatArray(ARRAY(DISTINCT code_alpha3)) code_alpha3, \
			flatArray(ARRAY(DISTINCT code_num3)) code_num3, \
			flatArray(ARRAY(DISTINCT code_subregion)) code_subregion, \
			flatArray(ARRAY(DISTINCT code_region)) code_region, \
			notGLB(ARRAY(DISTINCT cos_region)) cos_region, \
			flatArray(ARRAY(DISTINCT partner_name)) partner, \
			flatArray(ARRAY(DISTINCT sector)) sector, \
			flatArray(ARRAY(DISTINCT beneficiaries)) beneficiaries, \
			SUM(target_number) target_number, \
			cleanArray(ARRAY(DISTINCT deployment)) deployment, \
			cleanArray(ARRAY(DISTINCT monitoring_visit)) monitoring_visit, \
			ARRAY(DISTINCT comments) comments, \
			LAST(DISTINCT po_id) po_id, \
			LAST(DISTINCT po_name) po_name, \
			LAST(DISTINCT link_db) link_last_db, \
			LAST(DISTINCT link_pr_appeal) link_pr_appeal, \
			LAST(DISTINCT link_appeal) link_appeal, \
			LAST(DISTINCT fundraising_number) fundraising_number \
			INTO project \
			FROM grant \
			GROUP BY id \
			ORDER BY date_project_start');

	list.startYears = alasql('SELECT COLUMN DISTINCT YEAR([date_project_start]) FROM project');
	list.regions = alasql('SELECT COLUMN DISTINCT cos_region FROM project WHERE cos_region != "" AND cos_region != "GLB" ORDER BY cos_region');
	list.regions.push('GLB'); // GLB needs to be at the end
}

function loadDOM() {
/*
				███████╗    ██╗    ██╗         ████████╗    ███████╗    ██████╗     ███████╗
				██╔════╝    ██║    ██║         ╚══██╔══╝    ██╔════╝    ██╔══██╗    ██╔════╝
				█████╗      ██║    ██║            ██║       █████╗      ██████╔╝    ███████╗
				██╔══╝      ██║    ██║            ██║       ██╔══╝      ██╔══██╗    ╚════██║
				██║         ██║    ███████╗       ██║       ███████╗    ██║  ██║    ███████║
				╚═╝         ╚═╝    ╚══════╝       ╚═╝       ╚══════╝    ╚═╝  ╚═╝    ╚══════╝
*/

	var allFilters = [{
		filt: 'archived', button: 'Archived',
		desc: 'The project has been archived',
		cond: function(p) {if (p.date_project_end < today && p.po_id == 0) return 'archived'} // both finished and has no PO defined which mean archived
	},{
		filt: 'finished', button: 'Finished',
		desc: '',
		cond: function(p) {if (p.date_project_end < today) return 'finished'}
	},{
		filt: 'active', button: 'Active',
		desc: 'Still ongoing',
		cond: function(p) {if (p.date_project_end > today) return 'active'}
	},{
		filt: 'ECHO', button: 'ECHO',
		desc: 'Supported by ECHO',
		cond: function(p) {if (p.cost_echo != 0) return 'ECHO'}
	},{
		filt: 'RH', button: 'RH-MH-VB',
		desc: 'Supported by Radiohjälpen / Musikhjälpen / Världens Barn',
		cond: function(p) {if (p.cost_radiohjalpen != 0) return 'RH'}
	},{
		filt: 'sida', button: 'Sida',
		desc: 'Supported by Sida',
		cond: function(p) {if (p.cost_sida != 0) return 'sida'}
	},{
		filt: 'rrm', button: 'RRM',
		desc: 'Supported by Sida\'s Rapid Response Mechanism',
		cond: function(p) {if (p.rrm != 0) return 'rrm'}
	},{
		filt: 'lwf', button: 'LWF',
		desc: 'Implemented by LWF',
		cond: function(p) {if (p.partner.indexOf('LWF') > -1) return 'lwf'}
	},{
		filt: 'rp', button: 'Refugee Pr.',
		desc: 'Part of the Refugee Programme',
		cond: function(p) { for (var i = 0; i < setup.RP1417.length; i++) { if (p.id == setup.RP1417[i]) return 'rp'; }} // only the 8 projects that belong to the "Refugee Programme (2014-2016)"
	},{
		filt: 'l1m', button: '<1M',
		desc: 'Supported with less than 1 million SEK',
		cond: function(p) {if (p.cost_all < 1000000) return 'l1m'} // grant is less than 1 million SEK
	},{
		filt: 'm1m', button: '1M<',
		desc: 'Supported with more than 1 million SEK',
		cond: function(p) {if (p.cost_all >= 1000000) return 'm1m'} // grant is at least 1 million SEK or more
	},{
		filt: 'deployment', button: 'Deployment',
		desc: 'Received psychosocial deployment',
		cond: function(p) {if (p.deployment[0]) return 'deployment'}
	},{
		filt: 'monitored', button: 'Monitored',
		desc: 'Have been visited for monitoring',
		cond: function(p) {if (p.monitoring_visit[0]) return 'monitored'}
	},{
		filt: 'reportsoon', button: 'Report soon',
		desc: 'Partner report date is soon or has recently passed',
		cond: function(p) {if (p.deadline_closest_project_report) return 'reportsoon'} // if report date is in less than 60 days or it was less than 30 days ago.
	},{
		filt: 'soon', button: 'Ends soon',
		desc: 'Ending soon',
		cond: function(p) {if (p.date_project_start < new Date() && moment(p.date_project_end).isBetween(moment(), moment().add(1, 'months'))) return 'soon'} // if today or less than 1 month left
	},{
		filt: 'new', button: 'New',
		desc: 'Started in the last one month',
		cond: function(p) {if (p.date_project_end > new Date() && moment(p.date_project_start).isBetween(moment().add(-1, 'months'), moment())) return 'new'}
	},{
		filt: 'rrmsoon', button: 'noButton',
		desc: '',
		cond: function(p) {if (p.deadline_closest_rrm) return 'rrmsoon'} // the RRM spending deadline is in less than 30 days or it was less than 7 days ago
	},{
		filt: 'PO', button: 'noButton',
		desc: '',
		cond: function(p) {return 'PO-' + p.po_id}
	},{
		filt: 'year', button: 'noButton',
		desc: '',
		cond: function(p) {if (p.date_project_start) return 'y-' + p.date_project_start.getFullYear()}
	},{
		filt: 'region', button: 'noButton',
		desc: '',
		cond: function(p) {if (p.cos_region) return 'r-' + p.cos_region}
	},{
		filt: 'appeal', button: 'noButton',
		desc: '',
		cond: function(p) {if (!p.date_project_end < new Date() && p.po_ID != 0 && p.coop == 'ACT') return 'appeal'} // this is to check if the project is an appeal (so that we can link the ACT Report Viewer sheet)
	}];

	// Update calculator that counts the displayed projects and the menuitems
	function updCalc() {
		var visible = $('#projects>li:visible'),
			n = visible.length,
			a = 0;
		for (var i = 0; i < visible.length; i++) a += parseInt(visible[i].dataset.funds);
		
		if (n>0) { $('#infobar').show(); $('#calculator').html('<span>Showing <b>'+n+'</b> project'+pl(n)+' <span class="total">// totalling to <span class="amount">'+ decCom(a.toFixed()) +' SEK</span></span></span>'); }
		else { $('#calculator').empty(); $('#infobar').hide(); };

		$('#POs>span').attr('data-selected', showClasses.POs.length !== list.POs.length ? showClasses.POs.length : 'ALL');
		$('#years>span').attr('data-selected', showClasses.years.length !== list.startYears.length ? showClasses.years.length : 'ALL');
		$('#regions>span').attr('data-selected', showClasses.regions.length !== list.regions.length ? showClasses.regions.length : 'ALL');

		//conslog();
	}

	function toggleMenu(b) {
		if (is_iPhone) {
			b.siblings('select').show().focus();
		} else {
			var $menu = b.parent();
			if ($menu.hasClass('on')) $menu.removeClass('on')
			else {
				$menu.siblings('.menu').removeClass('on');
				$menu.addClass('on');
			};
		};
	}

	function filterProject() {
		if (showClasses.POs.length || showClasses.years.length || showClasses.regions.length) startButton('reset');
		else startButton('start');
		$('#projects>li').hide();
		$('#projects>li' + showClasses.filters.join('')).filter(showClasses.POs.join()).filter(showClasses.years.join()).filter(showClasses.regions.join()).show();
		$('#wrapper').scrollTop(0);
		updCalc();
	}

	// when clicked on (desktop)
	function clickFilter(clicked) {
		clicked.toggleClass('on');
		toggleArrayItem(clicked.attr('data-filter'), showClasses[clicked.attr('data-array')]);
		filterProject();
	}
	
	// when using the select menus on mobile
	function changeFilter(menuChanged) {
		showClasses[menuChanged.attr('data-array')] = [].concat(menuChanged.val());
		filterProject();		
	}
	
	// If menu items other than the clicked one have changed, update the 'on' classes
	function updateMenu() {
		$('.left>.menu>ul>li').removeClass('on');
		$('#POs>ul').find(showClasses.POs.join(',')).addClass('on');
		$('#regions>ul').find(showClasses.regions.join(',')).addClass('on');
		$('#years>ul').find(showClasses.years.join(',')).addClass('on');
	}

	var filters = $('<ul id="filters" class="noselect"/>')
	for (var i = 0; i < allFilters.length; i++) {
		if (allFilters[i].button !== 'noButton') {
			filters.append($('<li id="'+ allFilters[i].filt +'" class="filter" data-array="filters" data-filter=".'+ allFilters[i].filt +'" title="'+ allFilters[i].desc +'">'+ allFilters[i].button +'</li>')
				.on(tap, function(e2) {
					// FILTERS CLICK
					e2.preventDefault();
					if (!showClasses.POs.length && !showClasses.years.length && !showClasses.regions.length) {
						showClasses.POs = list.POs.map(function(s,i) { return '.PO-' + i; });
						showClasses.years = list.startYears.map(function(s) { return '.y-' + s; });
						showClasses.regions = list.regions.map(function(s) { return '.r-' + s; });
						updateMenu();
					};
					clickFilter($(this));
				}));
		};
	}

	var selectMenu = {};
	selectMenu.PO = $('<div>',{'id': 'POs', 'class': 'menu' + (!is_iPhone ? ' on' : ''), html: '<ul></ul>'})
					.append($('<select multiple data-array="POs" />')
						.on('change', function() {
							// SELECT PO CHANGE
							changeFilter($(this));
						})
						.on('blur', function() { $(this).hide(); })
						.append('<option disabled value>-- Select POs to display --</option>'))
					.prepend($('<span/>',{'title': 'Select POs', 'class': 'menuitem', 'data-selected': '0', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'})
						.on(tap, function() { toggleMenu($(this)); })),
	selectMenu.year = $('<div>',{'id': 'years', 'class': 'menu', html: '<ul></ul>'})
					.append($('<select multiple data-array="years" />')
						.on('change', function() {
							// SELECT YEAR CHANGE
							changeFilter($(this));							
						})
						.on('blur', function() { $(this).hide(); })
						.append('<option disabled value>-- Select years to display --</option>'))
					.prepend($('<span/>',{'title': 'Select years', 'class': 'menuitem', 'data-selected': '0', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'})
						.on(tap, function() { toggleMenu($(this)); })),
	selectMenu.region = $('<div>',{'id': 'regions', 'class': 'menu', html: '<ul></ul>'})
					.append($('<select multiple data-array="regions" />')
						.on('change', function() {
							// SELECT REGION CHANGE
							changeFilter($(this));
						})
						.on('blur', function() { $(this).hide(); })
						.append('<option disabled value>-- Select regions to display --</option>'))
					.prepend($('<span/>',{'title': 'Select regions', 'class': 'menuitem', 'data-selected': '0', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm4 8h-3v3h-2v-3H8V8h3V5h2v3h3v2z"/></svg>'})
						.on(tap, function() { toggleMenu($(this)); }));

	for (var i = 0; i < list.POs.length; i++) {
		var p = list.POs[i];
		$('<li/>',{'id': 'PO-' + i, 'data-array': 'POs', 'data-filter': '.PO-' + i, 'class': 'menuitem ' + 'PO-' + i, 'text': (i!=0) ? acr(p) : 'N/A', 'title' : (i!=0) ? p.substr(0, p.indexOf(' ')) : p})
			.appendTo(selectMenu.PO.find('ul'))
			.on(tap, function() {
				// UL-LI PO CLICK
				if (!showClasses.POs.length && !showClasses.years.length && !showClasses.regions.length) { // if nothing is selected, find and select the projects of the PO
					var po_id = this.getAttribute('id').substring(3);
					showClasses.regions = alasql('SELECT COLUMN DISTINCT cos_region FROM project WHERE po_id = '+ po_id).map(function(s) { return '.r-' + s; });
					showClasses.years = alasql('SELECT COLUMN DISTINCT YEAR(date_project_start) FROM project WHERE po_id = '+ po_id).map(function(s) { return '.y-' + s; });
					updateMenu();
				};
				clickFilter($(this));
			});
		$('<option/>',{'value': '.PO-' + i, 'class': 'PO-' + i, 'text': p})
			.appendTo(selectMenu.PO.find('select'));
	};
	
	for (var i = list.startYears.length -1; i >= 0; i--) { // reverse loop to append in reverse order to select
		var y = list.startYears[i];
		$('<li/>',{'id': 'y-' + y, 'data-array': 'years', 'data-filter': '.y-' + y, 'class': 'menuitem ' + 'y-' + y, 'text': y})
			.prependTo(selectMenu.year.find('ul'))
			.on(tap, function() {
				// UL-LI YEARS CLICK
				clickFilter($(this));
			});
		$('<option/>',{'value': '.y-' + y, 'class': 'y-' + y, 'text': y})
			.appendTo(selectMenu.year.find('select'));
	};

	for (var i = 0; i < list.regions.length; i++) {
		var r = list.regions[i];
		$('<li/>',{'id': 'r-' + r, 'data-array': 'regions', 'data-filter': '.r-' + r, 'class': 'menuitem ' + 'r-' + r, 'text': r, 'title': list.regionNames[r]})
			.appendTo(selectMenu.region.find('ul'))
			.on(tap, function() {
				// UL-LI REGIONS CLICK
				if (!showClasses.POs.length && !showClasses.years.length && !showClasses.regions.length) { // if nothing is selected, find and select the projects in the region
					var cos_region = this.getAttribute('id').substring(2);
					showClasses.POs = alasql('SELECT COLUMN DISTINCT po_id FROM project WHERE cos_region = "'+ cos_region +'"').map(function(s) { return '.PO-' + s; });
					showClasses.years = alasql('SELECT COLUMN DISTINCT YEAR(date_project_start) FROM project WHERE cos_region = "'+ cos_region +'"').map(function(s) { return '.y-' + s; });
					updateMenu();
				};
				clickFilter($(this));
			});
		$('<option/>',{'value': '.r-' + r, 'class': 'r-' + r, 'text': list.regionNames[r]})
			.appendTo(selectMenu.region.find('select'));
	};

	function startButton(toShow, pageClass) {
		switch (toShow) {
			case 'reset':
				$('#start').children('span').remove();
				$('body').addClass('projectsDisplayed');
				$('#start').append($('<span title="Reset everything (ESC)">Reset</span>')
					.one(tap, function(e) {
						e.preventDefault(); 
						showClasses = {POs:[],years:[],regions:[],filters:[]};
						$('body').removeClass('page ' + pageClass).removeAttr('data-page');
						$('#pageheader, #pagebody, #content>.page').remove();						
						if (is_iPhone) $('#header .left select option').removeAttr('selected');
						filterProject();
						updateMenu();
						window.history.replaceState({showPage: 'start'}, '', baseUrl);
						showPage('start');
					}));
				break;
			case 'start':
				$('#start').children('span').remove();
				$('body').removeClass('projectsDisplayed');
				$('#start').append($('<span title="Show projects">Start</span>')
					.one(tap, function(e) {
						e.preventDefault();
						startButton('reset');
						if (is_iPhone) $('#header .left select option').attr('selected', 'selected');
						$('#filters li#active').trigger('click');
				}));
				$('#filters').show();
				break;
			case 'back':
				$('#start').children('span').hide();
				$('#start').append($('<span title="Go back">Back</span>')
					.one(tap, function(e) {
						e.preventDefault();
						history.back();
						$(this).remove();
						$('#start').children('span').show(); 
						$('body').removeClass('page ' + pageClass).removeAttr('data-page');
						$('#pageheader, #pagebody, #content>.page').remove();
						if ($('#start').is(':empty')) startButton('start');
						$('#wrapper').scrollTop(0);
				}));
				break;
			case 'reload':
				$('#start').children('span').remove();
				$('#start').append($('<span title="Reload"><svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>')
					.one(tap, function(e) { e.preventDefault(); location.href = location.href; }));
		};
	}

	function searchFilter(filter) {
		$('#projects').removeClass('nomatches');
		var count = 0;
		if (filter.length) history.replaceState({showPage: 'search'},'', baseUrl + '?page=search&q=' + filter);
		else history.replaceState({showPage: 'search'},'', baseUrl + '?page=search');
		$('#projects>li').each(function(e){
			if ($(this).text().search(new RegExp(filter, 'i')) < 0) {
				$(this).hide();
			} else {
				$(this).show();
				count++;
			};
		});
		if (count == 0) $('#projects').addClass('nomatches');
		updCalc();
	}

	function showPage(page, param) {
		var pageHeader;
		if (page !== 'start') {
			history.pushState({showPage: page},'', baseUrl + '?page=' + page + (param ? '&' + jQuery.param(param) : ''));
			switch (page) {
				case 'search':
					pageHeader = $('<input id="search" type="search" placeholder="Search in all projects" autocomplete="off" autocorrect="off" autofocus />')
							.keyup(function(e) {
								searchFilter($(this).val());
							});
					$('#filters').hide();
					if (param) {
						pageHeader.val(param.q);
						searchFilter(param.q);
					} else $('#projects>li').show();;
					updCalc();
					break;
				
				case 'stats':
				
					var years = alasql('SELECT COLUMN DISTINCT YEAR(date_disbursement) FROM grant ORDER BY YEAR(date_disbursement)'),
						$statYearSelect = $('<select title="Select year to display"/>').on('change', function() {
												updateStats($(this).val());
												$(this).siblings().removeClass('on');
												$(this).addClass('on');
											});

					for (var i = 0; i < years.length; i++) $statYearSelect.append($('<option/>',{'value': years[i], text: years[i]}));

					pageHeader = $('<div/>')
									.append($('<div class="center"/>').append($statYearSelect))
									.append($('<div class="menu"><span class="menuitem" title="Show grants from the last 3 months"><svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span></div>')
										.on(tap, function(e) {
											e.preventDefault(e);
											var last3months = alasql('SELECT id, code, date_decision, '+ list.columnCostCentres.join(', ') +', country, partner_name, link_db 	 FROM grant WHERE date_decision > DATEADD(month, -3, NOW()) ORDER BY date_decision'),
												date3monthsAgo = Date.parse(alasql('SELECT VALUE DATEADD(month, -3, NOW())')),
												table = $('<table/>',{'class': 'grantlist'}).append('<caption>The table below shows decisions since '+ moment(date3monthsAgo).format('D MMMM YYYY') +'</caption><tr><th>Decision</th><th>Project</th><th>Partner</th><th>Country</th><th>Donor</th><th>Amount</th></tr>'),
												content = $('<div/>',{'style': 'padding: 20px;'}).append(table);
											for (var i = 0; i < last3months.length; i++) {
												var amount = 0,
													donors = [],
													date_decision = last3months[i].date_decision,
													link_db = last3months[i].link_db;
												for (var ii = 0; ii < list.columnCostCentres.length; ii++) {
													var a = last3months[i][list.columnCostCentres[ii]];
													if (a) {
														amount += a;
														donors.push(getCostCentre(list.columnCostCentres[ii],'donor'));
													}
												}
												$('<tr/>')
													.append($('<td/>',{'class': 'date', html: !link_db || is_iPhone ? moment(date_decision).format('YYYY-MM-DD') : '<a href="'+ link_db +'" title="Open DB'+ moment(date_decision).format('YYMMDD') +'">'+ moment(date_decision).format('YYYY-MM-DD') +'</a>'}))
													.append($('<td/>',{'class': '', html: last3months[i].code }))
													.append($('<td/>',{'class': '', html: last3months[i].partner_name }))
													.append($('<td/>',{'class': '', html: last3months[i].country }))
													.append($('<td/>',{'class': '', html: unique(donors).sort().join(' & ')}))
													.append($('<td/>',{'class': 'amount', html: decCom(amount) + ' SEK'}))
													.appendTo(table);
											}
											openPopup('Funding decisions in the last 3 months',content[0].outerHTML);
										}))
									.append($('<div class="menu"><span class="menuitem" title="Show historical statistics"><svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M22 6.92l-1.41-1.41-2.85 3.21C15.68 6.4 12.83 5 9.61 5 6.72 5 4.07 6.16 2 8l1.42 1.42C5.12 7.93 7.27 7 9.61 7c2.74 0 5.09 1.26 6.77 3.24l-2.88 3.24-4-4L2 16.99l1.5 1.5 6-6.01 4 4 4.05-4.55c.75 1.35 1.25 2.9 1.44 4.55H21c-.22-2.3-.95-4.39-2.04-6.14L22 6.92z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span></div>')
										.on(tap, function(e) {
											e.preventDefault();

											var histStatsPage = $('<div/>')
													.append('<h2>Total grants over the years (in SEK)</h2><div class="ct-chart ct-double-octave" id="chart1"></div>')
													.append('<h2>Grants to LWF (in % of total grants)</h2><div class="ct-chart ct-double-octave lwfLine" id="chart2"></div>');

											openPopup('Historical statistics',histStatsPage[0].outerHTML,{classes: 'resizable histStatsPage', resizeFn: function(){
												chartAllGrants.update();
												chartGrantsToLWF.update();
											}});
											
											var allGrants = alasql('SELECT COLUMN SUM('+ list.columnCostCentres.join(')+SUM(') +') FROM grant GROUP BY YEAR(date_disbursement) ORDER BY YEAR(date_disbursement)');
											
											// All grants
											var chartAllGrants = new Chartist.Line('#chart1', {
												labels: years,
												series: [allGrants.map(function(n) { return { meta: decCom(n.toFixed()) + ' SEK', value: n }; })]
												}, {
													axisX: {
														labelOffset: { x: -14, y: 0 }
													},
													axisY: {
														labelInterpolationFnc: function(value) { return value / 1000000 + 'M' },
														labelOffset: { x: 0, y: 5 }
													},
													fullWidth: true,
													plugins: [
														Chartist.plugins.tooltip()
													]
												}
											);
											
											var grantsToLWF = alasql('SELECT COLUMN SUM('+ list.columnCostCentres.join(')+SUM(') +') FROM grant WHERE partner_name LIKE "%LWF%" GROUP BY YEAR(date_disbursement) ORDER BY YEAR(date_disbursement)');

											// Grants to LWF
											var chartGrantsToLWF = new Chartist.Line('#chart2', {
												labels: years,
												series: [years.map(function(n,i) { return { value: 100 } }),
														grantsToLWF.map(function(n,i) {
															var percent = n / allGrants[i] * 100;
															return { meta: percent.toFixed() + ' per cent', value: percent };
														})]
												}, {
													axisX: {
														labelOffset: { x: -14, y: 0 }
													},
													axisY: {
														labelInterpolationFnc: function(value) { return value + '%' },
														labelOffset: { x: 0, y: 5 }
													},
													high: 100,
													fullWidth: true,
													showArea: true,
													showLine: false,
													plugins: [
														Chartist.plugins.tooltip()
													]
												}
											);
											
										}));
					
				    var updateStats = function(statYear) {
						history.replaceState({showPage: 'stats'},'', baseUrl + '?page=stats&year=' + statYear);
						var keyFigures = {
							projects: alasql('SELECT id FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' GROUP BY id').length,
							projectsYr: alasql('SELECT id FROM grant WHERE YEAR(date_project_start) = '+ statYear +' AND YEAR(date_disbursement) = '+ statYear +' GROUP BY id').length,
							countries: unique(alasql('SELECT COLUMN country FROM grant WHERE YEAR(date_disbursement) = '+ statYear).join(',').split(',')).length,
							dec: alasql('SELECT COLUMN dec FROM ?',[alasql('SELECT id, ARRAY(DISTINCT date_decision) AS dec FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' GROUP BY id')]).join(',').split(',').length,
							disb: alasql('SELECT VALUE COUNT(date_disbursement) FROM grant WHERE YEAR(date_disbursement) = '+ statYear),
							partners: unique(alasql('SELECT COLUMN DISTINCT partner_name FROM grant WHERE YEAR(date_disbursement) = '+ statYear).join(', ').split(', ')).length,
							locals: clean(alasql('SELECT COLUMN DISTINCT partner_name FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' AND partner_type = "Local"').join(', ').split(', ')).length,
							avGrant: alasql('SELECT VALUE AVG(grant) FROM ?',[alasql('SELECT SUM('+ list.columnCostCentres.join(')+SUM(') +') AS grant FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' GROUP BY id, date_decision')]),
							avGrantNoRP: alasql('SELECT VALUE AVG(grant) FROM ?',[alasql('SELECT SUM('+ list.columnCostCentres.join(')+SUM(') +') AS grant FROM grant WHERE YEAR(date_project_start) = '+ statYear +' AND id NOT IN @(?) GROUP BY id, date_decision',[setup.RP1417])]),
							total: alasql('SELECT VALUE SUM('+ list.columnCostCentres.join(')+SUM(') +') FROM grant WHERE YEAR(date_disbursement) = '+ statYear)
						};
													
						var statsPage = $('<div id="pagebody" class="statistics" />')
											.append($('<ul class="keyfigures" />')
												.append('<li><b>'+ keyFigures.projects +'</b> <span>supported projects</span> <small>(<b>'+ keyFigures.projectsYr +'</b> of them started in '+ statYear +')</small></li>')
												//.append('<li><b>'+ keyFigures.dec +'</b> <span>funding decisions</span></li>')
												.append('<li><b>'+ keyFigures.partners +'</b> <span>partners supported</span> <small>(<b>'+ keyFigures.locals +'</b> local organisation'+ pl(keyFigures.locals) +')</small>')
												.append('<li><b>'+ keyFigures.countries +'</b> <span>countries</span></li>')
												//.append('<li class="avggrant"><span>Average grant size:</span> <b>'+ parseFloat((keyFigures.avGrantNoRP / 1000000).toFixed(1))+'M SEK</b>' + ((statYear > 2013) ? '<small>(<b>'+ parseFloat((keyFigures.avGrant / 1000000).toFixed(1))+'M SEK</b> including the RP)</small>' : '') +'</li>')
												)
											.append('<div class="total clr">Total grants under '+ statYear +': <b>'+ decCom(keyFigures.total.toFixed(0)) +' SEK</b></div>')
											.append($('<div class="chart-wrapper autoclear ct-donors clr" />')
												.append('<div class="chart-img"><div class="ct-chart ct-square" id="ct-donors"></div>')
												.append('<div class="chart-legend"><h2>Donors</h2><ul></ul></div>'))
											.append($('<div class="chart-wrapper autoclear ct-regions" />')
												.append('<div class="chart-img"><div class="ct-chart ct-square" id="ct-regions"></div>')
												.append('<div class="chart-legend"><h2>Regions</h2><ul></ul></div>'))
											.append($('<div class="chart-wrapper autoclear ct-coop" />')
												.append('<div class="chart-img"><div class="ct-chart ct-square" id="ct-coop"></div>')
												.append('<div class="chart-legend"><h2>Cooperation type</h2><ul></ul></div>'))
											.append($('<div class="chart-wrapper autoclear ct-partners" />')
												.append('<div class="chart-img"><div class="ct-chart ct-square" id="ct-partners"></div>')
												.append('<div class="chart-legend"><h2>Partner type</h2><ul></ul></div>'))
											;
												
						if ($('#pagebody').length) $('#pagebody').html(statsPage[0].innerHTML);
						else $('#content').append(statsPage[0].outerHTML);
								/*.append($('<div/>',{text:'Save as PNG'}).on(tap, function() {
												var div = document.getElementsByClassName('ct-donors')[0];
												html2canvas(div).then(function(canvas) {
														div.appendChild(canvas);
														
												});
											}))*/
						

						// Donors pie chart
						var statDonors = [], statDonorsTotal = 0;
						for (var i = 0; i < list.costCentres.length; i++) {
							var d = list.costCentres[i].donor,
								c = toSlug(d);
								v = alasql('SELECT VALUE SUM('+ list.costCentres[i].column_name.join(')+SUM(') +') FROM grant WHERE YEAR(date_disbursement) = '+ statYear);
							if (v > 0) {
								statDonors.push({
									value: v,
									name: d,
									className: c
								});
								$('.ct-donors .chart-legend>ul').append('<li class="'+ c +'"><span><svg width="20" height="20"><rect width="20" height="20"></rect></svg> '+ d +'</span> <span>'+ decCom(v.toFixed()) +' SEK</span></li>');
								statDonorsTotal += v;
							};
						};
						//$('.ct-donors .chart-legend>ul').append('<li class="total"><span>Total</span> <span>'+ decCom(statDonorsTotal.toFixed()) +' SEK</span></li>');
						new Chartist.Pie('#ct-donors', {
								series: statDonors
							}, {
								labelInterpolationFnc: function(value) {
									return Math.round(value / statDonorsTotal * 100) + '%';
								}
							}
						);

						// Regions pie chart
						var statRegions = [], statRegionsTotal = 0;
						for (var i = 0; i < list.regions.length; i++) {
							var r = list.regions[i],
								v = alasql('SELECT VALUE SUM('+ list.columnCostCentres.join(')+SUM(') +') FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' AND cos_region = "'+ r +'"');
							if (v > 0) {
								statRegions.push({
									value: v,
									name: r,
									className: 'r-' + r
								})
								$('.ct-regions .chart-legend>ul').append('<li class="r-'+ r +'"><span><svg width="20" height="20"><rect width="20" height="20"></rect></svg> '+ list.regionNames[r] +'</span> <span>'+ decCom(v.toFixed()) +' SEK</span></li>');
								statRegionsTotal += v;
							};
						};
						//$('.ct-regions .chart-legend>ul').append('<li class="total"><span>Total</span> <span>'+ decCom(statRegionsTotal.toFixed()) +' SEK</span></li>');
						new Chartist.Pie('#ct-regions', {
								series: statRegions
							}, {
								donut: true,
								labelInterpolationFnc: function(value) {
									return Math.round(value / statRegionsTotal * 100) + '%';
								}
							}
						);

						
						// Cooperation pie chart
						var statCoop = alasql('SELECT coop AS [name], SUM('+ list.columnCostCentres.join(')+SUM(') +') AS [value], flatArray(ARRAY(DISTINCT code)) AS [code] FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' AND coop NOT NULL GROUP BY coop ORDER BY [name]');
						new Chartist.Pie('#ct-coop', {
								series: statCoop
							}, {
								labelInterpolationFnc: function(value) {
									return Math.round(value / statDonorsTotal * 100) + '%';
								}
							}
						);
						for (var i = 0; i < statCoop.length; i++) {
							$('.ct-coop .chart-legend>ul').append('<li class="ct-series-'+ list.abc[i] +'" title="Grants to: '+ statCoop[i].code.sort().join(', ') +'"><span><svg width="20" height="20"><rect width="20" height="20" class="ct-slice-pie"></rect></svg> '+ statCoop[i]['name'] +'</span> <span>'+ decCom(statCoop[i]['value'].toFixed()) +' SEK</span></li>');
						};
						

						// Partners pie chart
						var statPartners = alasql('SELECT partner_type AS [name], SUM('+ list.columnCostCentres.join(')+SUM(') +') AS [value], flatArray(ARRAY(DISTINCT partner_name)) AS partners FROM grant WHERE YEAR(date_disbursement) = '+ statYear +' AND partner_type NOT NULL GROUP BY partner_type ORDER BY [name]');
						new Chartist.Pie('#ct-partners', {
								series: statPartners
							}, {
								labelInterpolationFnc: function(value) {
									return Math.round(value / statDonorsTotal * 100) + '%';
								}
							}
						);
						for (var i = 0; i < statPartners.length; i++) {
							$('.ct-partners .chart-legend>ul').append('<li class="ct-series-'+ list.abc[i] +'" title="'+ statPartners[i].partners.sort().join(', ') +'"><span><svg width="20" height="20"><rect width="20" height="20" class="ct-slice-pie"></rect></svg> '+ statPartners[i]['name'] +'</span> <span>'+ decCom(statPartners[i]['value'].toFixed()) +' SEK</span></li>');
						};
						/*
						window.matchMedia('print').addListener(function() {
							//chart.update();
						});
						*/
					
					};
					if (param) {
						updateStats(param.year);
						$statYearSelect.find('option[value='+ param.year +']').attr('selected', 'selected');
					} else {
						updateStats(years[years.length-1]);
						$statYearSelect.find('option:last-of-type').attr('selected', 'selected');
					};
			};

			$('body').addClass('page' + (page ? ' page-' + page : '')); // this hides everything else in the header except the reset button
			if (page) $('body').attr('data-page', page);
			$('#header').append($('<div/>',{'id': 'pageheader', 'class': page}).append(pageHeader));
			$('#wrapper').scrollTop(0);
			$('input#search').focus();
			
		} else { // Show start page
			//history.replaceState('','', baseUrl);
			$('#projects, #filters>li').removeClass();
			$('#pageheader').remove();
			$('#projects>li').hide().removeClass('on');
		};
	}

	var pages = $('<div/>',{'class': 'pages right'})
				/*.append($('<div/>',{'id': 'showSidebar', 'class': 'menu'})
					.append($('<span/>',{'class': 'menuitem', title: 'Toggle sidebar', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>'})
						.on('click', function() { $('body').toggleClass('showSidebar'); })))*/
				.append($('<div/>',{'id': 'stats', 'class': 'menu', 'title': 'Statistics'})
					.append($('<span/>',{'class': 'menuitem', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'})
						.on(tap, function(e) {
							e.preventDefault();
							startButton('back','page-stats');
							showPage('stats');
						})))
				.append($('<div/>',{'id': 'search', 'class': 'menu', 'title': 'Search'})
					.append($('<span/>',{'class': 'menuitem', html: '<svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 	14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'})
						.on(tap, function(e) {
							e.preventDefault();
							startButton('reset', 'page-search');
							showPage('search');
						})));

	header.append('<div id="start" class="menuitem"></div>', $('<div class="left"/>').append(selectMenu.PO, selectMenu.region, selectMenu.year), pages);

	function updateSettings(opt, v) {
		userPrefs[opt] = v;
		localStorage.setItem('userPrefs', JSON.stringify(userPrefs));
	}
	
	footer.append($('<div/>',{'class': 'right'})
				.append('<svg id="logo-cos" width="134" height="23" viewBox="0 0 645.2 110" xmlns="http://www.w3.org/2000/svg"><path class="st2" d="M578.4 0v32.2c0 12.8 3.5 20 9.6 26 6.1 6 14.6 9.3 23.8 9.3 9.2 0 17.8-3.3 23.8-9.3 6-6 9.6-13.2 9.6-26V0H578.4z"></path><path class="st0" d="M645.2 22.3h-22.3V0h-22.3v22.3H578.4v10c0 4.8 0.5 8.8 1.4 12.3h20.8V65.9c3.5 1.1 7.3 1.7 11.1 1.7 3.9 0 7.6-0.6 11.1-1.7V44.5h20.8c0.9-3.5 1.4-7.5 1.4-12.3V22.3z"></path><path class="st2" d="M625 30c-1.2-1.7-3.6-1.7-4.8-0.1 2.5 1 2.7 3.5 1.6 5.4 0 0-1.2-1-4.9-1.1 -1.9-0.1-2.7-0.1-2.7-0.1 -0.3-3.3 1.9-4.8 4.1-4.6 -0.2-2.2-3-2.6-4.2-1.9 0.9-2.5-2.3-4.7-2.3-4.7s-3.3 2.2-2.3 4.7c-1.2-0.7-4-0.3-4.2 1.9 2.2-0.1 4.4 1.3 4.1 4.6 0 0-0.8 0-2.7 0.1 -3.7 0.2-4.9 1.1-4.9 1.1 -1.1-2-0.9-4.4 1.6-5.4 -1.2-1.7-3.6-1.7-4.8 0.1 -1.2-2.5-4.7-1.9-4.7-1.9 2.6 3.4 5.4 8.1 7.4 12.3 0.8-0.5 2.7-1.3 5.5-1.5 2.8-0.2 5-0.2 5-0.2s2.2 0 5 0.2c2.8 0.2 4.7 1.1 5.5 1.5 2-4.2 4.8-8.9 7.4-12.3C629.7 28.1 626.2 27.4 625 30z"></path><path class="st1" d="M337.8 28.7c-6.6-2.8-9.5-4.1-9.5-8 0-3.8 3.6-6.5 8.8-6.5 5.1 0 9 2.7 10.1 3.6l3.9-5.9c-1.6-1.3-6.7-5-14.7-5 -9.9 0-16.9 5.9-16.9 14.5 0 9.9 8.9 13.1 12.9 14.9 4.9 2.2 10.6 3.9 10.6 9.1 0 4.5-3.2 7.5-9.1 7.5 -6.2 0-11-3.7-12-4.3 -0.1-0.1-0.2-0.2-0.2-0.2l-3.9 6.2c0 0 0.1 0.1 0.2 0.2l0 0c0.9 0.9 7.1 5.7 16.4 5.7 11.1 0 17.6-6.5 17.6-15.9C352.2 35.4 345.2 31.9 337.8 28.7z"></path><path class="st1" d="M71.7 59.4V38.8c0-4.8-0.1-7.5-1.8-9.2 -0.7-0.7-2.3-1.6-4.7-1.6 -4.2 0-7.9 2.4-8.4 2.8v28.6h-8.5V3.7h8.5v20.2c0 0 4.6-3.2 10.1-3.2 4.6 0 7.6 1.7 9.4 3.5 3.9 3.9 3.8 8.7 3.8 14.2v21H71.7z"></path><path class="st1" d="M112.3 59.4v-2.8c-0.6 0.5-5.3 3.8-11.2 3.8 -4.6 0-7.5-1.6-9.4-3.5 -3.9-3.9-3.8-8.7-3.8-14.2V21.8h8.5V42.3c0 4.8 0.1 7.5 1.8 9.2 0.8 0.8 2.2 1.6 4.8 1.6 4.4 0 7.9-2.5 8.2-2.8V21.8h8.5v37.6H112.3z"></path><path class="st1" d="M210.6 59.4V38.8c0-4.8-0.1-7.5-1.8-9.2 -0.7-0.7-2.3-1.6-4.7-1.6 -4.2 0-7.9 2.4-8.4 2.8v28.6h-8.5V3.7h8.5v20.2c0 0 4.6-3.2 10.1-3.2 4.6 0 7.6 1.7 9.4 3.5 3.9 3.9 3.8 8.7 3.8 14.2v21H210.6z"></path><path class="st1" d="M255.5 60.3c-10.8 0-18.2-7.9-18.2-19.6 0-11.8 7.6-19.9 18.9-19.9 10.8 0 18.2 7.9 18.2 19.6C274.4 52.2 266.8 60.3 255.5 60.3zM255.8 27.7c-6 0-9.9 5-9.9 12.6 0 7.8 4.3 12.9 10.2 12.9 6.2 0 9.8-4.9 9.8-12.6C265.8 32.9 261.6 27.7 255.8 27.7z"></path><path class="st1" d="M303.4 11.6c-0.4-0.2-2.8-1.7-5.5-1.7 -1.5 0-3.2 0.3-4.3 1.5 -1.8 1.8-1.8 4.2-1.8 7.2v3.3h11.4v6.9h-11.4v30.6h-8.5V28.7h-6.3v-6.9h6.3v-3.2c0-5.2 0.6-9.1 3.8-12.3 2.2-2.2 5.2-3.5 9.6-3.5 5.9 0 9.6 2.9 9.9 3.2L303.4 11.6z"></path><path class="st1" d="M397.2 59.4h-9.1l-7.6-28.3 -7.5 28.3h-8.9l-10.2-37.6h8.2l7 28.5 7.6-28.5h8.2l7.5 28.5 7.3-28.5h7.9L397.2 59.4z"></path><path class="st1" d="M443.6 43.1h-25.5c0 4.5 2.8 10.4 10.7 10.4 5.2 0 9.2-2.3 10.3-2.8l2.9 5.5c-0.4 0.2-5.8 4.1-13.9 4.1 -11.8 0-18.3-8.4-18.3-19.5 0-11.8 7.2-20.1 17.8-20.1 10.2 0 16.2 7.4 16.2 19.4C443.7 41.4 443.6 42.5 443.6 43.1zM427.7 27.2c-5.2 0-8.9 3.9-9.6 9.6h17.6C435.7 33.6 434.4 27.2 427.7 27.2z"></path><path class="st1" d="M475.8 59.4v-2.7c-0.5 0.4-4.3 3.6-10.4 3.6 -10.1 0-16.8-7.9-16.8-19.2 0-11.9 8.1-20.3 18.2-20.3 4.8 0 7.5 1.7 7.9 1.9V3.7h8.5v55.7H475.8zM474.7 29.8c-0.7-0.5-3-2-6.6-2 -6.3 0-10.9 4.7-10.9 13.1 0 7.7 4.5 12.4 10 12.4 4.1 0 6.9-2.2 7.5-2.6V29.8z"></path><path class="st1" d="M522.8 43.1h-25.5c0 4.5 2.8 10.4 10.7 10.4 5.2 0 9.2-2.3 10.3-2.8l2.9 5.5c-0.4 0.2-5.8 4.1-13.9 4.1 -11.8 0-18.3-8.4-18.3-19.5 0-11.8 7.2-20.1 17.8-20.1 10.2 0 16.2 7.4 16.2 19.4C523 41.4 522.8 42.5 522.8 43.1zM507 27.2c-5.2 0-8.9 3.9-9.6 9.6h17.6C515 33.6 513.7 27.2 507 27.2z"></path><path class="st1" d="M552.7 59.4V38.8c0-4.9-0.1-7.5-1.8-9.2 -0.7-0.7-2.3-1.6-4.7-1.6 -4.2 0-7.9 2.4-8.4 2.8v28.6h-8.5v-37.6h7.4v2.8c0.6-0.5 5.3-3.9 11.2-3.9 4.6 0 7.6 1.7 9.4 3.5 3.9 3.9 3.8 8.7 3.8 14.2v21H552.7z"></path><path class="st1" d="M150.8 21.3c-0.6-0.2-1.8-0.6-3.5-0.6 -7.6 0-11.9 5.3-12.2 5.9v-4.8h-7.4v37.6h8.5V33.7c0.8-1.2 4-5.8 10.9-5.8 0.8 0 2 0.1 2.5 0.2L150.8 21.3z"></path><path class="st1" d="M178.4 50.9c-1.5 0.8-4.7 2.3-8.7 2.3 -7.1 0-11.2-5.3-11.2-12.8 0-6.5 4.2-12.7 11.5-12.7 3.6 0 6.2 1.3 7.6 2.1l3.4-5.6c-1.8-1.3-5.8-3.5-11.5-3.5 -11.2 0-19.6 8.5-19.6 20.3 0 11.3 7.5 19.2 18.8 19.2 6.1 0 10.5-2.2 12.6-3.5L178.4 50.9z"></path><path class="st1" d="M38.7 49.2c-1.9 1.1-6.6 3.5-12.3 3.5 -10.5 0-17.2-7.6-17.2-19.2 0-11.9 7.9-18.9 17.7-18.9 5.6 0 9.7 2.2 11.4 3.3l3.5-6.5C39.5 9.7 34.3 6.9 26.4 6.9 11.7 6.9 0 17 0 34.1c0 16.6 11.1 26.3 25.4 26.3 8.6 0 14.4-3.2 16.8-4.8L38.7 49.2z"></path><text class="st1" x="0" y="110" style="font: 50px Arial;">HUMANITARIAN TEAM</text></svg>\
				<svg id="logo-act" height="14" viewBox="0 0 575.7 85.4" width="94" xmlns="http://www.w3.org/2000/svg"><path class="s0" d="M32.9 85.2c9.8 0 16.1-2.8 19.7-9.2v7.8h14.3V20.5H52.5v7.7c-4.1-6.3-10.7-9.3-19.9-9.3-9.5 0-17.1 3.1-23.5 9.8C3.2 34.8 0 43 0 51.9 0 70.7 14 85.2 32.9 85.2M33.1 33.5c9.3 0 17.8 8.2 17.8 18.9 0 9.8-8.4 18-17.6 18-9.9 0-18.3-7.8-18.3-18.7C15.1 41.4 23.3 33.5 33.1 33.5M104.5 85.4c13.4 0 23.9-6.6 29.1-18l-13.4-6.6c-2.6 6.7-7.9 10.1-15.8 10.1-10.4 0-18-8-18-18.7 0-11.1 7.7-19 17.6-19 7.5 0 12.9 3.3 16.4 9.8l13.3-6.6C128.4 25.1 117.6 18.5 104.7 18.5c-9.5 0-17.9 3.7-24.5 10.6-6 6.3-9.1 14.1-9.1 23 0 8.4 3.4 17.1 9.5 23.3C87 81.9 95 85.4 104.5 85.4"/><polygon class="s0" points="152 83.8 166.7 83.8 166.7 33.6 183.8 33.6 183.8 20.5 166.7 20.5 166.7 0 152 0 152 20.5 134.3 20.5 134.3 33.6 152 33.6"/><path class="s1" d="M214.2 85.2c9.8 0 16.1-2.8 19.7-9.2v7.8h14.3V20.5h-14.4v7.7c-4.1-6.2-10.7-9.3-19.9-9.3-9.5 0-17.1 3.1-23.5 9.8-5.9 6.1-9.1 14.4-9.1 23.2C181.3 70.7 195.3 85.2 214.2 85.2M214.4 33.5c9.3 0 17.8 8.3 17.8 18.9 0 9.8-8.4 18-17.6 18-9.9 0-18.3-7.8-18.3-18.7C196.4 41.4 204.6 33.5 214.4 33.5"/><polygon class="s1" points="268.4 6.2 261.2 6.2 254 6.2 254 83.8 268.4 83.8"/><polygon class="s1" points="288.7 6.2 281.9 6.2 274.3 6.2 274.3 83.8 288.7 83.8"/><path class="s1" d="M365.4 28.2c-4.1-6.2-10.7-9.3-19.9-9.3-9.5 0-17.1 3.1-23.5 9.8-5.9 6.1-9.1 14.4-9.1 23.2 0 18.9 14 33.4 32.9 33.4 9.8 0 16.1-2.8 19.7-9.2v7.8h14.3V20.5h-14.4V28.2zM346.3 70.4c-9.9 0-18.3-7.8-18.3-18.7 0-10.3 8.3-18.1 18-18.1 9.3 0 17.8 8.3 17.8 18.9C363.9 62.1 355.5 70.4 346.3 70.4M417 19.2c-7.2 0-12.6 2.7-17 8.5V20.5h-14.4v63.3h14.3V56.7c0-15.3 3.1-23.1 13.8-23.1 10.7 0 13.1 7.2 13.1 22.2v28.1h14.7V50.3c0-8.3-0.3-14.8-4.1-20.7C432.9 22.8 426.2 19.2 417 19.2M478.9 70.7c-10.4 0-18-8-18-18.7 0-11.1 7.7-19 17.6-19 7.5 0 13 3.3 16.5 9.9l13.3-6.6C503 25.2 492.2 18.5 479.3 18.5c-9.5 0-17.9 3.7-24.5 10.6-6 6.2-9.1 14.1-9.1 23 0 8.4 3.4 17.1 9.5 23.3 6.4 6.5 14.4 9.9 23.8 9.9 13.5 0 24-6.7 29.2-18.2l-13.4-6.6C492.2 67.3 486.9 70.7 478.9 70.7M575.7 53.4c0-8.4-1.8-15.1-6-20.7-6.6-9.1-16.5-14.3-27.5-14.3-8.7 0-17.1 3.8-23.6 10.6-5.9 6.2-9 14.1-9 23 0 8.5 3.4 17.1 9.4 23.3 6.4 6.6 14.4 9.9 23.7 9.9 11.7 0 21.5-5.6 27.5-15.5l-12.7-6.3h-0.1c-3.1 5.1-8.6 7.9-15.1 7.9-10 0-16.6-5.7-17.6-14.7h50.7C575.6 55.5 575.7 54.5 575.7 53.4M525.4 44.9c2.2-7.9 9.1-13 16.9-13 9 0 15.1 4.5 17.6 13H525.4zM294.1 83.8h14.4V27.6c0 0-6.6 0-6.6 0h-7.7V83.8zM300.5 6.2h-6.4v14.5h14.4V6.2H300.5z"/></svg>'))
			.append($('<div/>',{'class': 'left'})
				.append('<span class="year"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="5.5 -3.5 64 64"><path class="st1" d="M37.4-3.5c9 0 16.6 3.1 22.9 9.4 3 3 5.3 6.4 6.9 10.3 1.6 3.9 2.3 8 2.3 12.3 0 4.4-0.8 8.5-2.3 12.3 -1.5 3.8-3.8 7.2-6.8 10.1 -3.1 3.1-6.7 5.4-10.6 7.1 -4 1.6-8.1 2.5-12.3 2.5s-8.3-0.8-12.1-2.4c-3.9-1.6-7.3-4-10.4-7 -3.1-3.1-5.4-6.5-7-10.4S5.5 32.8 5.5 28.5c0-4.2 0.8-8.3 2.4-12.2 1.6-3.9 4-7.4 7.1-10.5C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.5 2.6-18.5 7.7 -2.5 2.6-4.4 5.4-5.8 8.6 -1.4 3.2-2 6.5-2 10 0 3.4 0.7 6.7 2 9.9 1.4 3.2 3.3 6 5.8 8.5 2.5 2.5 5.4 4.4 8.5 5.7 3.2 1.3 6.5 2 9.9 2 3.4 0 6.8-0.7 10-2 3.2-1.3 6.1-3.3 8.7-5.8 5-4.9 7.5-11 7.5-18.3 0-3.5-0.6-6.9-1.9-10.1 -1.3-3.2-3.2-6-5.7-8.5C51 4.8 44.8 2.3 37.6 2.3zM37.2 23.2l-4.3 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l3.9 2c-0.8 1.6-2 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.8-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C32.6 18.6 35.4 20.1 37.2 23.2zM55.6 23.2l-4.2 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l4 2c-0.9 1.6-2.1 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.7-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C51.1 18.6 53.9 20.1 55.6 23.2z"/></svg> <span>2016</span></span>')
				.append($('<span class="link2 popup credits">Credits</span>')
					.on(tap,function(e) {
						e.preventDefault(e);
						var content = '<div><p>Special thanks to: </p>'
									+ '<ul class="bold"><li>Anne Wachira</li><li>Erik Lindén</li><li>Tamas Marki</li></ul>'
									+ '<p>Open source projects used for building QuickHUM:</p>'
									+ '<ul><li><a href="http://alasql.org/">AlaSQL '+alasql.version+'</a> by Andrey Gerhsun</li>'
									+ '<li><a href="https://github.com/stephen-hardy/xlsx.js/">XLSX.js</a> by Stephen Hardy</li>'
									+ '<li><a href="https://gionkunz.github.io/chartist-js/">Chartist.js '+Chartist.version+'</a> by Gion Kunz</li>'
									+ '<li><a href="https://momentjs.com/">Moment.js '+ moment.version +'</a> by Iskren Ivov Chernev</li>'
									+ '<li><a href="https://github.com/pukhalski/tap">TAP.JS</a> by Ilya Pukhalski</li>'
									+ '<li><a href="https://github.com/ccampbell/mousetrap">Mousetrap</a> by Craig Campbell</li>'
									+ '<li><a href="https://design.google.com/icons/">Material icons</a> by Google</li>'
									+ '<li><a href="https://jquery.com/">jQuery '+$.fn.jquery+'</a></li>'
									+ '<li><a href="http://jsfiddle.net/umaar/t82gZ/">jQuery live search</a> by Umar Hansa</li>'
									+ '<li><a href="http://dropbox.github.io/dropbox-sdk-js/">Dropbox JavaScript SDK</a> by Yehuda Katz, Tom Dale, Stefan Penner and contributors</li></ul>'
									+ '<p>Download <em>a copy</em> of the original Excel database file: <a href="'+setup.xlsxurl+'" class="download">'+setup.xlsxurl.split('/').pop()+'</a></p>'
									+ (!is_iPhone ? '<p>QuickHUM works in all major browsers, but for best experience please use <a href="https://www.google.com/chrome/browser/desktop/">Chrome</a>!</p>' : '')
									+ '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="5.5 -3.5 64 64"><path d="M37.4-3.5c9 0 16.6 3.1 22.9 9.4 3 3 5.3 6.4 6.9 10.3 1.6 3.9 2.3 8 2.3 12.3 0 4.4-0.8 8.5-2.3 12.3 -1.5 3.8-3.8 7.2-6.8 10.1 -3.1 3.1-6.7 5.4-10.6 7.1 -4 1.6-8.1 2.5-12.3 2.5s-8.3-0.8-12.1-2.4c-3.9-1.6-7.3-4-10.4-7 -3.1-3.1-5.4-6.5-7-10.4S5.5 32.8 5.5 28.5c0-4.2 0.8-8.3 2.4-12.2 1.6-3.9 4-7.4 7.1-10.5C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.5 2.6-18.5 7.7 -2.5 2.6-4.4 5.4-5.8 8.6 -1.4 3.2-2 6.5-2 10 0 3.4 0.7 6.7 2 9.9 1.4 3.2 3.3 6 5.8 8.5 2.5 2.5 5.4 4.4 8.5 5.7 3.2 1.3 6.5 2 9.9 2 3.4 0 6.8-0.7 10-2 3.2-1.3 6.1-3.3 8.7-5.8 5-4.9 7.5-11 7.5-18.3 0-3.5-0.6-6.9-1.9-10.1 -1.3-3.2-3.2-6-5.7-8.5C51 4.8 44.8 2.3 37.6 2.3zM37.2 23.2l-4.3 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l3.9 2c-0.8 1.6-2 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.8-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C32.6 18.6 35.4 20.1 37.2 23.2zM55.6 23.2l-4.2 2.2c-0.5-1-1-1.6-1.7-2 -0.7-0.4-1.3-0.6-1.9-0.6 -2.9 0-4.3 1.9-4.3 5.7 0 1.7 0.4 3.1 1.1 4.1 0.7 1 1.8 1.5 3.2 1.5 1.9 0 3.2-0.9 3.9-2.7l4 2c-0.9 1.6-2.1 2.8-3.5 3.7 -1.5 0.9-3.1 1.3-4.9 1.3 -2.9 0-5.2-0.9-6.9-2.6 -1.7-1.8-2.6-4.2-2.6-7.3 0-3 0.9-5.5 2.7-7.3 1.8-1.8 4-2.7 6.7-2.7C51.1 18.6 53.9 20.1 55.6 23.2z"/></svg> '
									+ '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="5.5 -3.5 64 64"><path d="M37.4-3.5c9 0 16.6 3.1 22.7 9.3C66.4 12 69.5 19.5 69.5 28.5c0 9-3 16.5-9.1 22.5C53.9 57.3 46.2 60.5 37.4 60.5c-8.6 0-16.2-3.1-22.5-9.4C8.6 44.8 5.5 37.3 5.5 28.5c0-8.8 3.1-16.3 9.4-22.7C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.4 2.6-18.5 7.7 -5.2 5.3-7.8 11.5-7.8 18.6 0 7.1 2.6 13.2 7.8 18.4 5.2 5.2 11.4 7.8 18.5 7.8 7.1 0 13.3-2.6 18.6-7.8 5-4.8 7.5-11 7.5-18.3 0-7.3-2.6-13.5-7.7-18.6C51 4.8 44.8 2.3 37.6 2.3zM46.1 20.6v13.1h-3.7v15.5h-9.9V33.6h-3.7V20.6c0-0.6 0.2-1.1 0.6-1.5 0.4-0.4 0.9-0.6 1.5-0.6h13.1c0.5 0 1 0.2 1.4 0.6C45.9 19.5 46.1 20 46.1 20.6zM33 12.3c0-3 1.5-4.5 4.5-4.5s4.5 1.5 4.5 4.5c0 3-1.5 4.5-4.5 4.5S33 15.3 33 12.3z"/></svg> '
									+ '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="5.5 -3.5 64 64"><path d="M37.4-3.5c9 0 16.5 3.1 22.7 9.3C66.4 12 69.5 19.5 69.5 28.5c0 9-3 16.5-9.1 22.5C53.9 57.3 46.3 60.5 37.4 60.5c-8.6 0-16.2-3.1-22.5-9.4C8.6 44.8 5.5 37.3 5.5 28.5c0-8.7 3.1-16.3 9.4-22.7C21.1-0.4 28.6-3.5 37.4-3.5zM37.6 2.3c-7.3 0-13.4 2.6-18.5 7.7 -5.2 5.3-7.8 11.5-7.8 18.5 0 7.1 2.6 13.3 7.8 18.4 5.2 5.2 11.4 7.8 18.5 7.8 7.1 0 13.3-2.6 18.6-7.8 5-4.9 7.5-11 7.5-18.3 0-7.3-2.6-13.5-7.7-18.5C51 4.8 44.8 2.3 37.6 2.3zM23.3 24c0.6-3.9 2.2-7 4.7-9.1 2.6-2.2 5.7-3.2 9.3-3.2 5 0 9 1.6 12 4.9 3 3.2 4.5 7.4 4.5 12.5 0 4.9-1.5 9-4.6 12.3 -3.1 3.3-7.1 4.9-12 4.9 -3.6 0-6.7-1.1-9.4-3.3 -2.6-2.2-4.2-5.3-4.7-9.3H31.1c0.2 3.9 2.5 5.8 7 5.8 2.2 0 4.1-1 5.4-2.9 1.4-1.9 2.1-4.5 2.1-7.8 0-3.4-0.6-6-1.9-7.7 -1.3-1.8-3.1-2.7-5.4-2.7 -4.3 0-6.7 1.9-7.2 5.7h2.3l-6.3 6.3 -6.3-6.3L23.3 24 23.3 24z"/></svg>'
									+ '<a class="github-ribbon" href="https://github.com/cos-se/qhum" title="GitHub">GitHub</a></div>';
						openPopup('Credits',content,{classes:'credits'});
					}))
				.append($('<span class="link2 popup settings">Settings</span>')
					.on(tap,function(e) {
						e.preventDefault();
						var content = $('<div class="settings"/>')
										.append($('<ul class="settings"/>')
											.append($('<li/>')
												.append($('<label/>')
													.append($('<span class="name">Show only the last 9 years (faster)</span>'))
													.append($('<span class="switch"/>')
														.append('<input name="showLast9yearsOnly" type="checkbox" '+ (userPrefs.showLast9yearsOnly ? 'checked' : '') +' data-reload>')
														.append('<div class="slider"></div>'))))
											.append($('<li/>')
												.append($('<label/>')
													.append($('<span class="name">Show regional colours</span>'))
													.append($('<span class="switch"/>')
														.append('<input name="showRegionColours" type="checkbox" '+ (userPrefs.showRegionColours ? 'checked' : '') +'>')
														.append('<div class="slider"></div>'))))
											.append($('<li/>')
												.append($('<label/>')
													.append($('<span class="name">Show years in corner stripes</span>'))
													.append($('<span class="switch"/>')
														.append('<input name="showYearsStripe" type="checkbox" '+ (userPrefs.showYearsStripe ? 'checked' : '') +'>')
														.append('<div class="slider"></div>'))))
											.append($('<li/>')
												.append($('<label/>')
													.append($('<span class="name">Show sidebar</span>'))
													.append($('<span class="switch"/>')
														.append('<input name="showSidebar" type="checkbox" '+ (userPrefs.showSidebar ? 'checked' : '') +'>')
														.append('<div class="slider"></div>'))))
										);
						openPopup('Settings',content[0].outerHTML,{classes:'settings'});
						if (!localStorage.getItem('lsConsent')) {
							$('#popup div.settings').addClass('disabled');
							$('#popup input[type="checkbox"]').attr('disabled','disabled');
							var dismissFunction = function() {
								$('#popup div.settings').removeClass('disabled');
								$('#popup input[type="checkbox"]').removeAttr('disabled');
								softAlert('Local storage has been accepted.','success', {uncloseable: true, autoclose: 1300, attachTo: '#popup main'});
								localStorage.setItem('lsConsent', new Date());
							};
							softAlert('This site will store these preferences on your computer.','info', {dismissText: 'ACCEPT', dismissFunction: dismissFunction, attachTo: '#popup main'});
							$('#popup').addClass('disabled');
						};
						$('#popup').on('change', 'input[type="checkbox"]', function () {	
							if (this.checked) {
								$('body').addClass(this.name);
								updateSettings(this.name, true);
							} else {
								$('body').removeClass(this.name);
								updateSettings(this.name, false);
							};
							if (this.hasAttribute('data-reload')) $('body').toggleClass('reload'); // only induce reload if the selected option is different
						});
					}))
				.append($('<span/>',{'class': 'link2 popup sqlconsole', 'text': 'Console'}).on(tap, showConsole)));

	function sortProjects(sortBy) {
		$('ul#projects>li').sort(function(a,b) {
			switch(sortBy) {
				case 'startdate-asc':
					return $(b).find('time.date-start').attr('title') < $(a).find('time.date-start').attr('title') ? 1 : -1;
					break;
				case 'startdate-desc':
					return $(b).find('time.date-start').attr('title') > $(a).find('time.date-start').attr('title') ? 1 : -1;
					break;
				case 'code-asc':
					return $(b).children('div.p-front').children('span.code').text() < $(a).children('div.p-front').children('span.code').text() ? 1 : -1;
					break;
				case 'code-desc':
					return $(b).children('div.p-front').children('span.code').text() > $(a).children('div.p-front').children('span.code').text() ? 1 : -1;
					break;
				case 'funds-asc':
					return parseInt($(b).attr('data-funds')) < parseInt($(a).attr('data-funds')) ? 1 : -1;
					break;
				case 'funds-desc':
					return parseInt($(b).attr('data-funds')) > parseInt($(a).attr('data-funds')) ? 1 : -1;
					break;
				case 'regions':
					return $(b).attr('data-region') < $(a).attr('data-region') ? 1 : -1;
			}
		}).appendTo('ul#projects');	
	}

	// Puts decimal commas in numbers
	function decCom(n) {
		if (n) {
			var parts = n.toString().split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return parts.join('.');
		};
	};
	
	// Loop through all projects
	for (var i = 0, len = alasql('SELECT * FROM project').length; i < len; i++) {
		var p = alasql('SELECT * FROM project')[i],
			deadlines = [{'c': 'dateAudit',			'd': p.deadline_closest_audit_report},
						 {'c': 'dateProjectReport',	'd': p.deadline_closest_project_report},
						 {'c': 'dateRHreport',		'd': p.deadline_closest_rh_report},
						 {'c': 'dateSpendRRM',		'd': p.deadline_closest_rrm},
						 {'c': 'dateSidaReport',	'd': p.deadline_closest_sida_report},
						 {'c': 'dateEnd',			'd': p.date_project_end}],
			projectClasses = [];

		// Check which filters apply for this project
		for (var ii = 0; ii < allFilters.length; ii++) {
			var filter = allFilters[ii];
			projectClasses.push(filter.cond(p));
		};
		projectClasses = clean(unique(projectClasses)).join(' ');
						 
		// Loop through the 6 deadline types specified above
		for (var ii = 0; ii < deadlines.length; ii++) {
			var d = deadlines[ii]['d'];
			
			// Only do something if the deadline has passed less than 0.5 months ago or will come in less than a month
			if (d && moment(d).isBetween(moment().subtract(0.5, 'months'), moment().add(1, 'months'))) {
				var	c = deadlines[ii]['c'], t = '',
					dayDiff = Math.ceil(-moment().diff(d, 'days', true));
				switch(deadlines[ii]['c']) {
					case 'dateEnd':
						if (dayDiff > 1)		t = 'Project ends in <b>'+ dayDiff +'</b> days';
						else if (dayDiff < -1)	t = 'Project ended <b>'+ -dayDiff +'</b> days ago';
						else if (dayDiff == -1)	t = 'Project ended <b>yesterday</b>';
						else if (dayDiff == 1)	t = 'Project ends <b>tomorrow</b>';
						else					t = 'Project ends <b>TODAY</b>!';
						break;
					case 'dateProjectReport':
						if (dayDiff > 1)		t = 'Project report due in <b>'+ dayDiff +'</b> days';
						else if (dayDiff < -1)	t = 'Project report due <b>'+ -dayDiff +'</b> days ago';
						else if (dayDiff == -1)	t = 'Project report was due <b>yesterday</b>';
						else if (dayDiff == 1)	t = 'Project report due <b>tomorrow</b>';
						else					t = 'Project report due <b>TODAY</b>!';
						break;
					case 'dateSpendRRM':
						if (dayDiff > 1)		t = 'Must spend RRM in <b>'+ dayDiff +'</b> days';
						else if (dayDiff < -1)	t = 'RRM deadline was <b>'+ -dayDiff +'</b> days ago';
						else if (dayDiff == -1)	t = 'RRM deadline was <b>yesterday</b>';
						else if (dayDiff == 1)	t = 'Must spend RRM by <b>tomorrow</b>';
						else					t = 'RRM deadline <b>TODAY</b>!';
						break;
					case 'dateAudit':
						if (dayDiff > 1)		t = 'Audit report due in <b>'+ dayDiff +'</b> days';
						else if (dayDiff < -1)	t = 'Audit report was due <b>'+ -dayDiff +'</b> days ago';
						else if (dayDiff == -1)	t = 'Audit report was due <b>yesterday</b>';
						else if (dayDiff == 1)	t = 'Audit report due <b>tomorrow</b>';
						else					t = 'Audit report due <b>TODAY</b>!';
						break;
					case 'dateRHreport':
						if (dayDiff > 1)		t = 'RH report due in <b>'+ dayDiff +'</b> days';
						else if (dayDiff < -1)	t = 'RH report was due <b>'+ -dayDiff +'</b> days ago';
						else if (dayDiff == -1)	t = 'RH report was due <b>yesterday</b>';
						else if (dayDiff == 1)	t = 'RH report due <b>tomorrow</b>';
						else					t = 'RH report due <b>TODAY</b>!';
						break;
					case 'dateSidaReport':
						if (dayDiff > 1)		t = 'Sida report due in <b>'+ dayDiff +'</b> days';
						else if (dayDiff < -1)	t = 'Sida report was due <b>'+ -dayDiff +'</b> days ago';
						else if (dayDiff == -1)	t = 'Sida report was due <b>yesterday</b>';
						else if (dayDiff == 1)	t = 'Sida report due <b>tomorrow</b>';
						else					t = 'Sida report due <b>TODAY</b>!';
				};
				
				// Create a list item for each deadline and append it to either the "upcoming" or the "recent" list - but only if it has already started
				$('<li/>',{'data-time': d.getTime(), 'class': c + ' ' + projectClasses, 'data-projectid': p.id})
					.append('<time title="'+moment(d).format('YYYY-MM-DD')+'"><span class="day">'+moment(d).format('D')+'</span> <span class="month">'+moment(d).format('MMM')+'</span></time> ')
					.append('<b>'+p.code+' <span>'+p.country.sort().join(', ')+'</span></b> ')
					.append($('<span/>',{'class': 'desc', 'html': t}))
					.on(tap, function() { showProject(this.dataset.projectid); })
					.prependTo((dayDiff >= 0 && p.date_project_start < new Date()) ? upcoming : (dayDiff < 0) ? recent : '');
			}
		};

		var $donors = $('<ul/>');
		for (var ii = 0; ii < list.donors.length; ii++) {
			var d = 'cost_' + toSlug(list.donors[ii]);
			if (p[d] > 0) $donors.append($('<li/>',{'class': d, 'html': '<span class="col1">' +list.donors[ii].replace('Radiohjälpen','RH') + '</span><span class="col2">' + decCom(p[d].toFixed(0)) + '</span>'}));
		};

		// Create a list item for each project and append it to the #projects ul
		$('<li/>',{'id': 'id' + p.id, 'class': projectClasses, 'data-funds': p.cost_all, 'data-region': p.cos_region})
			.append($('<div/>',{'class': 'p-front noselect', 'data-year': p.date_project_start.getFullYear()})
				.append($('<span/>',{'class': 'code', text: p.code}))
				.append($('<span/>',{'class': 'title'}).append($('<b/>',{text: p.title})))
				.append($('<span/>',{'class': 'funds', text: parseFloat((p.cost_all/1000000).toFixed(2))+'M'}))
				.append($('<span/>',{'class': 'id', text: p.id}))
				.append($('<span/>',{'class': 'country', text: p.country.sort().join(', ')}))
				.append($('<ul/>',{'class': 'badges'})
					.append(p.level == 'L3' ? '<li class="level" title="Level 3 emergency">L3</li>' : '')
					.append(p.deployment[0] ? '<li class="deployment" title="Deployment">D</li>' : '')
					.append(p.monitoring_visit[0] ? '<li class="monitored" title="Monitored">M</li>' : ''))
				.append(p.deadline_closest_project_report ? $('<span/>',{'class': 'report', 'html': 'Report from partner: <b>'+moment(p.deadline_closest_project_report).format('D MMMM')+'</b>'}):'')
				.append($('<span/>',{'class': 'year', text: p.date_project_start.getFullYear() }))
				.on(tap, function(e) { e.preventDefault(); $(this).parent().addClass('on'); }))
			.append('<progress value="'+ (today - p.date_project_start).toString().slice(0,-7) +'" max="'+ (p.date_project_end - p.date_project_start).toString().slice(0,-7) +'"></progress>')
			.append($('<div />',{'class': 'p-back'})
				.append($('<span/>',{'class': 'close button', title: 'Close'})
					.on(tap, function(e) { e.preventDefault(); $(this).parent().parent().removeClass('on'); }))
				.append($('<span class="moreinfo noselect" title="More info"></span>')
					.append($('<span/>',{'class': 'code', 'text': p.code}))
					.append($('<span/>',{'class': 'partner', 'text': p.partner.join(', ')}))
					.on(tap, function(e) { e.preventDefault(); showProject($(this).parent().parent().attr('id').substring(2)); }))
				.append((p.date_project_end < today && p.po_id == 0) ? '<span class="novips noselect"></span>' : $('<a/>',{'class': 'vipslink noselect', 'href': 'http://vips.svenskakyrkan.se/insatser/1/' + p.id, 'title': p.title, 'html': '<span class="r1">Link to</span><span class="r2">Vips</span><span class="r3">'+ p.id +'</span>'}))
				.append($('<div/>',{'class': 'funds'}).append($donors))
				.append($('<div/>',{'class': 'links'})
					.append((p.link_last_db) ? '<a href="'+ p.link_last_db +'" class="link2" title="Open last decision">Last DB</a>' : '')
					.append((p.link_appeal) ? '<a href="'+ p.link_appeal +'" class="link2" title="Appeal / project application">APP</a>' : (p.link_pr_appeal) ? '<a href="'+ p.link_pr_appeal +'" class="link2" title="Preliminary appeal">PR.APP</a>' : ''))
				.append($('<div/>',{'class': 'timeleft'})
					.append($('<time/>',{'class': 'date-start', 'title': 'Project start: ' + moment(p.date_project_start).format('YYYY-MM-DD'), 'html': '<span class="year">'+ p.date_project_start.getFullYear() +'</span> <span class="month">'+ moment(p.date_project_start).format('MMM') +'</span>'}))
					.append($('<span/>',{'class': 'days', 'text': (p.date_project_start > new Date()) ? 'YET TO START' : (p.date_project_end < new Date()) ? 'FINISHED' : timeLeft(p.date_project_end)}))
					.append($('<time/>',{'class': 'date-end', 'title': 'Project end: ' + moment(p.date_project_end).format('YYYY-MM-DD'), 'html': '<span class="year">'+ p.date_project_end.getFullYear() +'</span> <span class="month">'+ moment(p.date_project_end).format('MMM') +'</span>'}))
					.append('<span class="hidden">'+ p.deployment +'</span>')
					))
			.hide()
			.appendTo(projects);
	}
	
	var infobar = $('<div id="infobar"/>')
					.append($('<div id="calculator" class="left" />'))
					.append($('<div id="sorting" class="right"><span>Sort by:</span></div>')
						.append($('<select/>')
							.append($('<option value="startdate-asc">Oldest first</option>'))
							.append($('<option value="startdate-desc">Newest first</option>'))
							.append($('<option value="code-asc">Code (A&rarr;Z)</option>'))
							.append($('<option value="code-desc">Code (Z&rarr;A)</option>'))
							.append($('<option value="funds-asc">Least funds first</option>'))
							.append($('<option value="funds-desc">Most funds first</option>'))
							.append($('<option value="regions">Regions</option>'))
							.on('change', function() {
								sortProjects($(this).val());
								updateSettings('sortBy', $(this).val())
							})));

	content.append(projects);
	
	if (upcoming[0].children.length) tinysort(upcoming.children(),{data:'time'});
	if (recent[0].children.length) tinysort(recent.children(),{data:'time', order:'desc'});
	
	sidebar.append(
		'<h3>Upcoming</h3>',
		upcoming[0].children.length ? upcoming : '<span class="placeholder">No upcoming deadlines <br/>in the next one month</span>',
		'<h3>Recent</h3>',
		recent[0].children.length ? recent : '<span class="placeholder">No recent deadlines <br/>in the last half month</span>'
	);
	
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
		document.removeEventListener('keydown', closeOnEsc);
		history.back();
		//history.pushState('', document.title, window.location.pathname); //remove hash
	};
	
	// Show popup window
	function openPopup(title,content,o) {
		document.title = ((o && o.pageTitle) ? o.pageTitle : title) + ' - ' + docTitle;
		//window.history.pushState('', ((o && o.pageTitle) ? o.pageTitle : title) + ' - ' + docTitle, '/project/');
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
		
		popup.getElementsByClassName('resize')[0].addEventListener(tap, function(e){
			e.preventDefault(); popup.classList.toggle('fullscreen'); if(cmdInput)cmdInput.select();
			if (o.resizeFn) o.resizeFn();
		});
		
		popup.getElementsByClassName('close')[0].addEventListener(tap, function(e){ e.preventDefault(); closePopup(); }); // Close popup when clicking on the close button
		shadow.addEventListener('click', closePopup); // Close popup when clicking on the shadow background
		document.addEventListener('keydown', closeOnEsc); // Close popup on pressing Escape
	};
	
	function getCostCentre(column_name,output) {
		for (var i = 0; i < list.costCentres.length; i++) {
			var n = list.costCentres[i]['column_name'].indexOf(column_name);
			if (n > -1) {
				if (list.costCentres[i][output].constructor === Array) return list.costCentres[i][output][n];
				else return list.costCentres[i][output];
			};
		};
	};
	
	// Show project code
	function showProject(projectid) {
		
		// if pd.country etc is an array then do nothing else split, also replace below with just pd.country
		
		var pd = alasql('SELECT * FROM project WHERE [id] = "'+ projectid +'"')[0],
			gtable = $('<table/>',{'class': 'grantlist'}).append('<caption>Grant history</caption><tr><th>DB date</th><th>Disbursed</th><th>Grantee</th>' + (is_iPhone ? '<th>Cost centre</th>' : '<th>Donor</th><th>CoS cost centre</th>') + '<th>Amount</th></tr>'),
			gd = [];
			
		// First set up det gd (grant details) array with the following structure: decisions > disbursements > actual amounts
		for (var i = 0; i < list.columnCostCentres.length; i++) {
			var cc = list.columnCostCentres[i],
				disbursements = alasql('SELECT date_decision, date_disbursement, partner_name, link_db, '+ cc +' AS amount FROM grant WHERE [id] = "'+ projectid +'"'); // this is the only call to the grant database, although it's called for each cost centre
			for (var ii = 0; ii < disbursements.length; ii++) {
				var amount = disbursements[ii].amount,
					dec = disbursements[ii].date_decision,
					disb = disbursements[ii].date_disbursement,
					partner = disbursements[ii].partner_name,
					link_db = disbursements[ii].link_db;
				if (amount) {
					var foundDec = false;
					for (var o = 0; o < gd.length; o++) {
						if (gd[o].date_decision.valueOf() == dec.valueOf()) {
							foundDec = true;
							if (link_db) gd[o].link_db = link_db; // overwrite with the last link
							var foundDisb = false;
							for (var oo = 0; oo < gd[o].disbursements.length; oo++) {
								if (gd[o].disbursements[oo].date_disbursement.valueOf() == disb.valueOf() && gd[o].disbursements[oo].partner[gd[o].disbursements[oo].partner.length-1] == partner) {
									foundDisb = true;
									gd[o].disbursements[oo].partner.push(partner);
									gd[o].disbursements[oo].costCentre.push(cc);
									gd[o].disbursements[oo].amount.push(amount);
								};
							};
							if (!foundDisb) {
								gd[o].disbursements.push({
									date_disbursement: disb,
									partner: [partner],
									costCentre: [cc],
									amount: [amount]
								});
							};
						};
					};
					if (!foundDec) {
						gd.push({
							date_decision: dec,
							link_db: link_db,
							disbursements: [{
								date_disbursement: disb,
								partner: [partner],
								costCentre: [cc],
								amount: [amount]
							}]
						});
					};
				};
			};
		};
		gd.sort(function(a,b) { return a.date_decision - b.date_decision; }); // sort the decisions by dates

		// Then use the newly set up gd array to populate the grants html table (gtable)
		for (var i = 0; i < gd.length; i++) {
			gd[i].disbursements.sort(function(a,b) { return a.date_disbursement - b.date_disbursement; }); // sort the disbursements by date
			var decision = gd[i],
				date_decision = gd[i].date_decision,
				link_db = gd[i].link_db,
				rowspanDec = 0,
				rowsDec = 0;
			for (var ii = 0; ii < decision.disbursements.length; ii++) {
				rowspanDec += decision.disbursements[ii].amount.length;
			};
			for (var ii = 0; ii < decision.disbursements.length; ii++) {
				var disbursement = decision.disbursements[ii],
					date_disbursement = disbursement.date_disbursement,
					rowspanDisb = disbursement.amount.length;
				for (var iii = 0; iii < disbursement.amount.length; iii++) {
					var amount = disbursement.amount[iii],
						partner = disbursement.partner[iii],
						costCentre = disbursement.costCentre[iii];
					rowsDec += 1;
					$('<tr/>')
						.append(rowsDec == 1 ? $('<td/>',{'class': 'date', rowspan: rowspanDec, html: !link_db || is_iPhone ? moment(date_decision).format('YYYY-MM-DD') : '<a href="'+ link_db +'" title="Open DB'+ moment(date_decision).format('YYMMDD') +'">'+ moment(date_decision).format('YYYY-MM-DD') +'</a>'}) : '')
						.append(iii == 0 ? $('<td/>',{'class': 'date', rowspan: rowspanDisb, html: moment(date_disbursement).format('YYYY-MM-DD')}) : '')
						.append(iii == 0 ? $('<td/>',{'class': 'partner', rowspan: rowspanDisb, html: partner}) : '')
						.append($('<td/>',{'class': 'donor', html: getCostCentre(costCentre,'donor') + (is_iPhone ? ' / ' + getCostCentre(costCentre,'number') : '') }))
						.append(!is_iPhone ? $('<td/>',{html: getCostCentre(costCentre,'number') + (getCostCentre(costCentre,'name') ? ' / ' + getCostCentre(costCentre,'name') : '')}) : '')
						.append($('<td/>',{'class': 'amount', html: decCom(amount.toFixed()) + ' SEK'}))
						.appendTo(gtable);
				};
			};
		};
		
		$('<tr class="sum"><td colspan="'+ (is_iPhone ? '4' : '5') +'">Total</td><td class="amount">'+ decCom(pd.cost_all.toFixed()) +' SEK</td></tr>').appendTo(gtable);
		
		var listDeadlines = function() {
			var result = '';
			for (var i = 0; i < list.columnDeadlines.length; i++) {
				var cd = list.columnDeadlines[i],
					name = toTitleCase(cd.replace('deadline_', '').split('_').join(' ')),
					dlList = clean(alasql('SELECT COLUMN DISTINCT '+ cd +' FROM grant WHERE [id] = "'+ projectid +'"')),
					resArr = [];
				for (var ii = 0; ii < dlList.length; ii++) resArr.push(moment(dlList[ii]).format('YYYY-MM-DD'));
				if (resArr.length) result += '<li><span>'+ name +' deadline'+ pl(resArr.length) +':</span> <span>'+ resArr.sort().join(', ') +'</span></li>';	
			};
			return result;
		};

		// this is a FIX and it's very ugly, must be revisited (flattenDatabases doesn't work when arriving at project link)
		var toFlatten = ['country', 'sector', 'code_alpha2']
		for (var ii = 0; ii < toFlatten.length; ii++) {
			if (pd[toFlatten[ii]].constructor === Array) pd[toFlatten[ii]] = pd[toFlatten[ii]].join(', ');
		};
		
		var content = $('<div/>',{'id': 'projectdetails'})
							.append((is_iPhone || (pd.po_id == 0)) ? '' : $('<a/>',{'class': 'vipslink', 'href': 'http://vips.svenskakyrkan.se/insatser/1/' + projectid, 'title': pd.title, 'html': '<span class="r1">Link to</span><span class="r2">Vips</span><span class="r3">'+ projectid +'</span>'}))
							.append($('<ul/>',{'class': 'info'})
								.append($('<li/>',{'html': '<span>Project ID:</span> <span>'+ projectid +'</span>'}))
								.append($('<li/>',{'html': '<span style="padding-bottom: 20px;">Project code:</span> <span>'+ pd.code +'</span>'}))
								.append(pd.country ? ($('<li/>',{'html': '<span>'+ ((pd.country.split(', ').length == 1) ? 'Country:' : 'Countries:') +'</span> <span>'+ pd.country +'</span>'})) : '')
								.append(pd.po_id != 0 ? $('<li/>',{'html': '<span>Programme officer:</span> <span>'+ pd.po_name +'</span>'}) : '')
								.append($('<li/>',{'html': '<span>Project start:</span> <span>'+ moment(pd.date_project_start).format('YYYY-MM-DD') +'</span>', 'class': 'clr borderbottom'}))
								.append($('<li/>',{'html': '<span>Project end:</span> <span>'+ moment(pd.date_project_end).format('YYYY-MM-DD') +'</span>', 'class': 'borderbottom'}))
								.append(pd.partner.length ? $('<li/>',{'html': '<span>Partner'+ pl(pd.partner.length) +':</span> <span>'+ pd.partner +'</span>'}) : '')
								.append(pd.sector.length ? $('<li/>',{'html': '<span>Sector'+ pl(pd.sector.length) +':</span> <span>'+ pd.sector +'</span>'}) : '')
								.append(pd.fundraising_number ? $('<li/>',{'html': '<span>Fundraising number:</span> <span>'+ pd.fundraising_number +'</span>'}) : '')
								.append($('<li/>',{'html': '<span>IATI Activity ID:</span> <span>'+ setup.iatiID + '-' + projectid +'</span>'}))
								.append(listDeadlines())
								.append(pd.monitoring_visit[0] ? $('<li/>',{'html': '<span>Monitoring visit:</span> <span>'+ pd.monitoring_visit +'</span>', 'class': 'w2 clr'}) : '')
								.append(pd.deployment[0] ? $('<li/>',{'html': '<span>Deployment:</span> <span>'+ pd.deployment +'</span>', 'class': 'w2 clr'}) : '')
								.append(clean(pd.comments)[0] ? $('<li/>',{'html': '<span>Comments:</span> <span>'+ clean(pd.comments) +'</span>', 'class': 'w2 clr'}) : ''))
							.append($('<div/>',{'class': 'country'}))
							.append(gtable);

		openPopup(pd.title,content[0].outerHTML,{'pageTitle': pd.code, 'classes': 'r-' + pd.cos_region}); // show project in popup

		history.pushState({ 'showPage': projectid }, '', baseUrl + '?project=' + projectid);

		// Async update the country img
		var mapUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=250x250&style=saturation:-100&'
					+ 'style=feature:water|element:geometry.fill|lightness:100&key='
					+ setup.googleMapsApiKey,
			count_getJSONs_done = 0,
			a2 = pd.code_alpha2.split(', ');
		// First loop through the the alpha-2 country codes and get the geocodes (viewport) of the countries from Google's Geocode API
		for (var i = 0; i < a2.length; i++) {
			var c = a2[i];
			$.getJSON({
				dataType:'json',
				url: 'https://maps.googleapis.com/maps/api/geocode/json?components=country:' + c,
				key: setup.googleMapsGeocodingKey,
				success: function(responseData) {
					var b = responseData.results[0].geometry.viewport; // used .bounds before but it wasn't perfect
					mapUrl += '&visible=' + b.northeast.lat + ',' + b.northeast.lng + '&visible=' + b.southwest.lat + ',' + b.southwest.lng;
				}
			})
			// Once the all JSON requests are finished, build the url and get the map image from Google's Static Maps API
			.always(function() {
				count_getJSONs_done++;
				if (count_getJSONs_done == a2.length) $('#popup #projectdetails .country').append('<img src="'+ mapUrl +'" alt=""' + (pd.country ? ' title="Map of '+ pd.country.split(', ').filter(function(i) {if (i !== 'Global') return i}).join(' and ') +'"' : '') + ' />');
			});
		};
	}

	var bodyClasses = '';
	if (userPrefs.showSidebar) bodyClasses += ' showSidebar';
	if (userPrefs.showYearsStripe) bodyClasses += ' showYearsStripe';
	if (userPrefs.showRegionColours) bodyClasses += ' showRegionColours';
	
	/*if (!vipsOnline()) {
		bodyClasses += ' novips';
		softAlert('You don\'t seem to have access to Vips. Do you still want to display the vips links?','info', {confirmation: {
			confText: 'SHOW ME THE LINKS', confFunc: function() {
				$('body').removeClass('novips');
			}
		}});
	};*/
	
	// Shows alaSQL Console
	var cmdInput, lastWord, matched = [], lastMatch, input = '', inputLog = [''], inputN = 1,
		commands = ['ALTER TABLE', 'RENAME TO', 'ADD COLUMN',  'MODIFY COLUMN',  'RENAME COLUMN',  'DROP',  'ATTACH',  'DATABASE',  'ASSERT',  'BEGIN',  'COLUMNS', 'COMMIT',  'CREATE',  'IF EXISTS',  'IF NOT EXISTS', 'CREATE TABLE', 'DELETE FROM', 'WHERE', 'DETACH DATABASE', 'INTO', 'INSERT INTO', 'VALUES', 'DEFAULT VALUES', 'SELECT', 'HELP', 'ROLLBACK', 'FROM', 'JOIN', 'ON', 'USING', 'GROUP BY', 'HAVING', 'ORDER BY', 'SET', 'SHOW', 'DATABASES', 'SHOW TABLES', 'SHOW CREATE TABLE', 'UPDATE', 'USE', 'clear', 'exit', 'project'].concat(alasql('SELECT COLUMN DISTINCT columnid FROM ? ORDER BY columnid',[alasql('SHOW COLUMNS FROM grant').concat(alasql('SHOW COLUMNS FROM project'))])); // autocomplete hints
	function showConsole() {
		var content = '<div id="console">'
					+ '<div><div class="display"><div data-timestamp="' + Date.now() + '">'
					//+ 'Type HELP for available commands<br/><br/>'
					+ 'To list column names type SHOW COLUMNS FROM tablename<br/><br/>There are two tables: [grant] and [project]<br/><br/></div></div></div>'
					+ '<form><textarea rows="1" autofocus></textarea></form>'
					+ '</div>';
		openPopup('SQL Console',content,{width:'88ch',classes:'theme_dark resizable roundedcorners'}); // show console in popup

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
			if (this.value > input && this.value.length == this.selectionStart) { // Prevent firing event when deleting characters or when the cursor in not at the end
				input = this.value;
				inputLog[inputLog.length-1] = input;
				inputN = inputLog.length-1;

				lastWord = input.split(/ |\n/).pop();
				matched = (lastWord) ? commands.filter(function (m) { return m.substr(0, lastWord.length).toUpperCase() == lastWord.toUpperCase() }) : [];

				if (matched.length) {
					this.value = input + matched[0].substr(lastWord.length);
					this.selectionStart = input.length;
				};

				// Autoresize textarea on input
				resizeCmd();
			} else {
				matched = [];
			};
		});		
	
		cmdInput.addEventListener('keydown', function(e) {
			input = this.value;
			var output;
			if (!(e.shiftKey && e.keyCode == 13)) { // Escape the shift key (for shift+enter)
				switch(e.keyCode) {
					case 13: // ENTER
						e.preventDefault();
						input = input.trim(); // remove unnecessary spaces from around the input string - not crucial
						if (input !== '') {
							var displayInput = document.createElement('div'),
								displayOutput = document.createElement('div'),
								timestampInput = Date.now(),
								downloadLink;
							displayInput.innerHTML = '&#62; ' + input;
							displayInput.dataset.timestamp = timestampInput;
							displayInput.className = 'input';
							display.appendChild(displayInput);

							if (input.toLowerCase() == 'clr' || input.toLowerCase() == 'clear') {
								while (display.firstChild) {
									display.removeChild(display.firstChild);
								};
							} else if (input.toLowerCase() == 'exit') {
								closePopup();
							} else if (input.toLowerCase() == 'theme dark') {
								popup.classList.remove('theme_light');
								popup.classList.add('theme_dark');
								displayOutput.innerHTML = 'Theme set to dark.';
							} else if (input.toLowerCase() == 'theme light') {
								popup.classList.add('theme_light');
								popup.classList.remove('theme_dark');
								displayOutput.innerHTML = 'Theme set to light.';
							} else if (input.slice(0,13).toLowerCase() == 'show columns ') { // hack until SHOW COLUMNS starts working in promises
								displayOutput.innerHTML = alasql('SELECT COLUMN columnid FROM ?',[alasql(input)]).sort().join(' | ');
							} else {
								alasql.promise(input).then(function(res) {
									if (res && res.constructor === Array) {
										var table = document.createElement('table'),
											tableHeadRow = document.createElement('tr');
										for (var key in res[0]) {
											var tableHeadCell = document.createElement('th'),
												cellClass = 'col-' + key.replace(/ /g,'_') + (res[0][key] instanceof Date ? ' col-date' : '');
											tableHeadCell.className = cellClass;
											tableHeadCell.innerHTML = key;
											tableHeadRow.appendChild(tableHeadCell);
										};
										table.appendChild(tableHeadRow);
										for (var i = 0; i < res.length; i++) {
											var tableBodyRow = document.createElement('tr');
											for (var key in res[i]) {
												var tableBodyCell = document.createElement('td'),
													cellText = res[i][key],
													cellClass = 'col-' + key.replace(/ /g,'_');												
												if (cellText instanceof Date) {
													cellText = cellText.toISOString().slice(0,10);
													cellClass += ' col-date';
												} else if (key.substring(0, 5) == 'cost_') {
													cellText = !cellText ? 0 : cellText.toFixed();
													cellClass += ' col-amount';
												};
												tableBodyCell.className = cellClass;
												tableBodyCell.innerHTML = cellText;		
												tableBodyRow.appendChild(tableBodyCell);
											};
											table.appendChild(tableBodyRow);
										};
										output = table;
										
										// If it's a select query, add a download link at the end
										if (input.slice(0,7).toLowerCase() == 'select ') {
											downloadLink = document.createElement('span');
											downloadLink.innerHTML = 'Download results in Excel format';
											downloadLink.className = 'download';
											var downloadInput = input.replace(/from/i,'INTO XLSX("QuickHUM_'+ new Date(timestampInput).toISOString().slice(0,19).replace('T','_').split(':').join('') +'.xlsx",{headers:true,sheetid:"Sheet1"}) FROM');
											downloadLink.addEventListener('click', function() {
												alasql(downloadInput);
											});
										};
										
									} else if (res) {
										displayOutput.innerHTML = res;
									}
									displayOutput.className = 'output';
								}).catch(function(err){
									errorOutput = document.createElement('span');
									errorOutput.innerHTML = err;
									output = errorOutput;
									displayOutput.className = 'output error';
									console.log(err);
								}).then(function() {
									if (output) displayOutput.appendChild(output);
									if (downloadLink) displayOutput.appendChild(downloadLink);
									displayOutput.dataset.timestamp = Date.now();
									resizeCmd(true);
								});
							};

							displayOutput.dataset.timestamp = Date.now();
							display.appendChild(displayOutput);

							inputLog[inputLog.length-1] = input;
							inputLog.push('');
							inputN = inputLog.length-1;
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
	} // END OF CONSOLE
				
	$('#problem,#loading').remove();
	$('body').addClass('theme_cos' + bodyClasses).append(header,wrapper.append(main.append(sidebar,content.prepend(filters,infobar))).append(footer));
	
	sortProjects(userPrefs.sortBy);
	$('div#sorting select option[value="'+ userPrefs.sortBy +'"]').prop('selected', true);

	// check if there are any url parameters
	var urlParams = getAllUrlParams();
	history.pushState({showPage: 'start'}, '', baseUrl);
	if (urlParams.page) {
		switch (urlParams.page) {
			case 'search': 
				if (urlParams.q) var param = { q: urlParams.q };
				showPage('search', param);
				startButton('reset', 'page-search');
				break;
			case 'stats': 
				if (urlParams.year) var param = { year: urlParams.year };
				showPage('stats', param);
				startButton('back', 'page-stats');
		};
	} else if (urlParams.project) {
		showProject(urlParams.project);
		startButton('start');
	} else startButton('start');
	updCalc();
	
	// Set up some shortcut keys
	document.addEventListener('keydown', function(e) {
		switch (e.which) {
			case 27: // Escape
				e.preventDefault();
				if (!$('body').hasClass('fullscreen')) {
					var pageClass = 'page-' + $('body').attr('data-page');
					showPage('start');
					startButton('start');
					showClasses = {POs:[],years:[],regions:[],filters:[]};
					$('#header li.menuitem, #header div.menu').removeClass('on');
					$('#header .left select option').removeAttr('selected');
					$('#header .left select').trigger('change');
					$('body').removeClass('page ' + pageClass).removeAttr('data-page');
					$('#pageheader, #pagebody, #content>.page').remove();
					updCalc();
				};
				break;
			case 32: // Space
				if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !$('body').hasClass('fullscreen')) {
					e.preventDefault();
					showPage('search');
					startButton('reset');
				};
				break;
			case 39: // Right arrow
				if (!$('body').hasClass('fullscreen')) $('#projects>li').addClass('on');
				break;
			case 37: // Left arrow
				if (!$('body').hasClass('fullscreen')) $('#projects>li').removeClass('on');
		};
	});
	/*
	window.addEventListener('popstate', function(e) {
		alert("location: " + document.location + ", state: " + JSON.stringify(e.state));
	});
	*/
	
	// Monitor source XLSX for changes
	var dbMonitor = is_iPhone ? setup.dropboxMonitor[1] : setup.dropboxMonitor[0];
	if (dbMonitor > 0) {
		var msInterval = dbMonitor * 1000,
			lastModDate = parseInt(localStorage.getItem('lastModDate'));
		window.monitorDropboxFile = setInterval(function() {
			if (navigator.onLine) {
				dbx.filesGetMetadata({path: setup.dropboxFileId}).then(function(response) {
					var newModDate = new Date(response['server_modified']).getTime();
					if (newModDate > lastModDate) {
						
						dbx.usersGetAccount({account_id: response.sharing_info.modified_by}).then(function(user) {
							softAlert('The grant database was updated by '+ user['name'].familiar_name +' at '+ moment(newModDate).format('HH:mm'),'info', {dismissText: 'REFRESH PAGE', dismissFunction: function(){
								document.body.className = 'reloading';
								location.href=location.href;
								
								// Maybe later introduce soft reload instead?
								//document.body.removeChild(document.getElementById('header'));
								//document.body.removeChild(document.getElementById('wrapper'));
								//alasql('DROP TABLE costcentre; DROP TABLE grant; DROP TABLE project');
								//start();
							}});

						});
						lastModDate = newModDate;
						clearInterval(window.monitorDropboxFile); // no point to keep checking after we know that the DB has already been updated
					};
				});
			};
		}, msInterval);
	};
	
}

function flattenDatabases() {
	for (var i = 0; i < window.alasql.databases.alasql.tables.grant.data.length; i++) {
		var o = window.alasql.databases.alasql.tables.grant.data[i];
		for (var key in o) {
			if (o[key] && o[key].constructor === Array) o[key] = o[key].join(', ')
		};
	};
	for (var i = 0; i < window.alasql.databases.alasql.tables.project.data.length; i++) {
		var o = window.alasql.databases.alasql.tables.project.data[i];
		for (var key in o) {
			if (o[key] && o[key].constructor === Array) o[key] = o[key].join(', ')
			
		};
	};
}

function start() {
	if (is_iPhone) document.body.className = 'mobileApp';
	else document.body.className = 'noMobile';
	for (var key in userPrefs) if (userPrefs[key]) document.body.classList.add(key);

	function loadFromLocal() {
		console.log('Loading DB from localStorage');
		alasql.promise('SELECT * FROM ?'+ (userPrefs.showLast9yearsOnly ? ' WHERE [Date Project start] > '+ nineYearsAgo : ''),[JSON.parse(localStorage.getItem('grants'))]).then(function(grants) {
			loadDB(grants);
			loadDOM();
			flattenDatabases();
		});
	}

	dbx.filesGetMetadata({path: setup.dropboxFileId}).then(function(response) {
		var lastModDate = (localStorage.getItem('lastModDate')) ? parseInt(localStorage.getItem('lastModDate')) : 0,
			newModDate = new Date(response['server_modified']).getTime();
		if (newModDate > lastModDate) {
			console.log('Loading DB from online XLSX');
			alasql.promise('SELECT * FROM XLSX("'+ setup.xlsxurl +'",{sheetid:"Grants"})'+ (userPrefs.showLast9yearsOnly ? ' WHERE [Date Project start] > '+ nineYearsAgo : '')).then(function(grants) {
				localStorage.setItem('grants', JSON.stringify(grants));
				loadDB(grants);
				loadDOM();
				flattenDatabases();
			});
			localStorage.setItem('lastModDate', newModDate);
		} else loadFromLocal();
	}).catch(function(error) {
		loadFromLocal();
		softAlert('You seem to be offline. But that\'s okay because QuickHUM was cached on '+ moment(parseInt(localStorage.getItem('lastModDate'))).format('D MMMM [at] HH:mm') +'.','warning');
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
	start();
});

/* chartist-plugin-tooltip 0.0.17 by Markus Padourek */
!function(a,b){"function"==typeof define&&define.amd?define(["chartist"],function(c){return a.returnExportsGlobal=b(c)}):"object"==typeof exports?module.exports=b(require("chartist")):a["Chartist.plugins.tooltips"]=b(Chartist)}(this,function(a){return function(a,b,c){"use strict";function d(a){f(a,"tooltip-show")||(a.className=a.className+" tooltip-show")}function e(a){var b=new RegExp("tooltip-show\\s*","gi");a.className=a.className.replace(b,"").trim()}function f(a,b){return(" "+a.getAttribute("class")+" ").indexOf(" "+b+" ")>-1}function g(a,b){do a=a.nextSibling;while(a&&!f(a,b));return a}function h(a){return a.innerText||a.textContent}var i={currency:void 0,currencyFormatCallback:void 0,tooltipOffset:{x:0,y:-20},anchorToPoint:!1,appendToBody:!1,class:void 0,pointClass:"ct-point"};c.plugins=c.plugins||{},c.plugins.tooltip=function(j){return j=c.extend({},i,j),function(i){function k(a,b,c){n.addEventListener(a,function(a){b&&!f(a.target,b)||c(a)})}function l(b){p=p||o.offsetHeight,q=q||o.offsetWidth;var c,d,e=-q/2+j.tooltipOffset.x,f=-p+j.tooltipOffset.y;if(j.appendToBody)o.style.top=b.pageY+f+"px",o.style.left=b.pageX+e+"px";else{var g=n.getBoundingClientRect(),h=b.pageX-g.left-a.pageXOffset,i=b.pageY-g.top-a.pageYOffset;!0===j.anchorToPoint&&b.target.x2&&b.target.y2&&(c=parseInt(b.target.x2.baseVal.value),d=parseInt(b.target.y2.baseVal.value)),o.style.top=(d||i)+f+"px",o.style.left=(c||h)+e+"px"}}var m=j.pointClass;i instanceof c.Bar?m="ct-bar":i instanceof c.Pie&&(m=i.options.donut?"ct-slice-donut":"ct-slice-pie");var n=i.container,o=n.querySelector(".chartist-tooltip");o||(o=b.createElement("div"),o.className=j.class?"chartist-tooltip "+j.class:"chartist-tooltip",j.appendToBody?b.body.appendChild(o):n.appendChild(o));var p=o.offsetHeight,q=o.offsetWidth;e(o),k("mouseover",m,function(a){var e=a.target,f="",k=i instanceof c.Pie?e:e.parentNode,m=k?e.parentNode.getAttribute("ct:meta")||e.parentNode.getAttribute("ct:series-name"):"",n=e.getAttribute("ct:meta")||m||"",r=!!n,s=e.getAttribute("ct:value");if(j.transformTooltipTextFnc&&"function"==typeof j.transformTooltipTextFnc&&(s=j.transformTooltipTextFnc(s)),j.tooltipFnc&&"function"==typeof j.tooltipFnc)f=j.tooltipFnc(n,s);else{if(j.metaIsHTML){var t=b.createElement("textarea");t.innerHTML=n,n=t.value}if(n='<span class="chartist-tooltip-meta">'+n+"</span>",r)f+=n+"<br>";else if(i instanceof c.Pie){var u=g(e,"ct-label");u&&(f+=h(u)+"<br>")}s&&(j.currency&&(s=void 0!=j.currencyFormatCallback?j.currencyFormatCallback(s,j):j.currency+s.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g,"$1,")),s='<span class="chartist-tooltip-value">'+s+"</span>",f+=s)}f&&(o.innerHTML=f,l(a),d(o),p=o.offsetHeight,q=o.offsetWidth)}),k("mouseout",m,function(){e(o)}),k("mousemove",null,function(a){!1===j.anchorToPoint&&l(a)})}}}(window,document,a),a.plugins.tooltips});

// TAP.JS by Ilya Pukhalski to remove touch event lag https://github.com/pukhalski/tap
!function(a){var b={},c={};c.attachEvent=function(b,c,d){return"addEventListener"in a?b.addEventListener(c,d,!1):void 0},c.fireFakeEvent=function(a,b){return document.createEvent?a.target.dispatchEvent(c.createEvent(b)):void 0},c.createEvent=function(b){if(document.createEvent){var c=a.document.createEvent("HTMLEvents");return c.initEvent(b,!0,!0),c.eventName=b,c}},c.getRealEvent=function(a){return a.originalEvent&&a.originalEvent.touches&&a.originalEvent.touches.length?a.originalEvent.touches[0]:a.touches&&a.touches.length?a.touches[0]:a};var d=[{test:("propertyIsEnumerable"in a||"hasOwnProperty"in document)&&(a.propertyIsEnumerable("ontouchstart")||document.hasOwnProperty("ontouchstart")||a.hasOwnProperty("ontouchstart")),events:{start:"touchstart",move:"touchmove",end:"touchend"}},{test:a.navigator.msPointerEnabled,events:{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}},{test:a.navigator.pointerEnabled,events:{start:"pointerdown",move:"pointermove",end:"pointerup"}}];b.options={eventName:"tap",fingerMaxOffset:11};var e,f,g,h,i={};e=function(a){return c.attachEvent(document.documentElement,h[a],g[a])},g={start:function(a){a=c.getRealEvent(a),i.start=[a.pageX,a.pageY],i.offset=[0,0]},move:function(a){return i.start||i.move?(a=c.getRealEvent(a),i.move=[a.pageX,a.pageY],void(i.offset=[Math.abs(i.move[0]-i.start[0]),Math.abs(i.move[1]-i.start[1])])):!1},end:function(d){if(d=c.getRealEvent(d),i.offset[0]<b.options.fingerMaxOffset&&i.offset[1]<b.options.fingerMaxOffset&&!c.fireFakeEvent(d,b.options.eventName)){if(a.navigator.msPointerEnabled||a.navigator.pointerEnabled){var e=function(a){a.preventDefault(),d.target.removeEventListener("click",e)};d.target.addEventListener("click",e,!1)}d.preventDefault()}i={}},click:function(a){return c.fireFakeEvent(a,b.options.eventName)?void 0:a.preventDefault()}},f=function(){for(var a=0;a<d.length;a++)if(d[a].test){h=d[a].events,e("start"),e("move"),e("end");break}return c.attachEvent(document.documentElement,"click",g.click)},c.attachEvent(a,"load",f),"function"==typeof define&&define.amd?define(function(){return f(),b}):a.Tap=b}(window);

/* TinySort 2.3.6 by Ron Valstar http://tinysort.sjeiti.com/ */
!function(e,t){"use strict";function r(){return t}"function"==typeof define&&define.amd?define("tinysort",r):e.tinysort=t}(this,function(){"use strict";function e(e,n){function s(){0===arguments.length?v({}):t(arguments,function(e){v(x(e)?{selector:e}:e)}),d=$.length}function v(e){var t=!!e.selector,n=t&&":"===e.selector[0],o=r(e||{},m);$.push(r({hasSelector:t,hasAttr:!(o.attr===l||""===o.attr),hasData:o.data!==l,hasFilter:n,sortReturnNumber:"asc"===o.order?1:-1},o))}function S(){t(e,function(e,t){M?M!==e.parentNode&&(k=!1):M=e.parentNode;var r=$[0],n=r.hasFilter,o=r.selector,a=!o||n&&e.matchesSelector(o)||o&&e.querySelector(o),l=a?R:V,s={elm:e,pos:t,posn:l.length};B.push(s),l.push(s)}),D=R.slice(0)}function y(e,t,r){for(var n=r(e.toString()),o=r(t.toString()),a=0;n[a]&&o[a];a++)if(n[a]!==o[a]){var l=Number(n[a]),s=Number(o[a]);return l==n[a]&&s==o[a]?l-s:n[a]>o[a]?1:-1}return n.length-o.length}function N(e){for(var t,r,n=[],o=0,a=-1,l=0;t=(r=e.charAt(o++)).charCodeAt(0);){var s=46==t||t>=48&&57>=t;s!==l&&(n[++a]="",l=s),n[a]+=r}return n}function C(e,r){var n=0;for(0!==p&&(p=0);0===n&&d>p;){var l=$[p],s=l.ignoreDashes?f:u;if(t(h,function(e){var t=e.prepare;t&&t(l)}),l.sortFunction)n=l.sortFunction(e,r);else if("rand"==l.order)n=Math.random()<.5?1:-1;else{var c=a,g=w(e,l),m=w(r,l),v=""===g||g===o,S=""===m||m===o;if(g===m)n=0;else if(l.emptyEnd&&(v||S))n=v&&S?0:v?1:-1;else{if(!l.forceStrings){var C=x(g)?g&&g.match(s):a,b=x(m)?m&&m.match(s):a;if(C&&b){var A=g.substr(0,g.length-C[0].length),F=m.substr(0,m.length-b[0].length);A==F&&(c=!a,g=i(C[0]),m=i(b[0]))}}n=g===o||m===o?0:l.natural&&(isNaN(g)||isNaN(m))?y(g,m,N):m>g?-1:g>m?1:0}}t(h,function(e){var t=e.sort;t&&(n=t(l,c,g,m,n))}),n*=l.sortReturnNumber,0===n&&p++}return 0===n&&(n=e.pos>r.pos?1:-1),n}function b(){var e=R.length===B.length;if(k&&e)O?R.forEach(function(e,t){e.elm.style.order=t}):M?M.appendChild(A()):console.warn("parentNode has been removed");else{var t=$[0],r=t.place,n="org"===r,o="start"===r,a="end"===r,l="first"===r,s="last"===r;if(n)R.forEach(F),R.forEach(function(e,t){E(D[t],e.elm)});else if(o||a){var c=D[o?0:D.length-1],i=c&&c.elm.parentNode,u=i&&(o&&i.firstChild||i.lastChild);u&&(u!==c.elm&&(c={elm:u}),F(c),a&&i.appendChild(c.ghost),E(c,A()))}else if(l||s){var f=D[l?0:D.length-1];E(F(f),A())}}}function A(){return R.forEach(function(e){q.appendChild(e.elm)}),q}function F(e){var t=e.elm,r=c.createElement("div");return e.ghost=r,t.parentNode.insertBefore(r,t),e}function E(e,t){var r=e.ghost,n=r.parentNode;n.insertBefore(t,r),n.removeChild(r),delete e.ghost}function w(e,t){var r,n=e.elm;return t.selector&&(t.hasFilter?n.matchesSelector(t.selector)||(n=l):n=n.querySelector(t.selector)),t.hasAttr?r=n.getAttribute(t.attr):t.useVal?r=n.value||n.getAttribute("value"):t.hasData?r=n.getAttribute("data-"+t.data):n&&(r=n.textContent),x(r)&&(t.cases||(r=r.toLowerCase()),r=r.replace(/\s+/g," ")),null===r&&(r=g),r}function x(e){return"string"==typeof e}x(e)&&(e=c.querySelectorAll(e)),0===e.length&&console.warn("No elements to sort");var D,M,q=c.createDocumentFragment(),B=[],R=[],V=[],$=[],k=!0,z=e.length&&e[0].parentNode,L=z.rootNode!==document,O=e.length&&(n===o||n.useFlex!==!1)&&!L&&-1!==getComputedStyle(z,null).display.indexOf("flex");return s.apply(l,Array.prototype.slice.call(arguments,1)),S(),R.sort(C),b(),R.map(function(e){return e.elm})}function t(e,t){for(var r,n=e.length,o=n;o--;)r=n-o-1,t(e[r],r)}function r(e,t,r){for(var n in t)(r||e[n]===o)&&(e[n]=t[n]);return e}function n(e,t,r){h.push({prepare:e,sort:t,sortBy:r})}var o,a=!1,l=null,s=window,c=s.document,i=parseFloat,u=/(-?\d+\.?\d*)\s*$/g,f=/(\d+\.?\d*)\s*$/g,h=[],d=0,p=0,g=String.fromCharCode(4095),m={selector:l,order:"asc",attr:l,data:l,useVal:a,place:"org",returns:a,cases:a,natural:a,forceStrings:a,ignoreDashes:a,sortFunction:l,useFlex:a,emptyEnd:a};return s.Element&&function(e){e.matchesSelector=e.matchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,r=(t.parentNode||t.document).querySelectorAll(e),n=-1;r[++n]&&r[n]!=t;);return!!r[n]}}(Element.prototype),r(n,{loop:t}),r(e,{plugin:n,defaults:m})}());

/* Google Analytics */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-73072736-1', 'auto');
ga('send', 'pageview');