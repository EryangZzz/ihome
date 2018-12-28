function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

//$(document).ready(carousel())

function carousel(){
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    })
    $(".book-house").show();
}

$(function(){
    $.ajax({
        url: '/house/detail_init/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var images = data.info.images
            var price = data.info.price
            var title = data.info.title
            var owner = data.info.user_name
            var avatar = data.info.user_avatar
            var path = '/static/media/' + avatar
            var address = data.info.address
            var nums = '出租' + data.info.room_count + '间'
            var area = '房间面积: ' + data.info.acreage + '平米'
            var unit = '房间户型: ' + data.info.unit
            var capacity = '宜住' + data.info.capacity + '人'
            var beds = data.info.beds
            var deposit = '￥' + data.info.deposit
            var min_days = data.info.min_days
            var max_days = data.info.max_days
            if(!max_days){
                max_days = '无限制'
            }
            var facilities = data.info.facilities

            <!--渲染轮播图-->
            for(var i=0; i<images.length; i+=1){
                var path = '/static/media/' + images[i]
                var li_str = '<li class="swiper-slide"><img src="' + path + '"></li>'
                $('#images').append(li_str)
            }

            <!--渲染页面数据-->
            $('#house_price').text(price)
            $('.house-title').text(title)
            $('.landlord-pic img').attr('src', path)
            $('#house_owner').text(owner)
            $('#address').text(address)
            $('#nums').text(nums)
            $('#area').text(area)
            $('#unit').text(unit)
            $('#capacity').text(capacity)
            $('#beds').text(beds)
            $('#deposit').text(deposit)
            $('#min_days').text(min_days)
            $('#max_days').text(max_days)

            <!--facilities循环添加-->
            for(var i=0; i<facilities.length; i+=1){
                var facility_str = '<li><span class="' + facilities[i].css
                    facility_str += '"></span>' + facilities[i].name + '</li>'
                $('#facilities').append(facility_str)
                $('#book').attr('href', '/order/booking/')
            }

            var is_ordered = data.info.is_ordered
            var orders = data.order
            if(is_ordered){
                var text_str = ''
                for(var i=0; i<orders.length; i+=1){
                    text_str += orders[i].begin_date + ' - ' + orders[i].end_date + '&emsp;&emsp;'
                }
                text_str += '时间段已被预定&emsp;&emsp;&emsp;&emsp;立即预订'
                $('#book').html(text_str)
            }
            carousel()
        },
        error: function(){
            alert('失败')
        }
        })
    })
<!--<li><span class="washer-ico"></span>洗衣机</li>-->


$(function(){
    $.ajax({
        url: '/house/is_owner/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                $('#book').attr('style', 'display: none')
            }
        },
        error: function(data){
            alert('失败')
        }
    })
})

