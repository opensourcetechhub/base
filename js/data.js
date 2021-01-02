/*

function clearDataStorage() {
    for (item in localStorage) {
        if (item.match(/^GoogleSpreadsheet\./)) {
            localStorage.removeItem(item);
        }
    }
}

function getSheetData(key, sheetNo, callback) {
	clearDataStorage();
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(key, sheetNo);
	googleSpreadsheet.load(function(result){
		if(!result) {
			console.log('no result')
			return;
		}
		callback(result)
	});
}
*/

function getUrlData(key, url, callback) {
	$.get({
		url : url,
		success : function( response ) {
			callback(key, response.data);
		}
	});
}

function convertRowsToObj(rows) {
	var obj = {};
	for (var i = 0; i < rows.length; i++ ) {
		var row = rows[i];
		obj[row.id] = row;
	}
	return obj;
}
