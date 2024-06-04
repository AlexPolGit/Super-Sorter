from flask_restx import Model, fields

ANILIST_CHARACTER = Model("AnilistCharacter", {
    "id": fields.String(example="378"),
    "name_full": fields.String(example="Mizunashi Akari"),
    "name_native": fields.String(example="水無灯里"),
    "image": fields.String(example="https://s4.anilist.co/file/anilistcdn/character/large/b378-pjsuS5BGmjQw.png")
})

ANILIST_CHARACTERS = Model("AnilistCharacters", {
    "characters": fields.List(fields.Nested(ANILIST_CHARACTER))
})

ANILIST_ADD_CHARACTERS = Model("AnilistAddCharacters", {
    "characters": fields.List(fields.Nested(ANILIST_CHARACTER))
})

ANILIST_CHARACTER_QUERY= Model("AnilistCharacterQuery", {
    "ids": fields.List(fields.String(example="378"))
})

ANILIST_STAFF = Model("AnilistStaff", {
    "id": fields.String(example="106297"),
    "name_full": fields.String(example="Minase Inori"),
    "name_native": fields.String(example="水瀬いのり"),
    "image": fields.String(example="https://s4.anilist.co/file/anilistcdn/staff/large/n106297-DYjwI6p4yZNJ.jpg")
})

ANILIST_STAFFS = Model("AnilistStaffs", {
    "staff": fields.List(fields.Nested(ANILIST_STAFF))
})

ANILIST_ADD_STAFF = Model("AnilistAddStaff", {
    "staff": fields.List(fields.Nested(ANILIST_STAFF))
})

ANILIST_STAFF_QUERY= Model("AnilistStaffQuery", {
    "ids": fields.List(fields.String(example="378"))
})