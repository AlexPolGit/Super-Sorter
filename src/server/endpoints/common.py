from flask_restx import Model, fields
from game.session_manager import SessionManager
from game.anilist import Anilist

GLOBAL_SESSION_MANAGER = SessionManager()
GLOBAL_ANILIST = Anilist()

COMMON_ERROR_MODEL = Model("Error", {
    "message": fields.String(example = "[ExceptionName] Error message.")
})
