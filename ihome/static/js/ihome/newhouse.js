function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url: '/house/new_house_init/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var areas = data.areas
            for(var i=0; i<areas.length; i+=1){
                var option_str = '<option value="' + areas[i].id + '">'
                    option_str += areas[i].name + '</option>'
                    $('#area-id').append(option_str)
            }
        },
        error: function(data){
            alert('失败')
        }
    })
})

$('#form-house-info').submit(function(evt){
    evt.preventDefault();
    $(this).ajaxSubmit({
        url: '/house/new_house/',
        type: 'POST',
        dataType: 'json',
        success: function(data){
            if(data.code == '500'){
                alert(data.msg)
                $('#form-house-info').hide()
                $('#form-house-image').attr('style', 'display: block')
                $('#house-id').val(data.house_id)
            }
        },
        error: function(data){
            alert(data.msg)
        }
    })
})

$('#form-house-image').submit(function(evt){
    evt.preventDefault();
    $(this).ajaxSubmit({
        url: '/house/new_house/',
        type: 'PATCH',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                path = '/static/media/' + data.url
                $('#image_div').append(
                $('<img>').attr('src', path))
            }else if(data.code == '501'){
                alert(data.msg)
            }
        },
        error: function(data){
            alert(data.msg)
        }
    })
})