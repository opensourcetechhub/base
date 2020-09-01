// var tenantUrl;
var configUrl;
var dataUrl;
var sectionUrl;

// var tenant;
var config;

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

    getUrlData('config', configUrl, function(key, result) {
        
        config = result;
        
        initNav();
        initHeader();
        initFooter();

        dataUrl = config.data || dataUrl;
        sectionUrl = config.section || sectorUrl;

        if(config.filter == 'Y') {
            //loadFilters(config.layout);
        } else {
            loadData(dataUrl, sectionUrl);
        }
        
    });
}

loadApp();