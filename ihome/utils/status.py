"""__author__ = ErYang"""

# 注册状态码
USER_PARAMS_IS_INVALID = {'code': 100, 'msg': '请填写完整参数'}

USER_MOBILE_ERROR = {'code': 101, 'msg': '手机号格式不对'}

USER_MOBILE_EXIST = {'code': 102, 'msg': '手机号已注册'}

USER_IMAGECODE_ERROR = {'code': 103, 'msg': '图片验证码输入错误'}

USER_PASSWORD_ERROR = {'code': 104, 'msg': '两次密码不一致'}

# 通用成功状态码
SUCCESS = {'code': 200, 'msg': '请求成功'}

# 登录状态码
MOBILE_NO_REGISTER = {'code': 201, 'msg': '手机号没有被注册'}

MISMATCHING_PASSWORD = {'code': 202, 'msg': '账号或密码错误'}

LOGOUT_SUCCESS = {'code': 203, 'msg': '退出账号成功'}

# 上传文件
UPLOADING_ERROR = {'code': 301, 'msg': '上传失败'}

# 实名验证状态码
IDENTIFICATION_CARD_INVALID = {'code': 401, 'msg': '身份证不合法规范'}

NAME_INVALID = {'code': 402, 'msg': '真实姓名不符合规范'}

AUTH_SUCCESS = {'code': 403, 'msg': '实名认证成功'}

NOT_AUTH = {'code': 404, 'msg': '没有进行实名认证'}

FINISHED_AUTH = {'code': 405, 'msg': '已经进行实名认证'}

# 新增房屋
IMAGE_OR_HOUSE_ID_INVALID = {'code': 501, 'msg': '图片或房间id不合法'}

IMAGE_UPLOADING_SUCCESS = {'code': 200, 'msg': '图片上传成功'}

NO_IMAGES = {'code': 502, 'msg': '没有可展示图片'}

# detail
NOT_LOGIN = {'code': 601, 'msg': '没有登录'}
CUSTOMER_LOGIN = {'code': 602, 'msg': '顾客登录'}

# search页面
NO_RESULT = {'code': 701, 'msg': '没有找到结果'}

# 提交订单
SORT_TIME = {'code': 800, 'msg': '入住时长过短'}

LONG_TIME = {'code': 801, 'msg': '入住时长过长'}

NO_ORDER = {'code': 802, 'msg': '没有订单'}
