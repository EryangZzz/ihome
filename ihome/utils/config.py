"""__author__ = ErYang"""
from utils.functions import get_sqlalchemy_uri
from utils.settings import DATABASE


class Conf():
    # 配置mysql数据库连接
    SQLALCHEMY_DATABASE_URI = get_sqlalchemy_uri(DATABASE)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 配置teardown执行
    PRESERVE_CONTEXT_ON_EXCEPTION = False

    # 配置secret key
    SECRET_KEY = '1234567890ZQAWXSECDRVFTBGYNHUMJIKLOP'
