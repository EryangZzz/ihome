function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24);
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });

    $.ajax({
        url: '/order/booking_init/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var info = data.info
            var title = info.title
            var price = info.price
            var image = info.image

            $('#h_title').text(title)
            $('#h_price').text(price)
            i_path = '/static/media/' + image
            $('#h_image').attr('src', i_path)
        },
        error: function(data){
            alert('失败')
        }
    })
})


function submit_order(){
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sd = new Date(startDate);
    var ed = new Date(endDate);
    var days = (ed - sd)/(1000*3600*24);
    if(days > 0){
        $.ajax({
        url: '/order/submit_order/',
        type: 'POST',
        dataType: 'json',
        data: {'sd': startDate, 'ed': endDate, 'days': days},
        success: function(data){
            if(data.code == '200'){
                location.href = '/order/orders/'
            }else if(data.code == '601'){
                location.href = '/user/login/'
            }else if(data.code == '990'){
                alert(data.msg)
            }else{
                alert(data.msg)
            }
        },
        error: function(data){
            alert('失败')
        }
    })
    }else{
        alert('入住时长不能为0')
    }
}