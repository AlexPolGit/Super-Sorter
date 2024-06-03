from flask_restx import Model, fields

NEW_SESSION = Model("NewSession", {
    "name": fields.String(example="My Sort Session"),
    "type": fields.String(example="general-character"),
    "items": fields.List(fields.String)
})

USER_CHOICE = Model("UserChoice", {
    "choice": fields.Boolean(example=True)
})

OPTIONS = Model("Options", {
    "itemA": fields.String,
    "itemB": fields.String
})

SESSION_RESPONSE = Model("SessionResponse", {
    "sessionId": fields.String,
    "options": fields.Nested(OPTIONS),
    "result": fields.List(fields.String)
})

SESSION_DATA = Model("SessionData", {
    "sessionId": fields.String,
    "name": fields.String,
    "type": fields.String,
    "items": fields.List(fields.String),
    "seed": fields.Integer
})

SESSION_LIST = Model("SessionList", {
    "sessions": fields.List(fields.Nested(SESSION_DATA))
})
