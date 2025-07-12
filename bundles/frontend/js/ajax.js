function xhr(url, method = 'GET', data = {})
{
    return $.ajax({
        url: url,
        type: method,
        dataType: 'json',
        data:  data,
        beforeSend: function () { $("body").css("cursor", "progress"); }
    })
        .always(function () { $("body").css("cursor", "default"); });
}

function xhrSync(url, method = 'GET', data = {})
{
    return $.ajax({
        url: url,
        type: method,
        dataType: 'json',
        data: data,
        async: false,
        beforeSend: function () { $("body").css("cursor", "progress"); }
    })
        .always(function () { $("body").css("cursor", "default"); });
}