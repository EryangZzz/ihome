
function logout() {
    $.ajax({
        url: '/user/logout/',
        dataType: 'json',
        type: 'DELETE',
        success: function(data){
            if(data.code == '203'){
                location.href = '/user/login/'
                alert(data.msg)

            }
        },
        error: function(){
            alert('退出失败')
        }
    })
}

$(document).ready(function(){
})


//              初始化页面头像和个人信息
$(function(){

    $.ajax({
        url: '/user/my_start/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            path = '/static/media/' + data.avatar
            $('#user-name').text(data.name)
            $('#user-mobile').text(data.phone)
            if(data.avatar){
                $('#user-avatar').attr('src', path)
            }

        },
        error: function(){
            alert('失败')
        }
    })
})