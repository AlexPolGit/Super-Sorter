from flask import request
from flask_restx import Namespace, Resource
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_ANILIST as anilistObject
from endpoints.anilist.models import ANILIST_CHARACTER, ANILIST_ADD_CHARACTERS, ANILIST_CHARACTER_QUERY, ANILIST_CHARACTERS

anilist = Namespace("Anilist", description = "Endpoints for getting Anilist-related data.")

CommonErrorModel = anilist.add_model("Error", COMMON_ERROR_MODEL)
anilist.add_model("AnilistCharacter", ANILIST_CHARACTER)
AnilistAddCharactersModel = anilist.add_model("AnilistAddCharacters", ANILIST_ADD_CHARACTERS) 
AnilistCharacterQueryModel = anilist.add_model("AnilistCharacterQuery", ANILIST_CHARACTER_QUERY) 
AnilistCharactersModel = anilist.add_model("AnilistCharacters", ANILIST_CHARACTERS)

@anilist.route("/characters")
@anilist.response(500, "InternalError", CommonErrorModel)
class Characters(Resource):
    @anilist.expect(AnilistAddCharactersModel)
    @anilist.response(200, "AnilistCharacters", AnilistCharactersModel)
    def post(self):
        requestData = request.json
        anilistObject.addCharacters(requestData["characters"])
    
@anilist.route("/characters/list")
@anilist.response(500, "InternalError", CommonErrorModel)
class GetCharacters(Resource):
    @anilist.expect(AnilistCharacterQueryModel)
    @anilist.response(200, "AnilistCharacters", AnilistCharactersModel)
    def post(self):
        requestData = request.json
        return anilistObject.getCharacters(requestData["ids"])
