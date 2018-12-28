"""__author__ = ErYang"""
from flask import Flask
from flask_script import Manager
from app.views import mail, blue

app = Flask(__name__)

app.config['MAIL_DEBUG'] = True             # 开启debug，便于调试看信息
app.config['MAIL_SUPPRESS_SEND'] = False    # 发送邮件，为True则不发送
app.config['MAIL_SERVER'] = 'smtp.qq.com'   # 邮箱服务器
app.config['MAIL_PORT'] = 465               # 端口
app.config['MAIL_USE_SSL'] = True           # 重要，qq邮箱需要使用SSL
app.config['MAIL_USE_TLS'] = False          # 不需要使用TLS
app.config['MAIL_USERNAME'] = '1289256052@qq.com'  # 填邮箱
app.config['MAIL_PASSWORD'] = 'oiihdnvwloombafb'      # 填授权码
app.config['MAIL_DEFAULT_SENDER'] = '1289256052@qq.com'  # 填邮箱，默认发送者

app.register_blueprint(blueprint=blue, url_prefix='/app')
mail.init_app(app)

manage = Manager(app)


if __name__ == '__main__' :
    manage.run()