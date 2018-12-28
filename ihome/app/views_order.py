"""__author__ = ErYang"""
from flask import Blueprint, render_template, jsonify, session, request
from sqlalchemy import and_, or_
from utils import status
from app.models import House, Area, Order, User
from datetime import datetime
from utils.functions import is_login

blue_order = Blueprint('order', __name__)


@blue_order.route('/booking/', methods=['GET'])
def book():
    return render_template('booking.html')


@blue_order.route('/booking_init/', methods=['GET'])
def booking_init():
    house_id = session.get('house_id')
    house = House.query.filter(House.id == house_id).first()
    info = house.to_dict()
    data = {'code': 200, 'info': info}
    return jsonify(data)


@blue_order.route('/submit_order/', methods=['POST'])
def submit_order():
    """提交订单"""
    # 获取数据
    user_id = session.get('user_id')
    if not user_id:
        return jsonify(status.NOT_LOGIN)
    house_id = session.get('house_id')
    sd = request.form.get('sd')
    ed = request.form.get('ed')

    house = House.query.filter(House.id == house_id).first()
    price = house.price
    days = int(request.form.get('days'))
    if not days >= house.min_days:
        return jsonify(status.SORT_TIME)
    max_days = house.max_days if house.max_days else 99999
    if not days <= max_days:
        return jsonify(status.LONG_TIME)
    sd = datetime.strptime(sd, '%Y-%m-%d')
    ed = datetime.strptime(ed, '%Y-%m-%d')

    # 拿到所有订单判断时间段
    orders = Order.query.filter(and_(Order.house_id == house_id,
                                     Order.status.in_(['WAIT_PAYMENT',
                                                       'PAID',
                                                       'WAIT_COMMENT'])))
    for order in orders:
        if ((order.begin_date <= sd) and (sd < order.end_date)) or \
                ((order.begin_date < ed) and (ed < order.end_date)):
            return jsonify({'code': 990, 'msg': '此时间段已被预订'})

    amount = price * days

    order = Order()
    order.user_id = user_id
    order.house_id = house_id
    order.begin_date = sd
    order.end_date = ed
    order.days = days
    order.house_price = price
    order.amount = amount
    order.add_update()
    return jsonify(status.SUCCESS)


@blue_order.route('/orders/', methods=['GET'])
@is_login
def orders():
    return render_template('orders.html')


@blue_order.route('/orders_init/', methods=['GET'])
@is_login
def orders_init():
    user_id = session.get('user_id')
    orders = Order.query.filter(Order.user_id == user_id)
    if orders:
        order_info = []
        for order in orders:
            info = order.to_dict()
            order_info.append(info)
        data = {'code': 200, 'order_info': order_info}
        return jsonify(data)
    data = {status.NO_ORDER}
    return jsonify(data)


@blue_order.route('/cancel/', methods=['PATCH'])
def cancel():
    comment = request.form.get('comment')
    order_id = int(request.form.get('order_id'))
    order = Order.query.filter(Order.id == order_id).first()
    if order.status == 'WAIT_ACCEPT':
        order.status = 'CANCELED'
        order.comment = comment
        order.add_update()
        return jsonify(status.SUCCESS)
    else:
        order.status = 'COMPLETE'
        order.comment = comment
        order.add_update()
        return jsonify(status.SUCCESS)


@blue_order.route('/lorders/', methods=['GET'])
@is_login
def lorders():
    return render_template('lorders.html')


@blue_order.route('/lorders_init/', methods=['GET'])
@is_login
def lorders_init():
    user_id = session.get('user_id')
    houses = House.query.filter(House.user_id == user_id)
    house_ids = [house.id for house in houses]

    orders = Order.query.filter(Order.house_id.in_(house_ids)).all()
    if not orders:
        return jsonify(status.NO_ORDER)

    order_list = []
    for order in orders:
        info = order.to_dict()
        order_list.append(info)
    data = {'code': 200, 'order_info': order_list}
    return jsonify(data)


@blue_order.route('/sure/', methods=['PATCH'])
def sure():
    order_id = int(request.form.get('order_id'))
    order = Order.query.filter(Order.id == order_id).first()
    order.status = 'WAIT_PAYMENT'
    # 改变房间订单次数
    house = order.house
    house.order_count += 1
    house.is_ordered = 1
    order.add_update()
    house.add_update()
    return jsonify(status.SUCCESS)


@blue_order.route('/reject/', methods=['PATCH'])
def reject():
    order_id = int(request.form.get('order_id'))
    comment = request.form.get('comment')

    order = Order.query.filter(Order.id == order_id).first()
    order.status = 'REJECTED'
    order.comment = comment
    order.add_update()
    return jsonify(status.SUCCESS)


@blue_order.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')


@blue_order.route('/index_init/', methods=['GET'])
def index_init():
    """
    判断登录状态显示index右上角文字
    数据封装格式：
    [{'id': 19, 'title': '召唤师峡谷', 'image': 'home01.jpg',
    'area': '锦江区', 'price': 50, 'create_time': '2018-12-25 16:54:57',
    'room': 3, 'order_count': 0, 'address': '007号'},
    {'id': 20, 'title': 'Erangel', 'image': 'home02.jpg',
    'area': '金牛区', 'price': 30, 'create_time': '2018-12-25 17:44:11',
    'room': 1, 'order_count': 0, 'address': '十号'}]
    """
    houses = House.query.all()
    list_info = []
    for house in houses:
        info = house.to_dict()
        list_info.append(info)

    areas = Area.query.all()
    area_l = []
    for area in areas:
        info_a = area.to_dict()
        area_l.append(info_a)

    user_id = session.get('user_id')
    if user_id:
        name = User.query.filter(User.id == user_id).first().name
        data = {'code': 200, 'house_info': list_info, 'area_info': area_l, 'name': name}
        return jsonify(data)
    data = {'code': 701, 'house_info': list_info, 'area_info': area_l}
    return jsonify(data)


@blue_order.route('/search/', methods=['GET'])
def search():
    return render_template('search.html')


@blue_order.route('/get_area/', methods=['GET'])
def get_area():
    areas = Area.query.all()
    area_l = []
    for area in areas:
        info = area.to_dict()
        area_l.append(info)
    return jsonify({'code': 200, 'area_info': area_l})


@blue_order.route('/render_house/', methods=['POST'])
def render_house():
    area_id = request.form.get('area_id')
    sk = request.form.get('sk', 'new')
    sd = request.form.get('sd')
    ed = request.form.get('ed')
    if ed and sd:
        d1 = datetime.strptime(ed, '%Y-%m-%d')
        d2 = datetime.strptime(sd, '%Y-%m-%d')
        delta = d1 - d2
        live_time = delta.days

    # 所有房屋
    if not area_id and not all([sd, ed]):
        houses = House.query.all()
        # 所有订单不符合的订单
        # orders = Order.query.filter(Order.status.in_(['WAIT_PAYMENT', 'PAID', 'WAIT_COMMENT']))
        orders = []

    elif area_id and not all([sd, ed]):
        houses = House.query.filter(House.area_id == area_id)
        orders = []
    elif not area_id and all([sd, ed]):
        houses = House.query.all()
        orders = Order.query.filter(and_(or_(and_(Order.begin_date <= d1, d1 < Order.end_date),
                                             and_(Order.begin_date < d2, d2 <= Order.end_date)),
                                         Order.status.in_(['WAIT_PAYMENT', 'PAID', 'WAIT_COMMENT'])))
    else:
        houses = House.query.filter(and_(House.area_id == area_id,
                                         House.min_days <= live_time,
                                         or_(House.max_days == 0,
                                             House.max_days >= live_time)))
        # 所有订单不符合的订单
        orders = Order.query.filter(and_(or_(and_(Order.begin_date <= d1, d1 < Order.end_date),
                                             and_(Order.begin_date < d2, d2 <= Order.end_date)),
                                         Order.status.in_(['WAIT_PAYMENT', 'PAID', 'WAIT_COMMENT'])))
    houses_id_s = [house.id for house in houses]

    houses_id = [order.house_id for order in orders]
    new_house_id = list(set(houses_id_s) - set(houses_id))

    if sk == 'new':
        houses = House.query.filter(House.id.in_(new_house_id)).order_by('-create_time')
    elif sk == 'booking':
        houses = House.query.filter(House.id.in_(new_house_id)).order_by('-order_count')
    elif sk == 'price-inc':
        houses = House.query.filter(House.id.in_(new_house_id)).order_by('price')
    elif sk == 'price-des':
        houses = House.query.filter(House.id.in_(new_house_id)).order_by('-price')

    if not houses:
        return jsonify(status.NO_RESULT)

    house_l = []
    for house in houses:
        info = house.to_full_dict()
        house_l.append(info)
    return jsonify({'code': 200, 'house_info': house_l})


