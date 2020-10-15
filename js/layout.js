// var navs;
var sections;
var widgets;

var plotters = {};
var layouts = {};

var urlParams = new URLSearchParams(window.location.search);
var wd = urlParams.get('wd');
var br = urlParams.get('br');

function initNav() {

    // getSheetData(navSheetUrl, 1, function(result) {
    //     navs = result.data;
    //     buildNav(navs);
    // });

    if($(window).width() > 575) {
        if(config.nav == 'N' || wd) {            
            $('.menu-sidebar__content').remove();
            $('.menu-sidebar').css('bottom', 'auto');
            $('.page-container').css('padding-left', '0px');
        }
    } else {
        $('.navbar-mobile').css('background', 'white');
    }

    if(config.nav == 'N' || wd) {
        $('.hamburger').remove();
    }
    
}

function initHeader() {

    var headerDesktop = $('.header-desktop');
    var headerMobile = $('.header-mobile');
    var logo;

    if($(window).width() > 991) {

        headerMobile.remove();

        logo = $('.menu-sidebar .logo');
        logo.css('margin-left', '-35px');
        logo.css('border-right', '0px');
        logo.find('.icon').css('padding-right', '10px');
        
        if(config['headercolor']) {
            logo.css('color', config['headercolor']);
        }

        if(config['headerbackground']) {
            logo.css('background', config['headerbackground']);
            headerDesktop.css('background', config['headerbackground']);
        }

    } else {

        headerDesktop.remove();

        logo = $('.header-mobile .logo');
        logo.css('margin-top', '-7px');
        logo.css('margin-left', '-15px');

        if(config['headercolor']) {
            logo.css('color', config['headercolor']);
        }

        if(config['headerbackground']) {
            headerMobile.css('background', config['headerbackground']);
        }

    }

    if(config['logo']) {
        document.title = config['name'];
        $('#favicon').attr('href', config['logo']);
        logo.find('#logo-icon').attr('src', config['logo']);
        logo.append(config['name']);
    }

}

function initFooter() {
   
    var footer = $('.footer');

    if(config['footercolor']) {
        footer.css('color', config['footercolor']);
    }

    if(config['footerbackground']) {
        footer.css('background', config['footerbackground']);
    }

    var info = footer.find('#info');
    
    info.addClass('p-t-10');
    if($(window).width() < 991) { 
        info.addClass('p-l-10');
        footer.css('font-size', 'x-small');
    }

    var footerConfigs = config['footer'];
    if(footerConfigs) {
        footerConfigs = footerConfigs.split(',');
        for(var footerConfig of footerConfigs) {
            if(config[footerConfig]) {
                info.append($(getFooterInfo(footerConfig)));
            }     
        }
    }
}


function getFooterInfo(type) {
    switch (type) {
        case 'phone'    :   return '<div class="col-4 col-lg-2"><i class="fas fa-phone-volume">' +  config['phone'] + '</i></div>';
        //case 'phone'    :   return '<div class="col-4 col-lg-2"><i class="fas fa-phone-volume"><a style="color : inherit" href="tel:' +  config['phone'] + '">' +  config['phone'] + ' </a></i></div>';
        case 'email'    :   return '<div class="col-8 col-lg-4"><i class="fas fa-envelope">' + config['email'] + ' </i></div>';
        // case 'email'    :   return '<div class="col-8 col-lg-4"><i class="fas fa-envelope"><a style="color : inherit" href="mailto:' + config['email'] + '">' + config['email'] + ' </a></i></div>';
        case 'address'  :   return '<div class="col-12 col-lg-6"><i class="fas fa-address-card"></i> ' + config['address'].split(',').join(', ') + '</div>';
        case 'youtube'  :   return '<div class="col-4 col-lg-2"><i class="fas"><a style="color: inherit;text-decoration-line: underline;" target="_blank" href=" ' + config['youtube'] + '"> YouTube </a></i></div>';
        case 'facebook' :   return '<div class="col-4 col-lg-2"><i class="fas"><a style="color: inherit;text-decoration-line: underline;" target="_blank" href=" ' + config['facebook'] + '"> Facebook </a></i></div>';
    }
}

// function buildNav(navs) {
//     var navItems = '';
//     for (var id in navs) {
//         var nav = navs[id];
//         navItems +='<a class="js-arrow nav-item nav-link '+(nav.state || '')+'" id="nav-'+nav.id+'-tab" data-toggle="tab" href="#nav-'+nav.id+'" role="tab" aria-controls="nav-'+nav.id+'" aria-selected="false"><i class="fas '+nav.icon+' m-r-20"></i>'+nav.name + '</a>';
//     }
//     $('#nav-menu').empty();
//     $('#nav-menu').append($(navItems));
// }

function onDataLoaded() {

    //if(Object.keys(sections).length == 1) {
    //    initNav();
    //}

    if(wd && (widget = widgets[wd])) {
        document.title = widget.name;
        // Fix
        //initWidget(wd, widget, 12);
        plotWidget(wd, widget);
    } else {
        initLayout();
	}
}

function initLayout() {
    
    var nav = '';
    var content = '';
    var sectionOptions = '';

	for (var id in sections) {

        var section = sections[id];

        if(config.filter == 'Y') {
            var sectionSelected = section.state == 'active' ? 'selected' : '';
            sectionOptions += '<option value="' + section.id +'" ' + sectionSelected + '>' + section.name + '</option>';
        } else {
            nav +='<a class="js-arrow nav-item nav-link '+(section.state || '')+'" id="nav-' + section.id + '-tab" data-toggle="tab" href="#nav-' + section.id + '" role="tab" aria-controls="nav-' + section.id + '" aria-selected="false"><i class="fas ' + section.icon + ' m-r-20"></i>' + section.name + '</a>';
        }

		content += '<div class="row tab-pane fade '+ (section.state || '')+' show" id="nav-' + section.id + '" role="tabpanel" aria-labelledby="nav-' + section.id + '-tab">';
        content += '    <div class="nav-content-header col-lg-12">';
        content += '        <h1 class="title-1 m-t-5 m-l-5 m-r-5">' + (section.desc || section.name || '') + '</h1>';
        content += '    </div>';
        content += '    <div class="row nav-content-body col-lg-12 p-r-0">';
        content += '    </div>';
		content += '</div>';
    }
    
    if(config.filter == 'Y') {
        $('.form-header .SECTION-filter').empty();
        $('.form-header .SECTION-filter').append($(sectionOptions));
        $('.form-header .SECTION-filter').show();
    }

    if($(window).width() > 575) {
        $('#nav-tab').empty();
    	$('#nav-tab').append($(nav));
    } else {
        $('#nav-menu').empty();
        $('#nav-menu').append($(nav));
    }
	
    $('#nav-content').empty();
    $('#nav-content').append($(content));
    $('.nav-content-body').each(function(i, el) { new PerfectScrollbar(el); })
    
    for(var widgetId in widgets) {
        var widget = widgets[widgetId];
        if(!widget.section) {
            continue;
        }
        var size;
        if(widget.size) {
            size = widget.size;
        } else {
            if(config.nav == 'Y') {
                size = 4;
            } else {
                size = 3;
            }
        }

        var widgetLayout = getWidgetLayout(widgetId, widget, size);
        if(widgetLayout) {
            $('#nav-' + widget.section + ' .nav-content-body').append(widgetLayout);
        }
    }

    resizeContent();
        
};

function resizeContent() {
    var maxHeight =  $(window).height() - $('.nav-content-header').height() - 100;
    if(config.filter == 'Y') {
        maxHeight -= $('.form-header').outerHeight();
    }

    $('.nav-content-body').css('max-height', maxHeight + 'px');
}

$(window).resize(function() {
    resizeContent()
});

function initWidget(widgetId, widget) {
	var content = '';
	content += '<div class="row">';
	content += getWidgetLayout(widgetId, widget, 12)
	content += '</div>';
	$('#nav-content').append($(content));
}

function getWidgetLayout(widgetId, widget, size) {
	var layout = layouts[widget.type];
	if(layout) {
	    return window[layout](widgetId, widget, size);
	}
}

function plotWidget(widgetId, widget) {
    var plotter = plotters[widget.type];
    if(plotter) {
        eval(plotter)(widget);
    } else {
        console.log('No plotter registered for type : ' + widget.type);
    }
    
}

layouts['preview'] = 'getPreviewLayout';
layouts['video'] = 'getPreviewLayout';

function getPreviewLayout(id, preview, size) {
	var previewLayout = '';
	previewLayout += '<div class="col-lg-'+size+' m-t-10 p-r-0">';
	previewLayout += '	<div class="row m-l-5 m-r-5">';
	previewLayout += '		<div class="col-4 col-lg-12 card p-l-0 p-r-0">';
	previewLayout += '			<img class="img-thumbnail" src="' + preview.cover + '">';
    previewLayout += '		</div>';
	previewLayout += '		<div class="col-8 col-lg-12 card p-l-0 p-r-0">';
    previewLayout += '			<div class="card-body">';

    previewDetail = '			<h5 class="mb-1">' + preview.name;
	if(preview.link) {
        previewDetail += '			<button type="button" class="float-right fas fa-play" data-toggle="modal" data-target="#modalDialog" data-link="' + preview.link +'"></button>';
    }
    previewDetail += '          </h5>';
    
    if(preview.desc) {
    previewDetail += '			<p class="card-text">' + preview.desc + '</p>';
    }

    if(preview.detail) {
        previewLayout += '      <a href="../index.html?wd=' + preview.detail + '">' + previewDetail + '</a>';
    } else {
        previewLayout += previewDetail;
    }

	previewLayout += '			</div>';
    previewLayout += '		</div>';
    previewLayout += '	</div>';
    previewLayout += '</div>';

	return previewLayout;	
}

$('#modalDialog').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var link = button.data('link').replace('watch?v=','embed/');
  var title = button.parent().text().trim();
  var desc = button.parent().next().text().trim();

  var modal = $(this);
  
  modal.find('.modal-title').html(title);
  var footer = modal.find('.modal-footer');
  footer.empty();
  footer.css('justify-content', 'left');
  footer.html($('<p>' + desc + '</p>'));

  var video = '<iframe width="auto" src="' + link +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  modal.find('.modal-body').append(video);
});

$('#modalDialog').on('shown.bs.modal', function () {
    var modal = $(this);
    modal.find('iframe').width(modal.find('.modal-body').width());
});


$('#modalDialog').on('hide.bs.modal', function(){
        $(this).find('.modal-body').empty();
        //$(this).find('video').remove();
});
