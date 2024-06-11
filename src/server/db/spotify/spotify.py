from db.accounts.accounts import AccountsDataBase

class DbSpotifySongObject:
    def __init__(self, id: str, name: str, image: str, uri: str, artists: str, previewUrl: str) -> None:
        self.id = id
        self.name = name
        self.image = image
        self.uri = uri
        self.artists = artists
        self.previewUrl = previewUrl

class DbSpotifyArtistObject:
    def __init__(self, id: str, name: str, image: str, uri: str) -> None:
        self.id = id
        self.name = name
        self.image = image
        self.uri = uri

class SpotifyDataBase(AccountsDataBase):

    def __init__(self) -> None:
        super().__init__()

    def getSongs(self, ids: list[str]) -> list[DbSpotifySongObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, name, image, uri, artists, preview_url FROM 'spotify-song' WHERE {idQuery}"
        res = self.fetchAll(query)
        songs: list[DbSpotifySongObject] = []
        for song in res:
            id, name, image, uri, artists, previewUrl = song[0], song[1], song[2], song[3], song[4], song[5]
            songs.append(DbSpotifySongObject(id, name, image, uri, artists, previewUrl))
        return songs

    def addSongs(self, songs: list[dict]):
        if (len(songs) == 0):
            return
        
        valuesString = ""
        for i, song in enumerate(songs):
            self.sanitizeDbInput(song)
            valuesString += f"('{song['id']}', '{song['name']}', '{song['image']}', '{song['uri']}', '{song['artists']}', '{song['previewUrl']}')"
            if (i < len(songs) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'spotify-song' (id, name, image, uri, artists, preview_url) VALUES {valuesString}"
        self.execute(query)

    def getArtists(self, ids: list[str]) -> list[DbSpotifyArtistObject]:
        if (len(ids) == 0):
            return []
        
        idQuery = ""
        for i, id in enumerate(ids):
            idQuery += f"id = '{id}'"
            if (i < len(ids) - 1):
                idQuery += " OR "

        query = f"SELECT id, name, image, uri, FROM 'spotify-artist' WHERE {idQuery}"
        res = self.fetchAll(query)
        artists: list[DbSpotifyArtistObject] = []
        for artist in res:
            id, name, image, uri = artist[0], artist[1], artist[2], artist[3]
            artists.append(DbSpotifyArtistObject(id, name, image, uri))
        return artists

    def addArtists(self, artists: list[dict]):
        if (len(artists) == 0):
            return
        
        valuesString = ""
        for i, artist in enumerate(artists):
            self.sanitizeDbInput(artist)
            valuesString += f"('{artist['id']}', '{artist['name']}', '{artist['image']}', '{artist['uri']}')"
            if (i < len(artists) - 1):
                valuesString += ", "

        query = f"INSERT OR REPLACE INTO 'spotify-artist' (id, name, image, uri) VALUES {valuesString}"
        self.execute(query)

