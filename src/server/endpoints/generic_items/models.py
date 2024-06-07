from flask_restx import Model, fields

GENERIC_ITEM = Model("GenericItem", {
    "id": fields.String(example="7d215406-c129-46df-a9f0-81095783e357"),
    "name": fields.String(example="Borzoi Dogs"),
    "image": fields.String(example="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/06/01094414/Borzoi-head-portrait-outdoors.jpeg"),
    "metadata": fields.String
})

GENERIC_ITEM_CREATE = Model("GenericItemCreate", {
    "name": fields.String(example="Borzoi Dogs"),
    "image": fields.String(example="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/06/01094414/Borzoi-head-portrait-outdoors.jpeg"),
    "metadata": fields.String
})

GENERIC_ITEMS = Model("GenericItems", {
    "items": fields.List(fields.Nested(GENERIC_ITEM))
})

ADD_GENERIC_ITEMS = Model("AddGenericItems", {
    "items": fields.List(fields.Nested(GENERIC_ITEM_CREATE))
})

GENERIC_ITEM_QUERY= Model("GenericItemQuery", {
    "ids": fields.List(fields.String(example="7d215406-c129-46df-a9f0-81095783e357"))
})
