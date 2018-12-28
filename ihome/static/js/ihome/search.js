function hrefBack() {
    history.go(-1);
}

var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

get_area()
function get_area(){
    var data = decodeQuery()
    var area_id = data.aid
    $.ajax({
        url: '/order/get_area/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var areas = data.area_info
            for(var i=0; i<areas.length; i+=1){
                var area_str = '<li area-id="' + areas[i].id + '" '
                if(areas[i].id == area_id){
                    area_str += 'class="active"'
                }
                area_str += '>' + areas[i].name + '</li>'
                $('#area_list').append(area_str)
            }
        },
        error: function(){
            alert('失败')
        }
    })
}


render_house()
function render_house(){
    var result = decodeQuery();
    var area_id = result.aid;
    var name = result.aname;
    var sd = result.sd;
    var ed = result.ed;
    var sk = result.sk;

    $.ajax({
        url: '/order/render_house/',
        type: 'POST',
        dataType: 'json',
        data: {'area_id': area_id, 'name': name, 'sd': sd, 'ed': ed, 'sk': sk},
        success: function(data){
            if(data.code == '701'){
                alert(data.msg)
            }else if(data.code == '200'){
                var houses = data.house_info
                for(var i=0; i<houses.length; i+=1){
                    path_d = '/house/detail/'
                    path_m = '/static/media/' + houses[i].images[0]
                    avatar = '/static/media/' + houses[i].user_avatar
                    var house_str = '<li class="house-item"><a href="' + path_d + houses[i].id
                    house_str += '"><img src="' + path_m + '"></a><div class="house-desc">'
                    house_str += '<div class="landlord-pic"><img src="' + avatar + '"></div>'
                    house_str += '<div class="house-price">￥<span>' + houses[i].price + '</span>/晚</div>'
                    house_str += '<div class="house-intro"><span class="house-title">'
                    house_str += houses[i].title + '</span><em>出租' + houses[i].room_count
                    house_str += '6间 - ' + houses[i].order_count + '次入住 - '
                    house_str += houses[i].address + '</em></div></div></li>'
                    $('#house_list').append(house_str)
                }
            }
        },
        error: function(){
            alert('失败')
        }
    })
}


// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }
}


// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        area_id:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
    };
    //发起ajax请求，获取数据，并显示在模板中

    $.ajax({
        url: '/order/render_house/',
        type: 'POST',
        dataType: 'json',
        data: {'area_id': areaId, 'sd': startDate, 'ed': endDate, 'sk': sortKey},
        success: function(data){
            $('#house_list').empty()
            if(data.code == '701'){
                alert(data.msg)
            }else if(data.code == '200'){
                var houses = data.house_info
                for(var i=0; i<houses.length; i+=1){
                    path_d = '/house/detail/'
                    path_m = '/static/media/' + houses[i].images[0]
                    avatar = '/static/media/' + houses[i].user_avatar
                    var house_str = '<li class="house-item"><a href="' + path_d + houses[i].id
                    house_str += '"><img src="' + path_m + '"></a><div class="house-desc">'
                    house_str += '<div class="landlord-pic"><img src="' + avatar + '"></div>'
                    house_str += '<div class="house-price">￥<span>' + houses[i].price + '</span>/晚</div>'
                    house_str += '<div class="house-intro"><span class="house-title">'
                    house_str += houses[i].title + '</span><em>出租' + houses[i].room_count
                    house_str += '6间 - ' + houses[i].order_count + '次入住 - '
                    house_str += houses[i].address + '</em></div></div></li>'
                    $('#house_list').append(house_str)
                }
            }
        },
        error: function(){
            alert('失败')
        }
    })
}


$(document).ready(start_func)
function start_func(){
    var queryData = decodeQuery();
    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();
        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
        }
    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");

    });
    $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());
        } else {
            $(this).removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
        }
    });
    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
        }
    })
}