"""__author__ = ErYang"""
from flask import Flask
from utils.config import Conf
from app.views_user import blue_user
from app.views_order import blue_order
from app.views_house import blue_house
from app.models import db
from utils.settings import TEMPLATES_PATH, STATIC_PATH


def create_app():
    # 定义FLASK对象
    app = Flask(__name__,
                static_folder=STATIC_PATH,
                template_folder=TEMPLATES_PATH)

    # 加载config.py的配置
    app.config.from_object(Conf)

    # 注册user、order、house、house_image、facility、area蓝图
    app.register_blueprint(blueprint=blue_user, url_prefix='/user')
    app.register_blueprint(blueprint=blue_order, url_prefix='/order')
    app.register_blueprint(blueprint=blue_house, url_prefix='/house')

    # 初始化配置
    db.init_app(app)

    return app


