function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
    });
    $(".form-login").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();
        if (!mobile) {
            $("#mobile-err span").html("请填写正确的手机号！");
            $("#mobile-err").show();
            return;
        } 
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }
    });
})


$('#form_login').submit(function(evt){
    evt.preventDefault;
    var mobile = $('#mobile').val();
    var password = $('#password').val();
    $.ajax({
        url: '/user/login/',
        type: 'POST',
        dataType: 'json',
        data: {'mobile': mobile,
               'password': password},
        success: function(data){
            if(data.code == '200'){
                location.href = '/order/index/'
            }else if(data.code == '201'){
                alert(data.msg)
            }else if(data.code == '202'){
                alert(data.msg)
            }
        },
        error: function(data){
            alert('失败')
        }
    });
})