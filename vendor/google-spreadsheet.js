/*
Updated versions can be found at https://github.com/mikeymckay/google-spreadsheet-javascript
*/
var GoogleSpreadsheet, GoogleUrl;
GoogleUrl = (function() {
  function GoogleUrl(sourceIdentifier, gid) {
    this.sourceIdentifier = sourceIdentifier;
    this.gid = gid || 1;
    if (this.sourceIdentifier.match(/http(s)*:/)) {
      this.url = this.sourceIdentifier;
      try {
        this.key = this.url.match(/key=(.*?)&/)[1];
      } catch (error) {
        try {
          this.key = this.url.match(/(cells|list)\/(.*?)\//)[2];
        } catch (error) {
          this.key = this.url.match(/d\/(.*?)\//)[1];
        }
      }
    } else {
      this.key = this.sourceIdentifier;
    }
    this.jsonCellsUrl = "https://spreadsheets.google.com/feeds/cells/" + this.key + "/" + this.gid + "/public/basic?alt=json-in-script";
    this.jsonListUrl = "https://spreadsheets.google.com/feeds/list/" + this.key + "/" + this.gid + "/public/basic?alt=json-in-script";
    this.jsonUrl = this.jsonListUrl;
  }
  return GoogleUrl;
})();
GoogleSpreadsheet = (function() {
  function GoogleSpreadsheet() {}
  GoogleSpreadsheet.prototype.load = function(callback) {
    var intervalId, safetyCounter, waitUntilLoaded;
    var url, googleUrl;
    //url = this.googleUrl.jsonCellsUrl + "&callback=GoogleSpreadsheet.callback";
    //$('body').append("<script src='" + url + "'/>");
    
    url = this.googleUrl.jsonListUrl + "&callback=GoogleSpreadsheet.callback";
    $('body').append("<script src='" + url + "'/>");

    googleUrl = this.googleUrl;
    safetyCounter = 0;
    waitUntilLoaded = function() {
      var result;
      result = GoogleSpreadsheet.find({
        googleUrl: googleUrl
      });
      if (safetyCounter++ > 20 || ((result != null) && (result.data != null))) {
        clearInterval(intervalId);
        return callback(result);
      }
    };
    intervalId = setInterval(waitUntilLoaded, 200);
    if (typeof result != "undefined" && result !== null) {
      return result;
    }
  };
  GoogleSpreadsheet.prototype.url = function(url, gid) {
    return this.googleUrl(new GoogleUrl(url, gid));
  };
  GoogleSpreadsheet.prototype.googleUrl = function(googleUrl) {
    if (typeof googleUrl === "string") {
      throw "Invalid url, expecting object not string";
    }
    this.url = googleUrl.url;
    this.key = googleUrl.key;
    this.gid = googleUrl.gid;
    this.jsonUrl = googleUrl.jsonUrl;
    return this.googleUrl = googleUrl;
  };
  GoogleSpreadsheet.prototype.save = function() {
    return localStorage["GoogleSpreadsheet." + this.googleUrl.key + "." + this.googleUrl.gid] = JSON.stringify(this);
  };
  return GoogleSpreadsheet;
})();
GoogleSpreadsheet.bless = function(object) {
  var key, result, value;
  result = new GoogleSpreadsheet();
  for (key in object) {
    value = object[key];
    result[key] = value;
  }
  return result;
};
GoogleSpreadsheet.find = function(googleUrl) {
  var item, itemObject, key, value, _i, _len;
  try {
    for (item in localStorage) {
      if (item.match(/^GoogleSpreadsheet\./)) {
        itemObject = JSON.parse(localStorage[item]);
          if (itemObject["GoogleSpreadsheet." + googleUrl.key + "." + googleUrl.key] === value) {
            return GoogleSpreadsheet.bless(itemObject);
          }
      }
    }
  } catch (error) {
    for (_i = 0, _len = localStorage.length; _i < _len; _i++) {
      item = localStorage[_i];
      if (item.match(/^GoogleSpreadsheet\./)) {
        itemObject = JSON.parse(localStorage[item]);
          if (itemObject["GoogleSpreadsheet." + googleUrl.key + "." + googleUrl.key] === value) {
            return GoogleSpreadsheet.bless(itemObject);
          }
      }
    }
  }
  return null;
};
GoogleSpreadsheet.callback = function(data) {
  var cell, googleSpreadsheet, googleUrl;
  googleUrl = new GoogleUrl(data.feed.id.$t, data.feed.id.$t.match(/(.)\/public/)[1]);
  googleSpreadsheet = GoogleSpreadsheet.find({
    googleUrl: googleUrl
  });
  if (googleSpreadsheet === null) {
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.googleUrl(googleUrl);
  }
  googleSpreadsheet.data = (function() {
    var _i, _len, _ref, _results;
    _ref = data.feed.entry;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      var obj = {};
      var row = cell.content.$t.split(', ');
      for(var j=0; j < row.length; j++) {
        var col = row[j];
        var val = col.split(': ');
        if(val[1].startsWith('"')) {
          obj[val[0]] =  val[1].substr(1, val[1].length-2);
        } else {
          obj[val[0]] =  val[1];  
        }
        
      }
      _results.push(obj);
    }
    return _results;
  })();
  googleSpreadsheet.save();
  return googleSpreadsheet;
};