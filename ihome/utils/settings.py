"""__author__ = ErYang"""
import os

# 配置mysql数据库
DATABASE = {
    'NAME': 'ihome',
    'USER': 'root',
    'PASSWORD': '123456',
    'HOST': '127.0.0.1',
    'PORT': '3306',
    'ENGINE': 'mysql',
    'DRIVER': 'pymysql',
}

# 配置基础路径(取得ihome路径)
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 配置static路径
STATIC_PATH = os.path.join(BASE_PATH, 'static')

# 配置templates路径
TEMPLATES_PATH = os.path.join(BASE_PATH, 'templates')

# 配置media路径
MEDIA_PATH = os.path.join(STATIC_PATH, 'media')
