from flask import request
from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_ANILIST as anilistObject, AuthenticatedResource
from endpoints.anilist.models import ANILIST_CHARACTER, ANILIST_ADD_CHARACTERS, ANILIST_CHARACTER_QUERY, ANILIST_CHARACTERS, ANILIST_STAFF, ANILIST_ADD_STAFF, ANILIST_STAFF_QUERY, ANILIST_STAFFS

anilist = Namespace("Anilist", description = "Endpoints for getting Anilist-related data.")

CommonErrorModel = anilist.add_model("Error", COMMON_ERROR_MODEL)

anilist.add_model("AnilistCharacter", ANILIST_CHARACTER)
AnilistAddCharactersModel = anilist.add_model("AnilistAddCharacters", ANILIST_ADD_CHARACTERS) 
AnilistCharacterQueryModel = anilist.add_model("AnilistCharacterQuery", ANILIST_CHARACTER_QUERY) 
AnilistCharactersModel = anilist.add_model("AnilistCharacters", ANILIST_CHARACTERS)

anilist.add_model("AnilistStaff", ANILIST_STAFF)
AnilistAddStaffModel = anilist.add_model("AnilistAddStaff", ANILIST_ADD_STAFF) 
AnilistStaffQueryModel = anilist.add_model("AnilistStaffQuery", ANILIST_STAFF_QUERY) 
AnilistStaffsModel = anilist.add_model("AnilistStaffs", ANILIST_STAFFS)

@anilist.route("/characters")
@anilist.response(500, "InternalError", CommonErrorModel)
class Characters(AuthenticatedResource):
    @anilist.expect(AnilistAddCharactersModel)
    @anilist.response(200, "AnilistCharacters", AnilistCharactersModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        anilistObject.addCharacters(requestData["characters"])
    
@anilist.route("/characters/list")
@anilist.response(500, "InternalError", CommonErrorModel)
class GetCharacters(AuthenticatedResource):
    @anilist.expect(AnilistCharacterQueryModel)
    @anilist.response(200, "AnilistCharacters", AnilistCharactersModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return anilistObject.getCharacters(requestData["ids"])
    
@anilist.route("/staff")
@anilist.response(500, "InternalError", CommonErrorModel)
class Staff(AuthenticatedResource):
    @anilist.expect(AnilistAddStaffModel)
    @anilist.response(200, "AnilistStaffs", AnilistStaffsModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        anilistObject.addStaff(requestData["staff"])
    
@anilist.route("/staff/list")
@anilist.response(500, "InternalError", CommonErrorModel)
class GetStaff(AuthenticatedResource):
    @anilist.expect(AnilistStaffQueryModel)
    @anilist.response(200, "AnilistStaffs", AnilistStaffsModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return anilistObject.getStaff(requestData["ids"])
