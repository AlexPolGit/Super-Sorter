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

class AnilistAnime:
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
    
class AnilistManga:
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
    animeCache: dict[str, AnilistAnime]
    mangaCache: dict[str, AnilistManga]

    def __init__(self) -> None:
        self.database = AnilistDataBase()
        self.characterCache = {}
        self.staffCache = {}
        self.animeCache = {}
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
            # ogger.debug(f"Added missing to Anilist staff cache: '{staff.id}'")

        return requestedStaff

    def addAnime(self, animes: list[dict]) -> None:
        self.database.addAnime(animes)
        for anime in animes:
            self.animeCache[anime['id']] = AnilistAnime(anime['id'], anime['image'], anime['title_romaji'], anime['title_english'], anime['title_native'], anime['favourites'], anime['mean_score'], anime['status'], anime['format'], anime['genres'])

    def getAnime(self, ids: list[str]) -> list:
        requestedAnime: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.animeCache):
                logger.debug(f"Cache miss on Anilist anime '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist anime cache.")
                requestedAnime.append(self.animeCache.get(id).asObject())
        
        dbList = self.database.getAnime(notCached)

        for anime in dbList:
            anilistAnime = AnilistAnime(anime.id, anime.image, anime.title_romaji, anime.title_english, anime.title_native, anime.favourites, anime.mean_score, anime.status, anime.format, anime.genres)
            requestedAnime.append(anilistAnime.asObject())
            self.animeCache[anime.id] = anilistAnime
            # ogger.debug(f"Added missing to Anilist anime cache: '{anime.id}'")

        return requestedAnime

    def addManga(self, mangas: list[dict]) -> None:
        self.database.addManga(mangas)
        for manga in mangas:
            self.mangaCache[manga['id']] = AnilistManga(manga['id'], manga['image'], manga['title_romaji'], manga['title_english'], manga['title_native'], manga['favourites'], manga['mean_score'], manga['status'], manga['format'], manga['genres'])

    def getManga(self, ids: list[str]) -> list:
        requestedManga: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.mangaCache):
                logger.debug(f"Cache miss on Anilist manga '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Anilist manga cache.")
                requestedManga.append(self.mangaCache.get(id).asObject())
        
        dbList = self.database.getManga(notCached)

        for manga in dbList:
            anilistManga = AnilistManga(manga.id, manga.image, manga.title_romaji, manga.title_english, manga.title_native, manga.favourites, manga.mean_score, manga.status, manga.format, manga.genres)
            requestedManga.append(anilistManga.asObject())
            self.mangaCache[manga.id] = anilistManga
            # ogger.debug(f"Added missing to Anilist manga cache: '{manga.id}'")

        return requestedManga