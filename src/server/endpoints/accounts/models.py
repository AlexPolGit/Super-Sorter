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

GOOGLE_LOGIN = Model("GoogleLogin", {
    "credential": fields.String(example="[a JWT token from Google]")
})

SUCCESSFUL_GOOGLE_LOGIN = Model("SuccessfulGoogleLogin", {
    "sessionId": fields.String
})
