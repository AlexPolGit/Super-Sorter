from flask_restx import Model, fields

LOGIN = Model("UserLogin", {
    "username": fields.String,
    "password": fields.String
})

REGISTER = Model("UserRegister", {
    "username": fields.String,
    "password": fields.String
})

SUCCESSFUL_LOGIN_OR_REGISTER = Model("SuccessfulLoginOrRegister", {
    "username": fields.String
})
