from functools import wraps
from flask import request
from flask_restx import Model, Resource, fields
from domain.objects.exceptions.base import BaseSorterException
from domain.account_manager import AccountManager
from domain.sessions.session_manager import SessionManager
from domain.sessions.anilist import Anilist
from domain.sessions.generic import GenericItemsGame
from domain.sessions.spotify import Spotify

GLOBAL_ACCOUNT_MANAGER = AccountManager()
GLOBAL_SESSION_MANAGER = SessionManager()
GLOBAL_GENERIC_ITEMS = GenericItemsGame()
GLOBAL_ANILIST = Anilist()
GLOBAL_SPOTIFY = Spotify()

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
