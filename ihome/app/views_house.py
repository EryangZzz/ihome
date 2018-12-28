"""__author__ = ErYang"""
from flask import Blueprint, render_template, jsonify, session, request
from utils.functions import is_login
from app.models import User, House, HouseImage, Facility, Area, Order
from utils import status
from sqlalchemy import and_
import os
from utils.settings import MEDIA_PATH


blue_house = Blueprint('house', __name__)


@blue_house.route('/myhouse/', methods=['GET'])
@is_login
def my_house():
    """返回我的房源页面"""
    return render_template('myhouse.html')


@blue_house.route('/is_auth/', methods=['GET'])
@is_login
def is_auth():
    """获取当前用户，判断是否进行实名验证，认证则可以发布房源"""
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    # 判断是否认证
    id_name = user.id_name
    id_card = user.id_card
    if not all([id_name, id_card]):
        return jsonify(status.NOT_AUTH)
    return jsonify(status.FINISHED_AUTH)


@blue_house.route('/new_house/', methods=['GET'])
@is_login
def new_house():
    return render_template('newhouse.html')


@blue_house.route('/new_house_init/', methods=['GET'])
@is_login
def new_house_init():
    areas = Area.query.all()
    areas_l = []
    for area in areas:
        info = area.to_dict()
        areas_l.append(info)
    data = {'code': 200, 'areas': areas_l}
    return jsonify(data)


@blue_house.route('/new_house/', methods=['POST', 'PATCH'])
@is_login
def new_house_p():
    """
    新房源创建 - 房间信息、图片、基础设置
    需要用到house、facility模型
    [('title', 'title'), ('price', '123'), ('area_id', '2'),
    ('address', '12'), ('room_count', '1'), ('acreage', '1'),
    ('unit', '1'), ('capacity', '1'), ('beds', '1'),
    ('deposit', '1'), ('min_days', '1'), ('max_days', '1'),
    ('facility', '1'), ('facility', '3'), ('facility', '5')]
    """
    if request.method == 'POST':
        user_id = session.get('user_id')
        title = request.form.get('title')
        price = int(request.form.get('price'))
        area_id = int(request.form.get('area_id'))
        address = request.form.get('address')
        room_count = int(request.form.get('room_count'))
        acreage = int(request.form.get('acreage'))
        unit = request.form.get('unit')
        capacity = int(request.form.get('capacity'))
        beds = request.form.get('beds')
        deposit = int(request.form.get('deposit'))
        min_days = int(request.form.get('min_days'))
        max_days = int(request.form.get('max_days'))
        facilities = request.form.getlist('facility')
        # 参数没填写完就重新填写
        if not all([title, price, area_id, address, room_count, acreage,
                    unit, capacity, beds, deposit, min_days, facilities, user_id]):
            return jsonify(status.USER_PARAMS_IS_INVALID)
        # 给house模型添加数据
        house_n = House()
        house_n.user_id = user_id
        house_n.title = title
        house_n.price = price
        house_n.area_id = area_id
        house_n.address = address
        house_n.room_count = room_count
        house_n.acreage = acreage
        house_n.unit = unit
        house_n.capacity = capacity
        house_n.beds = beds
        house_n.deposit = deposit
        house_n.min_days = min_days
        house_n.max_days = max_days
        # 添加基础设施对象：循环拿出基础设置对象，将对象添加到中间表
        for i in facilities:
            facility = Facility.query.filter(Facility.id == int(i)).first()
            house_n.facilities.append(facility)
        house_n.add_update()
        house_id = house_n.id
        return jsonify({'code': 500, 'msg': '添加房间成功', 'house_id': house_id})

    if request.method == 'PATCH':
        """取得房间id和房间图片，对房间id和房间图片进行储存,添加首图"""
        house_id = request.form.get('house_id')
        house_image = request.files.get('house_image')
        if not all([house_id, house_image]):
            return jsonify(status.IMAGE_OR_HOUSE_ID_INVALID)

        path = os.path.join(MEDIA_PATH, house_image.filename)
        house_image.save(path)

        house_image_n = HouseImage()
        house_image_n.url = house_image.filename
        house_image_n.house_id = house_id
        house_image_n.add_update()

        # 添加首图
        house = House.query.filter(House.id == house_id).first()
        if house.index_image_url:
            data = {'code': 200, 'url': house_image.filename}
            return jsonify(data)

        images = HouseImage.query.filter(HouseImage.house_id == house_id).order_by('create_time').first()
        house.index_image_url = images.url
        house.add_update()

        data = {'code': 200, 'url': house_image.filename}
        return jsonify(data)


@blue_house.route('/show_houses/', methods=['GET'])
@is_login
def show_houses():
    """
    展示房间列表在我的房源页面
        1.拿到我的房源信息
        2.包装成json数据返回
    """
    user_id = session.get('user_id')
    # user = User.query.filter(User.id == user_id).first()
    # if not all([user.id_name, user.id_card]):
    #     return jsonify(status.NOT_AUTH)
    houses = House.query.filter(House.user_id == user_id).order_by('create_time')
    list_house = []
    for house in houses:
        house_info = house.to_dict()
        list_house.append(house_info)
    data = {'code': 200, 'houses': list_house}
    return jsonify(data)


@blue_house.route('/detail/<int:id>', methods=['GET'])
def detail(id):
    """将MyHouse页面传来的house_id存入session,方便使用"""
    session['house_id'] = id
    return render_template('detail.html')


@blue_house.route('/detail_init/', methods=['GET'])
def detail_init():
    """
    使用模型定义的方法，返回的info数据为一下格式
    {'id': 17, 'user_avatar': 'landlord01.jpg',
    'user_name': 'eryang', 'title': '召唤师峡谷',
    'price': 1000, 'address': '锦江区007号',
    'room_count': 1, 'acreage': 120, 'unit': '三室两厅两卫',
    'capacity': 2, 'beds': '水床：R=1.2m', 'deposit': 100,
    'min_days': 1, 'max_days': 0, 'order_count': 0,
    'images': ['home01.jpg', 'landlord01.jpg'],
    'facilities': [
    {'id': 1, 'name': '无线网络', 'css': 'wirelessnetwork-ico'},
    {'id': 2, 'name': '热水淋浴', 'css': 'shower-ico'},
    {'id': 3, 'name': '空调', 'css': 'aircondition-ico'},
    {'id': 4, 'name': '暖气', 'css': 'heater-ico'}]}

    """
    house_id = session.get('house_id')
    house = House.query.filter(House.id == house_id).first()
    orders = Order.query.filter(and_(Order.house_id == house_id,
                                     Order.status.in_(['WAIT_PAYMENT', 'PAID', 'WAIT_COMMENT'])))
    order_l = []
    for order in orders:
        order_info = order.to_dict()
        order_l.append(order_info)
    house_info = house.to_full_dict()
    data = {'code': 200, 'info': house_info, 'order': order_l}
    return jsonify(data)


@blue_house.route('/is_owner/', methods=['GET'])
def is_owner():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify(status.NOT_LOGIN)
    house_id = session.get('house_id')
    house = House.query.filter(House.id == house_id).first()
    if house.user_id == user_id:
        return jsonify({'code': 200, 'msg': '房东'})
    return jsonify(status.CUSTOMER_LOGIN)


