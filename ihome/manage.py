"""__author__ = ErYang"""
from utils.app import create_app
from flask_script import Manager


# 获取app对象
app = create_app()

# 使用Manager来管理app
manage = Manager(app)


if __name__ == '__main__':
    manage.run()
