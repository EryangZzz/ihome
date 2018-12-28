"""__author__ = ErYang"""
from flask_mail import Mail
from flask import Blueprint
from flask_mail import Message

mail = Mail()
blue = Blueprint('app', __name__)


@blue.route('/')
def index():
    msg = Message('flask-mail测试', recipients=['1207038216@qq.com'])
    msg.body = 'testing content'
    msg.html = '<b>html_test</b>'

    mail.send(msg)
    return '发送成功'
