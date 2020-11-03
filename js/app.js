// var tenantUrl;
var configUrl;
var dataUrl;
var sectionUrl;

// var tenant;
var config;
/* config = {
  "logo" : "",
  "name" : "",
  "nav" : "Y",
  "filter" : "N",
  "data-dev" : "",
  "section-dev": "",
  "data" : "",
  "section" : ""
}
*/

var sections;
/* sections = [ 
  {
    "id" : "sec1",
    "name" : "Section 1",
    "state" : "active"
  },
];
*/

var widgets;
/* widgets = [
	{
	"section": "sec1",
	"id": "item1",
	"name": "Item 1",
	"desc": "",
	"type": "preview",
	"link": "",
	"size": "12"
	},
]
*/

var hash = window.location.hash;
if(hash) {
    tenant = hash.substr(1,hash.length);
} else {
    var paths = window.location.pathname.split('/');
    if(paths.length > 1) {
        tenant = paths[1];
    }
}

function loadApp() {

    // getSheetData(tenantSheetUrl, 1, function(result) {
        // var configs = convertRowsToObj(result.data);
        // if(tenant) {
        //     config = configs[tenant];
        // }
        // if(!config) {
        //     config = configs['default'];
        // }
	if(configUrl){
	getUrlData('config', configUrl, function(key, result) {
		config = result;
		initApp(config);
    });
	} else {
		initApp(config);	
	}
    
}

function initApp() {
        initNav();
        initHeader();
        initFooter();

        dataUrl = config.data || dataUrl;
        sectionUrl = config.section || sectionUrl;

        if(config.filter == 'Y') {
            //loadFilters(config.layout);
        } else {
            loadData(dataUrl, sectionUrl);
        }
}
	

loadApp();