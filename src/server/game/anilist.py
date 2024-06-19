import json
from util.logging import GLOBAL_LOGGER as logger
from db.anilist.anilist import AnilistDataBase

class AnilistCharacter:
    def __init__(self, id: str, name_full: str, name_native: str, image: str) -> None:
        self.id = id
        self.name_full = name_full
        self.name_native = name_native
        self.image = image

    def asObject(self):
        return json.loads(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))
    
class AnilistStaff:
    def __init__(self, id: str, name_full: str, name_native: str, image: str) -> None:
        self.id = id
        self.name_full = name_full
        self.name_native = name_native
        self.image = image

    def asObject(self):
        return json.loads(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))

class AnilistMedia:
    def __init__(self, id: str, image: str, title_romaji: str, title_english: str, title_native: str, favourites: int, mean_score: int, status: str, format: str, genres: str) -> None:
        self.id = id
        self.image = image
        self.title_romaji = title_romaji
        self.title_english = title_english
        self.title_native = title_native
        self.favourites = favourites
        self.mean_score = mean_score
        self.status = status
        self.format = format
        self.genres = genres

    def asObject(self):
        return json.loads(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))

class Anilist:
    database: AnilistDataBase
    characterCache: dict[str, AnilistCharacter]
    staffCache: dict[str, AnilistStaff]
    mediaCache: dict[str, AnilistMedia]

    def __init__(self) -> None:
        self.database = AnilistDataBase()
        self.characterCache = {}
        self.staffCache = {}
        self.mediaCache = {}
        self.mangaCache = {}

    def addCharacters(self, chars: list[dict]) -> None:
        self.database.addCharacters(chars)
        for char in chars:
            self.characterCache[char['id']] = AnilistCharacter(char['id'], char['name_full'], char['name_native'], char['image'])

    def getCharacters(self, ids: list[str]) -> list:
        requestedCharacters: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.characterCache):
                logger.debug(f"Cache miss on Anilist character '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist character cache.")
                requestedCharacters.append(self.characterCache.get(id).asObject())
        
        dbList = self.database.getCharacters(notCached)

        for char in dbList:
            anilistCharacter = AnilistCharacter(char.id, char.name_full, char.name_native, char.image)
            requestedCharacters.append(anilistCharacter.asObject())
            self.characterCache[char.id] = anilistCharacter
            # logger.debug(f"Added to Anilist character cache: '{char.id}'")

        return requestedCharacters
    
    def addStaff(self, staffs: list[dict]) -> None:
        self.database.addStaff(staffs)
        for staff in staffs:
            self.staffCache[staff['id']] = AnilistStaff(staff['id'], staff['name_full'], staff['name_native'], staff['image'])

    def getStaff(self, ids: list[str]) -> list:
        requestedStaff: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.staffCache):
                logger.debug(f"Cache miss on Anilist staff '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist staff cache.")
                requestedStaff.append(self.staffCache.get(id).asObject())
        
        dbList = self.database.getStaff(notCached)

        for staff in dbList:
            anilistStaff = AnilistStaff(staff.id, staff.name_full, staff.name_native, staff.image)
            requestedStaff.append(anilistStaff.asObject())
            self.staffCache[staff.id] = anilistStaff
            # logger.debug(f"Added missing to Anilist staff cache: '{staff.id}'")

        return requestedStaff

    def addMedia(self, medias: list[dict]) -> None:
        self.database.addMedia(medias)
        for media in medias:
            self.mediaCache[media['id']] = AnilistMedia(media['id'], media['image'], media['title_romaji'], media['title_english'], media['title_native'], media['favourites'], media['mean_score'], media['status'], media['format'], media['genres'])

    def getMedia(self, ids: list[str]) -> list:
        requestedMedia: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.mediaCache):
                logger.debug(f"Cache miss on Anilist media '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist media cache.")
                requestedMedia.append(self.mediaCache.get(id).asObject())
        
        dbList = self.database.getMedia(notCached)

        for media in dbList:
            anilistMedia = AnilistMedia(media.id, media.image, media.title_romaji, media.title_english, media.title_native, media.favourites, media.mean_score, media.status, media.format, media.genres)
            requestedMedia.append(anilistMedia.asObject())
            self.mediaCache[media.id] = anilistMedia
            # logger.debug(f"Added missing to Anilist media cache: '{media.id}'")

        return requestedMedia