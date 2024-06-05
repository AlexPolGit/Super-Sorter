from flask_restx import Model, fields

NEW_SESSION = Model("NewSession", {
    "name": fields.String(example="My Sort Session"),
    "type": fields.String(example="general-character"),
    "items": fields.List(fields.String)
})

USER_CHOICE = Model("UserChoice", {
    "itemA": fields.String(example="123"),
    "itemB": fields.String(example="456"),
    "choice": fields.Boolean(example=True)
})

USER_DELETE = Model("UserDelete", {
    "item": fields.String(example="123")
})

USER_UNDELETE = Model("UserUndelete", {
    "item": fields.String(example="123")
})

OPTIONS = Model("Options", {
    "itemA": fields.String,
    "itemB": fields.String
})

SESSION_DATA = Model("SessionData", {
    "sessionId": fields.String,
    "name": fields.String,
    "type": fields.String,
    "options": fields.Nested(OPTIONS),
    "items": fields.List(fields.String),
    "seed": fields.Integer,
    "history": fields.String,
    "deleted": fields.String
})

SESSION_LIST = Model("SessionList", {
    "sessions": fields.List(fields.Nested(SESSION_DATA))
})
