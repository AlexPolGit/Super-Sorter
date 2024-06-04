from functools import wraps
from flask import request
from flask_restx import Model, Resource, fields
from objects.exceptions.base import BaseSorterException
from util.accounts import AccountManager
from game.session_manager import SessionManager
from game.anilist import Anilist

GLOBAL_ACCOUNT_MANAGER = AccountManager()
GLOBAL_SESSION_MANAGER = SessionManager()
GLOBAL_ANILIST = Anilist()

COMMON_ERROR_MODEL = Model("Error", {
    "message": fields.String(example = "[ExceptionName] Error message.")
})

class MissingAuthException(BaseSorterException):
    errorCode = 401
    def __init__(self) -> None:
        super().__init__(f"Username and password basic auth is required.")

def requiresAuth(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        auth = request.authorization
        if auth:
            GLOBAL_ACCOUNT_MANAGER.tryLogin(auth.username, auth.password)
            return f(*args, **kwargs)
        else:
            raise MissingAuthException()
    return decorator

class AuthenticatedResource(Resource):
    decorators = [requiresAuth]
