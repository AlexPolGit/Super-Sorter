from db.accounts.accounts import AccountsDataBase

class DbAnilistCharacterObject:
    def __init__(self, id: str, name_full: str, name_native: str, image: str) -> None:
        self.id = f"{id}"
        self.name_full = name_full
        self.name_native = name_native
        self.image = image

class DbAnilistStaffObject:
    def __init__(self, id: str, name_full: str, name_native: str, image: str) -> None:
        self.id = f"{id}"
        self.name_full = name_full
        self.name_native = name_native
        self.image = image

class DbAnilistAnimeObject:
    def __init__(self, id: str, image: str, title_romaji: str, title_english: str, title_native: str, favourites: int, mean_score: int, status: str, format: str, genres: str) -> None:
        self.id = f"{id}"
        self.image = image
        self.title_romaji = title_romaji
        self.title_english = title_english
        self.title_native = title_native
        self.favourites = favourites
        self.mean_score = mean_score
        self.status = status
        self.format = format
        self.genres = genres

class DbAnilistMangaObject:
    def __init__(self, id: str, image: str, title_romaji: str, title_english: str, title_native: str, favourites: int, mean_score: int, status: str, format: str, genres: str) -> None:
        self.id = f"{id}"
        self.image = image
        self.title_romaji = title_romaji
        self.title_english = title_english
        self.title_native = title_native
        self.favourites = favourites
        self.mean_score = mean_score
        self.status = status
        self.format = format
        self.genres = genres

class AnilistDataBase(AccountsDataBase):

    def __init__(self) -> None:
        super().__init__()

    def getCharacters(self, ids: list[str]) -> list[DbAnilistCharacterObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, name_full, name_native, image FROM 'anilist-character' WHERE {idQuery}"
        res = self.fetchAll(query)
        characters: list[DbAnilistCharacterObject] = []
        for char in res:
            id, name_full, name_native, image = char[0], char[1], char[2], char[3]
            characters.append(DbAnilistCharacterObject(id, name_full, name_native, image))
        return characters

    def addCharacters(self, chars: list[dict]):
        if (len(chars) == 0):
            return
        
        valuesString = ""
        for i, char in enumerate(chars):
            valuesString += f"('{char['id']}', '{char['name_full']}', '{char['name_native']}', '{char['image']}')"
            if (i < len(chars) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-character' (id, name_full, name_native, image) VALUES {valuesString}"
        self.execute(query)

    def getStaff(self, ids: list[str]) -> list[DbAnilistStaffObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, name_full, name_native, image FROM 'anilist-staff' WHERE {idQuery}"
        res = self.fetchAll(query)
        staffs: list[DbAnilistStaffObject] = []
        for staff in res:
            id, name_full, name_native, image = staff[0], staff[1], staff[2], staff[3]
            staffs.append(DbAnilistStaffObject(id, name_full, name_native, image))
        return staffs

    def addStaff(self, staffs: list[dict]):
        if (len(staffs) == 0):
            return
        
        valuesString = ""
        for i, staff in enumerate(staffs):
            valuesString += f"('{staff['id']}', '{staff['name_full']}', '{staff['name_native']}', '{staff['image']}')"
            if (i < len(staffs) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-staff' (id, name_full, name_native, image) VALUES {valuesString}"
        self.execute(query)

    def getAnime(self, ids: list[str]) -> list[DbAnilistAnimeObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres FROM 'anilist-anime' WHERE {idQuery}"
        res = self.fetchAll(query)
        animes: list[DbAnilistAnimeObject] = []
        for anime in res:
            id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres = anime[0], anime[1], anime[2], anime[3], anime[4], anime[5], anime[6], anime[7], anime[8], anime[9]
            animes.append(DbAnilistAnimeObject(id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres))
        return animes

    def addAnime(self, animes: list[dict]):
        if (len(animes) == 0):
            return
        
        valuesString = ""
        for i, anime in enumerate(animes):
            valuesString += f"('{anime['id']}', '{anime['image']}', '{anime['title_romaji']}', '{anime['title_english']}', '{anime['title_native']}', '{anime['favourites']}', '{anime['mean_score']}', '{anime['status']}', '{anime['format']}', '{anime['genres']}')"
            if (i < len(animes) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-anime' (id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres) VALUES {valuesString}"
        self.execute(query)

    def getManga(self, ids: list[str]) -> list[DbAnilistMangaObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres FROM 'anilist-manga' WHERE {idQuery}"
        res = self.fetchAll(query)
        mangas: list[DbAnilistMangaObject] = []
        for manga in res:
            id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres = manga[0], manga[1], manga[2], manga[3], manga[4], manga[5], manga[6], manga[7], manga[8], manga[9]
            mangas.append(DbAnilistMangaObject(id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres))
        return mangas

    def addManga(self, mangas: list[dict]):
        if (len(mangas) == 0):
            return
        
        valuesString = ""
        for i, manga in enumerate(mangas):
            valuesString += f"('{manga['id']}', '{manga['image']}', '{manga['title_romaji']}', '{manga['title_english']}', '{manga['title_native']}', '{manga['favourites']}', '{manga['mean_score']}', '{manga['status']}', '{manga['format']}', '{manga['genres']}')"
            if (i < len(mangas) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-manga' (id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres) VALUES {valuesString}"
        self.execute(query)
