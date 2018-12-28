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



$('#form-auth').submit(function(){
    var name = $('#real-name').val();
    var id_card = $('#id-card').val();
    $.ajax({
        url: '/user/certification/',
        type: 'PATCH',
        dataType: 'json',
        data: {'name': name, 'id_card': id_card},
        success: function(data){
            if(data.code == '403'){
                alert(data.msg)
            }
        },
        error: function(){
            alert('失败')
        }
    })
})

$(function(){
    $.ajax({
        url: '/user/certification/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                $('#real-name').val(data.real_name).attr('disabled', 'disabled')
                $('#id-card').val(data.card_id).attr('disabled', 'disabled')
                $('#save').attr('style', 'display: none')
            }
        },
        error: function(data){
        }
    })
})

