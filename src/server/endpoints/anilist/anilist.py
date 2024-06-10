from flask import request
from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_ANILIST as anilistObject, AuthenticatedResource
from endpoints.anilist.models import ANILIST_CHARACTER, ANILIST_ADD_CHARACTERS, ANILIST_CHARACTER_QUERY, ANILIST_CHARACTERS
from endpoints.anilist.models import ANILIST_STAFF, ANILIST_ADD_STAFF, ANILIST_STAFF_QUERY, ANILIST_STAFFS
from endpoints.anilist.models import ANILIST_ANIME, ANILIST_ADD_ANIME, ANILIST_ANIME_QUERY, ANILIST_ANIMES
from endpoints.anilist.models import ANILIST_MANGA, ANILIST_ADD_MANGA, ANILIST_MANGA_QUERY, ANILIST_MANGAS

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

anilist.add_model("AnilistAnime", ANILIST_ANIME)
AnilistAddAnimeModel = anilist.add_model("AnilistAddAnime", ANILIST_ADD_ANIME) 
AnilistAnimeQueryModel = anilist.add_model("AnilistAnimeQuery", ANILIST_ANIME_QUERY) 
AnilistAnimesModel = anilist.add_model("AnilistAnimes", ANILIST_ANIMES)

anilist.add_model("AnilistManga", ANILIST_MANGA)
AnilistAddMangaModel = anilist.add_model("AnilistAddManga", ANILIST_ADD_MANGA) 
AnilistMangaQueryModel = anilist.add_model("AnilistMangaQuery", ANILIST_MANGA_QUERY) 
AnilistMangasModel = anilist.add_model("AnilistMangas", ANILIST_MANGAS)

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

@anilist.route("/anime")
@anilist.response(500, "InternalError", CommonErrorModel)
class Anime(AuthenticatedResource):
    @anilist.expect(AnilistAddAnimeModel)
    @anilist.response(200, "AnilistAnimes", AnilistAnimesModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        anilistObject.addAnime(requestData["anime"])
    
@anilist.route("/anime/list")
@anilist.response(500, "InternalError", CommonErrorModel)
class GetAnime(AuthenticatedResource):
    @anilist.expect(AnilistAnimeQueryModel)
    @anilist.response(200, "AnilistAnimes", AnilistAnimesModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return anilistObject.getAnime(requestData["ids"])

@anilist.route("/manga")
@anilist.response(500, "InternalError", CommonErrorModel)
class Manga(AuthenticatedResource):
    @anilist.expect(AnilistAddMangaModel)
    @anilist.response(200, "AnilistMangas", AnilistMangasModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        anilistObject.addManga(requestData["manga"])
    
@anilist.route("/manga/list")
@anilist.response(500, "InternalError", CommonErrorModel)
class GetManga(AuthenticatedResource):
    @anilist.expect(AnilistMangaQueryModel)
    @anilist.response(200, "AnilistMangas", AnilistMangasModel)
    @anilist.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return anilistObject.getManga(requestData["ids"])
