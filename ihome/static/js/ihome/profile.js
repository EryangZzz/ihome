function hrefBack() {
    history.go(-1);
}

function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


//          实现上传图片
$('#form-avatar').submit(function(evt){
    evt.preventDefault;
    $(this).ajaxSubmit({
        url: '/user/profile/',
        type: 'PATCH',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                alert(data.msg)
            }
        },
        error: function(){
            alert('失败')
        }
    });
})

//          实现上传姓名
$('#form-name').submit(function(evt){
    evt.preventDefault;
    $(this).ajaxSubmit({
        url: '/user/profile/',
        type: 'PATCH',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                alert(data.msg)
            }
        },
        error: function(data){
            alert('失败')
        }
    });
})

//          实现初始化头像和姓名
$(function(){
    $.ajax({
        url: '/user/my_start/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            path = '/static/media/' + data.avatar
            $('#user-avatar').attr('src', path)

            $('#user-name').val(data.name)

        },
    })
})