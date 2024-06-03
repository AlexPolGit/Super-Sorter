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
