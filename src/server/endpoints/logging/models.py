from flask_restx import Model, fields

ADD_LOG = Model("AddLog", {
    "time": fields.String(example="1/1/2024 10:00:00 AM"),
    "level": fields.String(example="error", enum=["debug", "info", "warn", "error"]),
    "data": fields.String
})
