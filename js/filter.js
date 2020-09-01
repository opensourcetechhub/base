var layoutSheetUrl;

var filters;
var filtersOptions = [];

function loadFilters(layoutSheetUrl) {
    this.layoutSheetUrl = layoutSheetUrl;
    getSheetData(layoutSheetUrl, 2, function(result) {
        filters = result.data;
        buildFilters(filters);
    });
}

function buildFilters(filters) {

    var form = '';
    form += '<form class="form-header row p-t-10 m-l-5 m-r-5 m-b-0" onsubmit="return false;">';
    form += '</form>';
    form = $(form);
    $('.main-content > .section__content').prepend(form);

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        var select = $(buildFilter(filter));
        if(filter.type == 'SECTION') {
            select.hide();
        }
        form.append(select);
    }

    buildParentFiltersOptions(filters);
}


function buildFilter(filter) {
    var size = 'col-6';
    if(filter.type == 'SECTION') {
        size = 'col-12';
    }
    var selector = '';
    selector += '	<select id="' + filter.id + '" class="' + filter.type + '-filter 1form-control-lg 1form-control ' + size + '" onchange="onFilterChange(event)">';
    selector += '       <option value="0" selected>Select ' + filter.name +'</option>';
    selector += '	</select>';
    return selector;
}

function buildParentFiltersOptions() {
    getSheetData(layoutSheetUrl, 3, function(result) {        
        filtersOptions = result.data;
        for (let index = 0; index < filtersOptions.length; index++) {
            filtersOption = filtersOptions[index];
            if(!filtersOption.parent) {                
                var option = '<option value="' + filtersOption.id +'">' + filtersOption.name + '</option>';
                $('#'+filtersOption.filterid).append($(option));
                var prevSelectedOptionId = localStorage.getItem(filtersOption.filterid);
                if(filtersOption.id == prevSelectedOptionId) {
                    $('#'+filtersOption.filterid).val(prevSelectedOptionId).trigger('change');
                }
            }
        }
    });
}

var localStorage = window.localStorage;

function onFilterChange(event) {

    var changedFilterId = event.target.id;
    var changedFilterOptionId = $('#'+ changedFilterId).val();

    if(changedFilterOptionId){
        localStorage.setItem(changedFilterId, changedFilterOptionId);    
    }

    for (let index = 0; index < filters.length; index++) {

        const filter = filters[index];

        if(filter.parent == changedFilterId) {

            if(filter.type == 'SECTION') {
                $('.form-header .SECTION-filter').empty();
                $('.form-header .SECTION-filter').hide();
            } else {
                var options = '<option value="0" selected>Select ' + filter.name +'</option>';
                var filteredOptions = [];
                for (let index = 0; index < filtersOptions.length; index++) {
                    var filtersOption = filtersOptions[index];
                    if(filtersOption.parent == changedFilterOptionId) {
                        filteredOptions.push(filtersOption.id);
                        options += '<option value="' + filtersOption.id +'">' + filtersOption.name + '</option>';
                    }
                }
    
                $('#' + filter.id).empty();
                $('#' + filter.id).append($(options));
                var prevSelectedOptionId = localStorage.getItem(filter.id);
                if(prevSelectedOptionId && filteredOptions.indexOf(prevSelectedOptionId) != -1) {
                    $('#'+filter.id).val(prevSelectedOptionId).trigger('change');
                }
            }
            
        } else if (filter.id == changedFilterId) {

            if(filter.type == 'DATA') {
                
                for (let index = 0; index < filtersOptions.length; index++) {
                    var filtersOption = filtersOptions[index];
                    if(filtersOption.id == changedFilterOptionId) {
                        if(filtersOption.data) {
                            loadData(filtersOption.data);
                        } else {
                            clearData();
                        }
                    }
                }

            } else if (filter.type == 'SECTION') {
                showSection();
            }
            
        } 
    }

}

function loadData(dataUrl, sectionUrl) {
    getUrlData('section', sectionUrl, function(key, result) {
        sections = result;
        sections = convertRowsToObj(sections);
        
        //sections = [ { id : 'default', state : 'active' } ];

        getUrlData('data', dataUrl, function(key, result) {
            widgets = result;
            widgets = convertRowsToObj(widgets);
            onDataLoaded();
        });
    });
}

function clearData() {
    $('.form-header .SECTION-filter').empty();
    $('.form-header .SECTION-filter').hide();
    $('#nav-content').empty();
}

function showSection() {
    var select = $(event.target);
    sectionId = select.val();
    $('#nav-content .active').removeClass('active');
    $("#nav-"+sectionId).addClass("active");
}