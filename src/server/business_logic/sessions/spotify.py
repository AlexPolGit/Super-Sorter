import json
import time
import itertools
import requests
from util.logging import GLOBAL_LOGGER as logger
from util.env_vars import getEnvironmentVariable
from util.requests import getRequest, postRequest
from business_logic.objects.exceptions.base import BaseSorterException
from business_logic.objects.models.spotify import SpotifySong, SpotifyArtist
from database.spotify import SpotifyDataBase

class SpotifyPlaylistRetrievalException(BaseSorterException):
    errorCode = 500

    def __init__(self, id: str) -> None:
        super().__init__(f"Could not get Spotify playlist with ID: \"{id}\".")

class SpotifyPlaylistNotFoundException(BaseSorterException):
    errorCode = 404

    def __init__(self, id: str) -> None:
        super().__init__(f"Could not find Spotify playlist with ID: \"{id}\".")

class SpotifyArtistRetrievalException(BaseSorterException):
    errorCode = 500

    def __init__(self, ids: str) -> None:
        super().__init__(f"Could not get Spotify artists: \"{ids}\".")

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
    
    def getPlaylistTracks(self, playlistId: str) -> any:
        token = self.__getAccessToken()
        batches = []
        requestUrl = f"{self.SPOTIFY_API_URL}/playlists/{playlistId}/tracks?fields=next,items(track(id,name,artists(id),uri,is_local,preview_url,album(id,images)))&locale=en_CA&offset=0&limit=100"
        while (True):
            try:
                batch = getRequest(
                    requestUrl,
                    {
                        "Authorization": f"Bearer {token}"
                    }
                ).json()
                batches.append(batch["items"])
                if (batch["next"] == None):
                    break
                else:
                    requestUrl = batch["next"]
            except requests.exceptions.HTTPError as errh: 
                if (errh.response.status_code == 404):
                    raise SpotifyPlaylistNotFoundException(playlistId)
                else:
                    raise SpotifyPlaylistRetrievalException(playlistId)
            except Exception as e:
                raise e
            
        return {
            "items": list(itertools.chain(*batches))
        }
    
    def multipleArtistQuery(self, ids: str) -> any:
        idBatches = self.batchIds(ids)
        batches = []
        for idBatch in idBatches:
            idList = ','.join(idBatch)
            token = self.__getAccessToken()
            try:
                batch = getRequest(
                    f"{self.SPOTIFY_API_URL}/artists?ids={idList}&locale=en_CA",
                    {
                        "Authorization": f"Bearer {token}"
                    }
                ).json()["artists"]
                batches.append(batch)

            except requests.exceptions.HTTPError as errh: 
                raise SpotifyArtistRetrievalException(idList)
            except Exception as e:
                raise e
            
        return {
            "artists": list(itertools.chain(*batches))
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
        newSongs = self.database.addSpotifySongs(songs)
        for song in newSongs:
            self.songCache[song.id] = song

    def getSongs(self, ids: list[str]) -> list:
        requestedSongs: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.songCache):
                logger.debug(f"Cache miss on Spotify song '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Spotify song cache.")
                requestedSongs.append(self.songCache.get(id).getMap())
        
        dbList = self.database.getSpotifySongs(notCached)

        for spotifySong in dbList:
            requestedSongs.append(spotifySong.getMap())
            self.songCache[spotifySong.id] = spotifySong
            # logger.debug(f"Added missing to Spotify song cache: '{song.id}'")

        return requestedSongs

    def addArtists(self, artists: list[dict]) -> None:
        newArtists = self.database.addSpotifyArtists(artists)
        for artist in newArtists:
            self.artistCache[artist.id] = artist

    def getArtists(self, ids: list[str]) -> list:
        requestedArtists: list = []
        notCached: list[str] = []

        for id in ids:
            if (not id in self.artistCache):
                logger.debug(f"Cache miss on Spotify artist '{id}'.")
                notCached.append(id)
            else:
                # logger.debug(f"Found '{id}' in Spotify artist cache.")
                requestedArtists.append(self.artistCache.get(id).getMap())
        
        dbList = self.database.getSpotifyArtists(notCached)

        for spotifyArtist in dbList:
            requestedArtists.append(spotifyArtist.getMap())
            self.artistCache[spotifyArtist.id] = spotifyArtist
            # logger.debug(f"Added missing to Spotify artist cache: '{artist.id}'")

        return requestedArtists