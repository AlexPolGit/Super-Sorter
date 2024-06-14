from db.database import DataBase

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

class DbAnilistMediaObject:
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

class AnilistDataBase(DataBase):

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
            self.sanitizeDbInput(char)
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
            self.sanitizeDbInput(staff)
            valuesString += f"('{staff['id']}', '{staff['name_full']}', '{staff['name_native']}', '{staff['image']}')"
            if (i < len(staffs) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-staff' (id, name_full, name_native, image) VALUES {valuesString}"
        self.execute(query)

    def getMedia(self, ids: list[str]) -> list[DbAnilistMediaObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres FROM 'anilist-media' WHERE {idQuery}"
        res = self.fetchAll(query)
        medias: list[DbAnilistMediaObject] = []
        for media in res:
            id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres = media[0], media[1], media[2], media[3], media[4], media[5], media[6], media[7], media[8], media[9]
            medias.append(DbAnilistMediaObject(id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres))
        return medias

    def addMedia(self, medias: list[dict]):
        if (len(medias) == 0):
            return
        
        valuesString = ""
        for i, media in enumerate(medias):
            self.sanitizeDbInput(media)
            valuesString += f"('{media['id']}', '{media['image']}', '{media['title_romaji']}', '{media['title_english']}', '{media['title_native']}', '{media['favourites']}', '{media['mean_score']}', '{media['status']}', '{media['format']}', '{media['genres']}')"
            if (i < len(medias) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-media' (id, image, title_romaji, title_english, title_native, favourites, mean_score, status, format, genres) VALUES {valuesString}"
        print(query)
        self.execute(query)
