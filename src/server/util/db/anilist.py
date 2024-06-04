from util.db.database import DataBase

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
        characters: list[DbAnilistStaffObject] = []
        for char in res:
            id, name_full, name_native, image = char[0], char[1], char[2], char[3]
            characters.append(DbAnilistStaffObject(id, name_full, name_native, image))
        return characters

    def addStaff(self, chars: list[dict]):
        if (len(chars) == 0):
            return
        
        valuesString = ""
        for i, char in enumerate(chars):
            valuesString += f"('{char['id']}', '{char['name_full']}', '{char['name_native']}', '{char['image']}')"
            if (i < len(chars) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'anilist-staff' (id, name_full, name_native, image) VALUES {valuesString}"
        self.execute(query)
