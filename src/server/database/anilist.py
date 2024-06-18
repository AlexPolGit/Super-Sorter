from database.sorter_database import SorterDataBase
from business_logic.objects.models.anilist import AnilistCharacter, AnilistStaff, AnilistMedia

class AnilistDataBase(SorterDataBase):

    def getCharacters(self, ids: list[int]) -> list[AnilistCharacter]:
        return self._selectMultiple(AnilistCharacter, AnilistCharacter.id.in_(ids))

    def addCharacters(self, chars: list[dict]):
        charsToAdd = []
        for char in chars:
            anilistCharacter = AnilistCharacter()
            anilistCharacter.id = char["id"]
            anilistCharacter.name_full = char["name_full"]
            if ("name_native" in char):
                anilistCharacter.name_native = char["name_native"]
            if ("image" in char):
                anilistCharacter.image = char["image"]
            if ("gender" in char):
                anilistCharacter.gender = char["gender"]
            if ("age" in char):
                anilistCharacter.age = char["age"] 
            if ("favourites" in char):
                anilistCharacter.favourites = char["favourites"] 
            charsToAdd.append(anilistCharacter)
        
        self._insertMultiple(charsToAdd)

    def getStaff(self, ids: list[int]) -> list[AnilistStaff]:
        return self._selectMultiple(AnilistStaff, AnilistStaff.id.in_(ids))

    def addStaff(self, staffs: list[dict]):
        staffToAdd = []
        for staff in staffs:
            anilistStaff = AnilistStaff()
            anilistStaff.id = staff["id"]
            anilistStaff.name_full = staff["name_full"]
            if ("name_native" in staff):
                anilistStaff.name_native = staff["name_native"]
            if ("image" in staff):
                anilistStaff.image = staff["image"]
            if ("gender" in staff):
                anilistStaff.gender = staff["gender"]
            if ("age" in staff):
                anilistStaff.age = staff["age"] 
            if ("favourites" in staff):
                anilistStaff.favourites = staff["favourites"] 
            staffToAdd.append(anilistStaff)
        
        self._insertMultiple(staffToAdd)

    def getMedia(self, ids: list[int]) -> list[AnilistMedia]:
        return self._selectMultiple(AnilistMedia, AnilistMedia.id.in_(ids))

    def addMedia(self, medias: list[dict]):
        mediaToAdd = []
        for media in medias:
            anilistMedia = AnilistMedia()
            anilistMedia.id = media["id"]
            anilistMedia.title_romaji = media["title_romaji"]
            if ("image" in media):
                anilistMedia.image = media["image"]
            if ("title_english" in media):
                anilistMedia.title_english = media["title_english"]
            if ("title_native" in media):
                anilistMedia.title_native = media["title_native"]
            if ("favourites" in media):
                anilistMedia.favourites = media["favourites"] 
            if ("mean_score" in media):
                anilistMedia.mean_score = media["mean_score"] 
            if ("status" in media):
                anilistMedia.status = media["status"] 
            if ("format" in media):
                anilistMedia.format = media["format"] 
            if ("genres" in media):
                anilistMedia.genres = media["genres"] 
            mediaToAdd.append(anilistMedia)
        
        self._insertMultiple(mediaToAdd)
