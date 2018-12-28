"""__author__ = ErYang"""
from flask import Blueprint, render_template, jsonify, session, \
    make_response, request
from werkzeug.security import generate_password_hash
from io import BytesIO
from utils.functions import create_validate_code, is_login
from utils import status
from re import match
from app.models import User
import os
from utils.settings import MEDIA_PATH


blue_user = Blueprint('user', __name__)


@blue_user.route('/code/', methods=['GET'])
def get_code():
    """定义图片验证码"""
    # 把strs发给前端,或者在后台使用session保存
    code_img, strs = create_validate_code()
    buf = BytesIO()
    code_img.save(buf, 'jpeg')

    buf_str = buf.getvalue()
    response = make_response(buf_str)
    response.headers['Content-Type'] = 'image/gif'
    session['img'] = strs.upper()
    print(session['img'])
    return response


@blue_user.route('/register/', methods=['GET'])
def register():
    """注册页面初始化"""
    return render_template('register.html')


@blue_user.route('/register/', methods=['POST'])
def register_p():
    """注册页面post数据验证"""
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode').upper()
    password = request.form.get('password')
    password2 = request.form.get('password2')

    if not all([mobile, imagecode, password, password2]):
        return jsonify(status.USER_PARAMS_IS_INVALID)
    # 判断注册
    nums = r'^1[34578]\d{9}$'
    if not match(nums, mobile):
        return jsonify(status.USER_MOBILE_ERROR)

    user = User.query.filter(User.phone == mobile).first()
    if user:
        return jsonify(status.USER_MOBILE_EXIST)
    # 判断图片验证码
    if imagecode != session.get('img'):
        return jsonify(status.USER_IMAGECODE_ERROR)
    # 判断密码是否相等
    if password != password2:
        return jsonify(status.USER_PASSWORD_ERROR)

    # 加密密码，用户存储到数据库
    pw = generate_password_hash(password)
    new_user = User()
    new_user.phone = mobile
    new_user.pwd_hash = pw
    new_user.add_update()
    return jsonify(status.SUCCESS)


@blue_user.route('/login/', methods=['GET'])
def login():
    """登录初始化"""
    return render_template('login.html')


@blue_user.route('/login/', methods=['POST'])
def login_p():
    """登录页面post请求验证"""
    # 拿到form数据
    mobile = request.form.get('mobile')
    password = request.form.get('password')
    # 判断数据是否为空
    if not all([mobile, password]):
        return jsonify(status.USER_PARAMS_IS_INVALID)
    # 判断mobile是否注册过
    user = User.query.filter(User.phone == mobile).first()
    if not user:
        return jsonify(status.MOBILE_NO_REGISTER)
    # 判断电话和密码是否匹配
    if not user.check_pwd(password):
        return jsonify(status.MISMATCHING_PASSWORD)
    # 实现登录，向session中存入键值对
    session['user_id'] = user.id
    return jsonify(status.SUCCESS)


@blue_user.route('/my/', methods=['GET'])
@is_login
def my():
    """个人首页 - 个人信息"""
    return render_template('my.html')


@blue_user.route('/my_start/', methods=['GET'])
@is_login
def my_start():
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    # data = {'code': 200, 'msg': '请求成功', 'name': user.name, 'phone': user.phone}
    # return jsonify(data)
    return jsonify(user.to_basic_dict())


@blue_user.route('/profile/', methods=['GET'])
@is_login
def profile():
    """个人信息"""
    return render_template('profile.html')


@blue_user.route('/profile/', methods=['PATCH'])
@is_login
def profile_icon():
    """个人信息头像和姓名"""
    user_id = session.get('user_id')
    # 获取图片
    icon = request.files.get('avatar')
    # 获取姓名
    name = request.form.get('name')

    if icon:
        # 保存图片
        path = os.path.join(MEDIA_PATH, icon.filename)
        icon.save(path)

        user = User.query.filter(User.id == user_id).first()
        user.avatar = icon.filename
        user.add_update()
        return jsonify(status.SUCCESS)
    if name:
        user = User.query.filter(User.id == user_id).first()
        user.name = name
        user.add_update()
        return jsonify(status.SUCCESS)
    else:
        return jsonify(status.UPLOADING_ERROR)


@blue_user.route('/logout/', methods=['DELETE'])
@is_login
def logout():
    """注销"""
    session.pop('user_id')
    return jsonify(status.LOGOUT_SUCCESS)


@blue_user.route('/auth/', methods=['GET'])
@is_login
def auth():
    return render_template('auth.html')


@blue_user.route('/certification/', methods=['GET'])
@is_login
def certification_g():
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    real_name = user.id_name
    card_id = user.id_card
    if not all([real_name, card_id]):
        return jsonify(status.NOT_AUTH)
    data = {'code': 200, 'real_name': real_name, 'card_id': card_id}
    return jsonify(data)


@blue_user.route('/certification/', methods=['PATCH'])
@is_login
def certification():
    """实名认证"""
    id_card = request.form.get('id_card')
    name = request.form.get('name')
    # 判断参数是否填写
    if not all([id_card, name]):
        return jsonify(status.USER_PARAMS_IS_INVALID)
    # 判断姓名是否规范
    re_name = r'^[\u4e00-\u9fa5_\w]+$'
    if not match(re_name, name):
        return jsonify(status.NAME_INVALID)
    # 判断身份证号是否规范
    re_nums = r'^\d{15}|\d{17}([0-9]|X|x)$'
    if not match(re_nums, id_card):
        return jsonify(status.IDENTIFICATION_CARD_INVALID)
    # 验证通过，进行实名信息保存
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    user.id_name = name
    user.id_card = id_card
    user.add_update()
    return jsonify(status.AUTH_SUCCESS)
