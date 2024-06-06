from flask import request
from flask_restx import Namespace, Resource
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_ACCOUNT_MANAGER
from endpoints.accounts.models import LOGIN, REGISTER, SUCCESSFUL_LOGIN_OR_REGISTER

accounts = Namespace("Accounts", description = "Login and register users.")

CommonErrorModel = accounts.add_model("Error", COMMON_ERROR_MODEL)
UserLoginModel = accounts.add_model("UserLogin", LOGIN)
UserRegisterModel = accounts.add_model("UserRegister", REGISTER)
SuccessfulLoginOrRegister = accounts.add_model("SuccessfulLoginOrRegister", SUCCESSFUL_LOGIN_OR_REGISTER)

@accounts.route("/login")
@accounts.response(500, "InternalError", CommonErrorModel)
class Login(Resource):
    @accounts.expect(UserLoginModel)
    @accounts.response(200, "UserLogin", SuccessfulLoginOrRegister)
    def post(self):
        requestData = request.json
        GLOBAL_ACCOUNT_MANAGER.tryLogin(requestData["username"], requestData["password"])
        return {
            "username": requestData["username"]
        }
    
@accounts.route("/register")
@accounts.response(500, "InternalError", CommonErrorModel)
class Register(Resource):
    @accounts.expect(UserRegisterModel)
    @accounts.response(200, "UserRegister", SuccessfulLoginOrRegister)
    def post(self):
        requestData = request.json
        GLOBAL_ACCOUNT_MANAGER.addUser(requestData["username"], requestData["password"])
        return {
            "username": requestData["username"]
        }
