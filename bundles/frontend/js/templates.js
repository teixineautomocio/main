$(document).ready(function () {
    /*----- Select triggers -----*/
    $("select[id$='_make']").on('change', function () { makeSelectTrigger(this); });
    $("select[id$='_model']").on('change', function () { modelSelectTrigger(this); });

    /*----- Input triggers -----*/
    $("input[id$='_file']").bind('change', function () { fileInputTrigger(this); })
});

function makeSelectTrigger(obj) {
    const idMake = $(obj).val();

    if (idMake === 0) {
        return false;
    }

    let model = $("select[id$='_model']");
    model.html('<option value="0">---</option>');
    getCarInfo(generateCarAjaxUrl(), 'make', idMake, model);
    $('#hdnModel').val('');
}

function modelSelectTrigger(obj) {
    const idModel = $(obj).val();

    if (idModel === 0) {
        return false;
    }

    let range = $("select[id$='_range']");
    range.html('<option value="0">---</option>');
    getCarInfo(generateCarAjaxUrl(), 'model', idModel, range);
}

function fileInputTrigger(obj) {
    const file = $(obj);

    if (!isSizeValid(document.getElementById(file.attr('id')).files[0].size, file.data('mbMaxFileSize'))) {
        file.val('');
    }
}

$('#usedCarsSortType_sort').change(function () {
    getApplyFiltersAndSort(carApplyFilterAjaxUrl());
});

function getCarInfo(url, type, value, destination) {
    let data = { 'type': type, 'value': value };

    xhr(url, 'POST', data)
        .done(function (data) {
            $(data).each(function(i, item) {
                $(destination).append('<option value="' + item.id + '">' + item.name + '</option>');
            })
        })
        .fail(function () {
            console.log(Translator.trans('F.Error.filtering_vehicle_types'));
        });
}

function clearVehiclesList() {
    $('#vehicles-list').empty();
}

$('#usedCarsSearchType_vehicle_brand').change(function() {
    $('#usedCarsSearchType_vehicle_model').html('<option value="0">---</option>');
    getCarInfo(generateCarAjaxUrl(), $(this).attr('id'), $(this).val(), '#usedCarsSearchType_vehicle_model');
});

$('#btn_apply_filters').click(function() {
    getApplyFiltersAndSort(carApplyFilterAjaxUrl());
});

$('#usedCarsSearchType').on('submit', function(event) {
    event.preventDefault();
    getApplyFiltersAndSort(carApplyFilterAjaxUrl());
});

function getApplyFiltersAndSort(url) {
    const dataString = {
        fromPrice: $("#usedCarsSearchType_fromPrice").val(),
        toPrice: $("#usedCarsSearchType_toPrice").val(),
        fromPW: $("#usedCarsSearchType_fromPW").val(),
        toPW: $("#usedCarsSearchType_toPW").val(),
        fromCC: $("#usedCarsSearchType_fromCC").val(),
        toCC: $("#usedCarsSearchType_toCC").val(),
        fromKm: $("#usedCarsSearchType_fromKm").val(),
        toKm: $("#usedCarsSearchType_toKm").val(),
        toYear: $("#usedCarsSearchType_fromYear").val(),
        fromYear: $("#usedCarsSearchType_toYear").val(),
        brand: $("#usedCarsSearchType_vehicle_make").val(),
        model: $("#usedCarsSearchType_vehicle_model").val(),
        engineType: $("#usedCarsSearchType_engineType").val(),
        hasCategory: $("#usedCarsSearchType_hasCategory").val(),
        keyWord: $("#usedCarsSearchType_keyWord").val(),
        sortOrder: $("#usedCarsSortType_sort").val()
    };
    const data = { data: JSON.stringify(dataString) };
    const emptyVehicleList = $('#vehicles-list').empty();

    emptyVehicleList.append(cursorLoading());
    xhr(url, 'POST', data)
        .done(function (data) {
            let html = '';
            $.each(data, function (key, value) {
                $.each(value, function (id, obj) {
                    let vehicle_url = generateUsedCarAjaxUrl(obj['id']);
                    let print_image_url =generatePrintImageUrl(obj['imageId']);
                    html += usedCarHTMLContent(obj, vehicle_url, print_image_url);
                });
            });
            emptyVehicleList.append(html);
        })
        .fail(function () {
            console.log(Translator.trans('F.Error.filtering_vehicle_types'));
        })
        .always(function () {
            $('#vehicles-list .spinner-border').remove();
        });
}

function usedCarHTMLContent(obj, vehicle_url, print_image_url) {
    let html = '<div class="col-12 col-sm-6 col-md-3 d-flex flex-column mb-5">' +
        '<a class="mb-4" href=' + vehicle_url + ' target="_self" title=""> ' +
        '<div class="img-gallery"> ' +
        '<img class="" src=' + print_image_url + ' alt="" title=""> ' +
        '<div class="row"> ' +
        '<div class="col-12"><h3>' + obj['title'] + '</h3></div>' +
        '<div class="col-12"> ' +
        '<table class="table table-striped table-gallery"> ' +
        '<tbody> ' +
        '<tr> ' +
        '<td>' + Translator.trans('F.Year') + '</td> ' +
        '<td>' + obj['year'] + '</td> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>' + Translator.trans('F.Mileage.with.unit') + '</td> ' +
        '<td>' + obj['km'] + '</td> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>' + Translator.trans('F.DisplacementCC') + '</td> ' +
        '<td>' + obj['displacement'] + '</td> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>' + Translator.trans('F.Engine power') + '</td> ' +
        '<td>' + obj['power'] + '</td> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>' + Translator.trans('F.Fuel type') + '</td> ' +
        '<td>' + obj['fuel'] + '</td> ' +
        '</tr> ' +
        '<tr> ' +
        '<td>' + Translator.trans('F.WarrantyMonths') + '</td> ' +
        '<td>' + obj['warranty'] + '</td> ' +
        '</tr> ' +
        '</tbody> ' +
        '</table> ' +
        '</div> ' +
        '<div class="col-12"><p class="price-gallery">' + obj['price'] + ' ' + obj['currency'] + '</p></div> ' +
        '</div> ' +
        '</div> ' +
        '</a> ' +
        '<a class="btn-all mt-auto" href=' + vehicle_url + ' target="_self" title="">' + Translator.trans('F.More_info') + '</a> ' +
        '</div> ';

    return html;
}

function cursorLoading() {
    return '<div class="d-flex justify-content-center"><div class="spinner-border" role="status"> ' +
        '<span class="visually-hidden">Loading...</span></div></div>';
}

function generateCarAjaxUrl() {
    return $('#hdnSiteType').val() === 'subdomain'
        ? Routing.generate('car_info_ajax_sub', { 'subdomain': $('#hdnSiteHost').val() })
        : Routing.generate('car_info_ajax', { 'domain': $('#hdnSiteHost').val() });
}

function carApplyFilterAjaxUrl() {
    return $('#hdnSiteType').val() === 'subdomain'
        ? Routing.generate('apply_filters_usedCar_ajax_sub', { 'subdomain': $('#hdnSiteHost').val() })
        : Routing.generate('apply_filters_usedCar_ajax', { 'domain': $('#hdnSiteHost').val() });
}

function generateUsedCarAjaxUrl(carId) {
    return $('#hdnSiteType').val() === 'subdomain'
        ? Routing.generate('usedCar_sub', { 'subdomain': $('#hdnSiteHost').val(), 'id': carId })
        : Routing.generate('usedCar', { 'domain': $('#hdnSiteHost').val(), 'id': carId });
}

function generatePrintImageUrl(imageId) {
    return $('#hdnSiteType').val() === 'subdomain'
        ? Routing.generate('print_image_sub', { 'subdomain': $('#hdnSiteHost').val(), 'id': imageId })
        : Routing.generate('print_image', { 'domain': $('#hdnSiteHost').val(), 'id': imageId });
}

function generateGDPRUrl(topic) {
    return Routing.generate('gdpr', {  'domain': window.location.hostname, 'topic': topic });
}

function reloadCaptcha() {
    const img = document.getElementById('captcha_image');
    img.src = img.attributes['data-captcha-code'].value + '?n=' + (new Date()).getTime();
}

function resetUsedCarsSearchFilters() {
    $("#usedCarsSearchType_hasCategory").val('');
    $("#usedCarsSearchType_fromPrice").val('');
    $("#usedCarsSearchType_toPrice").val('');
    $("#usedCarsSearchType_fromPW").val('');
    $("#usedCarsSearchType_toPW").val('');
    $("#usedCarsSearchType_fromCC").val('');
    $("#usedCarsSearchType_toCC").val('');
    $("#usedCarsSearchType_fromKm").val('');
    $("#usedCarsSearchType_toKm").val('');
    $("#usedCarsSearchType_fromYear").val('');
    $("#usedCarsSearchType_toYear").val('');
    $("#usedCarsSearchType_vehicle_make").val('');
    $("#usedCarsSearchType_vehicle_model").val('');
    $("#usedCarsSearchType_engineType").val('');
    $("#usedCarsSearchType_keyWord").val('');
}