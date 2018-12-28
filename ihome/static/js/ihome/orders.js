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

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });

//    页面初始化
    $.ajax({
        url: '/order/orders_init/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                var orders = data.order_info
                for(var i=0; i<orders.length; i+=1){
                    var order_str = '<li order-id="' + orders[i].order_id + '"><div class="order-title"><h3>订单编号：'
                        order_str += orders[i].order_id + '</h3><div class="fr order-operate">'

                        if(orders[i].status == 'WAIT_COMMENT' || orders[i].status == 'COMPLETE'){
                            order_str += '<button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>'
                        }else{
                            order_str += '<button type="button" style="display: none" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>'
                        }
                        if(orders[i].status == 'WAIT_ACCEPT'){
                            order_str += '<button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">取消订单</button>'
                        }
                        order_str += '</div></div><div class="order-content"><img src="/static/media/'
                        order_str += orders[i].image + '"><div class="order-text"><h3>' + orders[i].house_title + '</h3><ul>'
                        order_str += '<li>创建时间：' + orders[i].create_date + '</li><li>入住日期：'
                        order_str += orders[i].begin_date + '</li><li>离开日期：'
                        order_str += orders[i].end_date + '</li><li>合计金额：'
                        order_str += orders[i].amount + '元(共' + orders[i].days + '晚)</li><li>订单状态：<span>'
                        order_str += orders[i].status + '</span></li>'
                        if(orders[i].status == 'REJECTED'){
                            order_str += '<li>拒单原因：' + orders[i].comment +'</li>'
                        }else if(orders[i].status == 'WAIT_COMMENT' || orders[i].status == 'COMPLETE'){
                            order_str += '<li>我的评价：' + orders[i].comment + '</li>'
                        }else if(orders[i].status == 'CANCELED'){
                            order_str += '<li>取消原因： ' + orders[i].comment + '</li>'
                        }
                        order_str += '</ul></div></div></li>'

                        $('#order_list').append(order_str)
                }

                $(".order-comment").on("click", function(){
                var orderId = $(this).parents("li").attr("order-id");
                $(".modal-comment").attr("order-id", orderId);
            });
            }else{
                alert(data.msg)
            }
        },
        error: function(data){
            alert('失败')
        }
    })
});

$('#cancel_sure').on('click', function(){
    var order_id = $('#cancel_sure').attr('order-id')
    var comment = $('#comment').val()
    if(comment){
        $.ajax({
            url: '/order/cancel/',
            type: 'PATCH',
            dataType: 'json',
            data: {'order_id': order_id, 'comment': comment},
            success: function(data){
                if(data.code == '200'){
                location.href = '/order/orders/'
                }
            },
            error: function(data){
                alert('失败')
            }
        })
    }else{
        alert('取消理由必填')
    }
})