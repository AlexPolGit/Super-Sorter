from util.logging import GLOBAL_LOGGER as logger
from database.anilist import AnilistDataBase
from domain.objects.models.anilist import AnilistCharacter, AnilistMedia, AnilistStaff

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
        newChars = self.database.addCharacters(chars)
        for char in newChars:
            self.characterCache[f"{char.id}"] = char

    def getCharacters(self, ids: list[str]) -> list:
        requestedCharacters: list = []
        notCached: list[str] = []

        for id in ids:
            if (id not in self.characterCache):
                logger.debug(f"Cache miss on Anilist character '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist character cache.")
                requestedCharacters.append(self.characterCache.get(id).getMap())
        
        dbList = self.database.getCharacters(notCached)

        for anilistCharacter in dbList:
            requestedCharacters.append(anilistCharacter.getMap())
            self.characterCache[f"{anilistCharacter.id}"] = anilistCharacter
            # logger.debug(f"Added to Anilist character cache: '{char.id}'")

        return requestedCharacters
    
    def addStaff(self, staffs: list[dict]) -> None:
        newStaff = self.database.addStaff(staffs)
        for staff in newStaff:
            self.staffCache[f"{staff.id}"] = staff

    def getStaff(self, ids: list[str]) -> list:
        requestedStaff: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.staffCache):
                logger.debug(f"Cache miss on Anilist staff '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist staff cache.")
                requestedStaff.append(self.staffCache.get(id).getMap())
        
        dbList = self.database.getStaff(notCached)

        for anilistStaff in dbList:
            requestedStaff.append(anilistStaff.getMap())
            self.staffCache[f"{anilistStaff.id}"] = anilistStaff
            # logger.debug(f"Added missing to Anilist staff cache: '{staff.id}'")

        return requestedStaff

    def addMedia(self, medias: list[dict]) -> None:
        newMedia = self.database.addMedia(medias)
        for media in newMedia:
            self.mediaCache[f"{media.id}"] = media

    def getMedia(self, ids: list[str]) -> list:
        requestedMedia: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.mediaCache):
                logger.debug(f"Cache miss on Anilist media '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist media cache.")
                requestedMedia.append(self.mediaCache.get(id).getMap())
        
        dbList = self.database.getMedia(notCached)

        for anilistMedia in dbList:
            requestedMedia.append(anilistMedia.getMap())
            self.mediaCache[f"{anilistMedia.id}"] = anilistMedia
            # logger.debug(f"Added missing to Anilist media cache: '{media.id}'")

        return requestedMedia
