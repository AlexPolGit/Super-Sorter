import json
import time
from functools import reduce 
from util.logging import GLOBAL_LOGGER as logger
from util.env_vars import getEnvironmentVariable
from util.requests import getRequest, postRequest
from db.spotify.spotify import SpotifyDataBase

class SpotifySong:
    def __init__(self, id: str, name: str, image: str, uri: str, artists: str, previewUrl: str) -> None:
        self.id = id
        self.name = name
        self.image = image
        self.uri = uri
        self.artists = artists
        self.previewUrl = previewUrl

    def asObject(self):
        return json.loads(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))

class SpotifyArtist:
    def __init__(self, id: str, name: str, image: str, uri: str) -> None:
        self.id = id
        self.name = name
        self.image = image
        self.uri = uri

    def asObject(self):
        return json.loads(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))

class Spotify:
    database: SpotifyDataBase
    songCache: dict[str, SpotifySong]
    artistCache: dict[str, SpotifyArtist]
    SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
    SPOTIFY_API_URL = "https://api.spotify.com/v1"
    __clientId: str = None
    __clientSecret: str = None
    __accessToken: str = None
    __tokenExpiry: float = None
    
    def __init__(self) -> None:
        self.database = SpotifyDataBase()
        self.songCache = {}
        self.artistCache = {}
        self.__clientId = getEnvironmentVariable("SPOTIFY_CLIENT_ID")
        self.__clientSecret = getEnvironmentVariable("SPOTIFY_CLIENT_SECRET")
        self.__generateAccessToken()

    def playlistQuery(self, playlistId: str, query: str) -> any:
        token = self.__getAccessToken()
        return getRequest(
            f"{self.SPOTIFY_API_URL}/playlists/{playlistId}?fields={query}&locale=en_CA",
            {
                "Authorization": f"Bearer {token}"
            }
        ).json()
    
    def multipleArtistQuery(self, ids: str) -> any:
        idBatches = self.batchIds(ids)
        batches = []
        for idBatch in idBatches:
            idList = ','.join(idBatch)
            token = self.__getAccessToken()
            batch = getRequest(
                f"{self.SPOTIFY_API_URL}/artists?ids={idList}&locale=en_CA",
                {
                    "Authorization": f"Bearer {token}"
                }
            ).json()["artists"]
            batches.append(batch)
        return {
            "artists": reduce(lambda a, b: a + b, batches)
        }
    
    def batchIds(self, ids: str, batchSize: int = 50):
        idList = ids.split(",")
        for i in range(0, len(idList), batchSize):
            yield idList[i:i + batchSize]
    
    def __getAccessToken(self) -> str:
        if self.__accessTokenHasExpired():
            self.__generateAccessToken()
        return self.__accessToken

    def __generateAccessToken(self) -> None:
        accessTokeRequest = postRequest(
            self.SPOTIFY_TOKEN_URL,
            {
                "grant_type": "client_credentials",
                "client_id": self.__clientId,
                "client_secret": self.__clientSecret
            },
            {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )

        response = accessTokeRequest.json()
        self.__accessToken = response["access_token"]
        self.__tokenExpiry = time.time() + (float(response["expires_in"]) - 60)
        logger.info(f"Generated new Spotify access token. Expiry: {self.__tokenExpiry}")

    def __accessTokenHasExpired(self) -> bool:
        if (self.__tokenExpiry == None):
            return True

        now = time.time()
        isExpired = now > self.__tokenExpiry
        if (isExpired):
            logger.info(f"Spotify access token is expired. Now: {now}, Expiry: {self.__tokenExpiry} ({self.__tokenExpiry - now} seconds)")
        return isExpired
    
    def addSong(self, songs: list[dict]) -> None:
        self.database.addSongs(songs)
        for song in songs:
            self.songCache[song['id']] = SpotifySong(song['id'], song['name'], song['image'], song['uri'], song['artists'], song['previewUrl'])

    def getSongs(self, ids: list[str]) -> list:
        requestedSongs: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.songCache):
                logger.debug(f"Cache miss on Spotify song '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Spotify song cache.")
                requestedSongs.append(self.songCache.get(id).asObject())
        
        dbList = self.database.getSongs(notCached)

        for song in dbList:
            spotifySong = SpotifySong(song.id, song.name, song.image, song.uri, song.artists, song.previewUrl)
            requestedSongs.append(spotifySong.asObject())
            self.songCache[song.id] = spotifySong
            # ogger.debug(f"Added missing to Spotify song cache: '{song.id}'")

        return requestedSongs

    def addArtists(self, artists: list[dict]) -> None:
        self.database.addArtists(artists)
        for artist in artists:
            self.artistCache[artist['id']] = SpotifyArtist(artist['id'], artist['name'], artist['image'], artist['uri'])

    def getArtists(self, ids: list[str]) -> list:
        requestedArtists: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.artistCache):
                logger.debug(f"Cache miss on Spotify artist '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Spotify artist cache.")
                requestedArtists.append(self.artistCache.get(id).asObject())
        
        dbList = self.database.getArtists(notCached)

        for artist in dbList:
            spotifyArtist = SpotifyArtist(artist.id, artist.name, artist.image, artist.uri)
            requestedArtists.append(spotifyArtist.asObject())
            self.artistCache[artist.id] = spotifyArtist
            # ogger.debug(f"Added missing to Spotify artist cache: '{artist.id}'")

        return requestedArtists