from flask_restx import Model, fields

ANILIST_CHARACTER = Model("AnilistCharacter", {
    "id": fields.String(example="378"),
    "name_full": fields.String(example="Mizunashi Akari"),
    "name_native": fields.String(example="水無灯里"),
    "image": fields.String(example="https://s4.anilist.co/file/anilistcdn/character/large/b378-pjsuS5BGmjQw.png"),
    "age": fields.String(example="15"),
    "gender": fields.String(example="Female"),
    "favourites": fields.Integer(example=1500)
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
    "image": fields.String(example="https://s4.anilist.co/file/anilistcdn/staff/large/n106297-DYjwI6p4yZNJ.jpg"),
    "age": fields.String(example="28"),
    "gender": fields.String(example="Female"),
    "favourites": fields.Integer(example=6500)
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

ANILIST_MEDIA = Model("AnilistMedia", {
    "id": fields.String(example="853"),
    "image": fields.String(example="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx853-OGmpjzPaRfz5.jpg"),
    "title_romaji": fields.String(example="Ouran Koukou Host Club"),
    "title_english": fields.String(example="Ouran High School Host Club"),
    "title_native": fields.String(example="桜蘭高校ホスト部"),
    "favourites": fields.Integer(example=10000),
    "mean_score": fields.Integer(example=80),
    "status": fields.String(enum=["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"]),
    "format": fields.String(enum=["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC", "MANGA", "NOVEL", "ONE_SHOT"]),
    "genres": fields.List(fields.String(example="Comedy"))
})

ANILIST_MEDIAS = Model("AnilistMedias", {
    "media": fields.List(fields.Nested(ANILIST_MEDIA))
})

ANILIST_ADD_MEDIA = Model("AnilistAddMedia", {
    "media": fields.List(fields.Nested(ANILIST_MEDIA))
})

ANILIST_MEDIA_QUERY= Model("AnilistMediaQuery", {
    "ids": fields.List(fields.String(example="853"))
})
