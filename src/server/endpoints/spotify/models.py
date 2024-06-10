from flask_restx import Model, fields

ACCESS_TOKEN = Model("AccessToken", {
    "token": fields.String(example="abc123"),
    "expiry": fields.Integer(example=1704085200)
})
