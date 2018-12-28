function hrefBack() {
    history.go(-1);
}

$(document).ready(function(){
    $(".auth-warn").show();
})


//                  判断认证
$(function(){
    $.ajax({
        url: '/house/is_auth/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var houses_list = $('#houses-list');
            var houses_auth = $('#houses_auth');

            if(data.code == '404'){
                $('#houses-list').attr('style', 'display: none')
            }else if(data.code == '405'){
                $('#houses_auth').hide()
            }
        },
        error: function(data){}
    })
})


//                  加载房源信息
$(function(){
    $.ajax({
        url: '/house/show_houses/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var houses = data.houses
            console.log(houses.length)
            console.log(houses[0])
            console.log(typeof(houses[0].id))
            for(var i=0; i< houses.length; i+=1){

                var house_str = '<li><a href="/house/detail/' + houses[i].id + '">'
                    house_str += '<div class="house-title"><h3>'
                    house_str += '房屋ID:' + houses[i].id + ' —— ' + houses[i].title
                    house_str += '</h3></div><div class="house-content"><img src="/static/media/'
                    house_str += houses[i].image + '"><div class="house-text"><ul>'
                    house_str += '<li>位于：' + houses[i].area + '</li>'
                    house_str += '<li>价格：￥' + houses[i].price + '/晚</li>'
                    house_str += '<li>发布时间：' + houses[i].create_time + '</li>'

                $('#houses-list').append(house_str)
            }
        },
        error: function(data){
            alert(成功)
        }
    })
})