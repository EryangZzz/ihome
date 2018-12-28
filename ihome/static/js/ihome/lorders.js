function hrefBack() {
    history.go(-1);
}

//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(start_f());

function start_f(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });
}

//          页面初始化
$(function(){
    $.ajax({
        url: '/order/lorders_init/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                var orders = data.order_info
                for(var i=0; i<orders.length; i+=1){
                    var order_str = '<li order-id="' + orders[i].order_id + '">'
                    order_str += '<div class="order-title"><h3>订单编号：'
                    order_str += orders[i].order_id + '</h3><div class="fr order-operate">'
                    if(orders[i].status == 'WAIT_ACCEPT'){
                        order_str += '<button type="button" class="btn btn-success order-accept" id="sure_btn" data-toggle="modal" data-target="#accept-modal">接单</button>'
                    order_str += '<button type="button" class="btn btn-danger order-reject" id="reject_btn" data-toggle="modal" data-target="#reject-modal">拒单</button>'
                    }
                    order_str += '</div></div><div class="order-content"><img src="/static/media/'
                    order_str += orders[i].image + '"><div class="order-text"><h3>'
                    order_str += orders[i].house_title + '</h3><ul><li>创建时间：'
                    order_str += orders[i].create_date + '</li><li>入住日期：'
                    order_str += orders[i].begin_date + '</li><li>离开日期：'
                    order_str += orders[i].end_date + '</li><li>合计金额：￥'
                    order_str += orders[i].amount + '(共' + orders[i].days + '晚)</li>'
                    order_str += '<li>订单状态：<span>' + orders[i].status + '</span></li>'
                    if(orders[i].status == 'CANCELED'){
                        order_str += '<li>取消原因： ' + orders[i].comment + '</li>'
                    }else if(orders[i].status == 'REJECTED'){
                        order_str += '<li>拒绝原因： ' + orders[i].comment + '</li>'
                    }else if(orders[i].status == 'WAIT_COMMENT' || orders[i].status == 'COMPLETE'){
                        order_str += '<li>客户评价： ' + orders[i].comment + '</li>'
                    }
                    order_str += '</ul></div></div></li>'

                    $('#order_list').append(order_str)
                }
            }
            start_f()
        },
        error: function(data){
            alert('失败')
        }
    })
});



$('#sure').on('click', function(){
    var order_id = $('#sure').attr('order-id')
    $.ajax({
        url: '/order/sure/',
        type: 'PATCH',
        dataType: 'json',
        data: {'order_id': order_id},
        success: function(data){
            if(data.code == '200'){
                $('#sure_btn').attr('style', 'display: none')
                $('#reject_btn').attr('style', 'display: none')
                location.href = '/order/lorders/'
            }
        },
        error: function(data){
            alert('失败')
        }
    })
})


$('#reject_sure').on('click', function(){
    var order_id = $('#reject_sure').attr('order-id')
    var comment = $('#reject-reason').val()
    if(comment){
        $.ajax({
        url: '/order/reject/',
        dataType: 'json',
        type: 'PATCH',
        data: {'comment': comment, 'order_id': order_id},
        success: function(data){
            if(data.code == '200'){
                $('#sure_btn').attr('style', 'display: none')
                $('#reject_btn').attr('style', 'display: none')
            }
            location.href = '/order/lorders/'
        },
        error: function(data){
            alert('失败')
        }
    })
    }else{
        alert('必须填写拒绝原因')
    }
})
