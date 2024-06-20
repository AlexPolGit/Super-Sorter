import json
import time
import itertools
import random
import re
import requests
from google_images_search import GoogleImagesSearch
import googleapiclient
from util.logging import GLOBAL_LOGGER as logger
from util.env_vars import getEnvironmentVariable
from util.requests import getRequest, postRequest
from domain.objects.exceptions.base import BaseSorterException
from domain.objects.models.spotify import SpotifySong, SpotifyArtist
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
        self.__googleCustomSearchKey = getEnvironmentVariable("GOOGLE_CUSTOM_SEARCH_DEV_KEY", False)
        self.__googleCustomSearchCX = getEnvironmentVariable("GOOGLE_CUSTOM_SEARCH_CX", False)
        self.__generateAccessToken()

    def getPlaylistTracks(self, playlistId: str) -> any:
        token = self.__getAccessToken()
        batches = []
        requestUrl = f"{self.SPOTIFY_API_URL}/playlists/{playlistId}/tracks?fields=next,items(track(id,name,artists(id,name),uri,is_local,preview_url,album(id,images)))&locale=en_CA&offset=0&limit=100"
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

        self.populateArtists(requestedSongs)
        return requestedSongs

    def populateArtists(self, songs: list):
        for song in songs:
            song["artistList"] = self.getArtists(song["artists"].split(","))

    def __getCustomSongImage(song: SpotifySong) -> str:
        query = song.album if song.album else ' '.join([song.name, song.artists])

        _search_params={
            'q': query,
            'num': 1
        }

        album_cover_url = ''
        try:
            gis = GoogleImagesSearch(this.__googleCustomSearchKey, this.__googleCustomSearchCX)
            gis.search(search_params=_search_params)
            for image in gis.results():
                album_cover_url = __clean_google_image_url(image.url)
        except googleapiclient.errors.HttpError as e:
            if e.resp.status == 429:
                album_cover_url = 'https://i.imgur.com/Gvgmuwr.jpg'
            else:
                raise e

        background = 'https://raw.githubusercontent.com/AlexPolGit/Super-Sorter/main/src/client/src/assets/spotify-empty-song.jpg'

        custom_song_image_url = f'https://api.memegen.link/images/custom/_/{song.artists}~n{song.name}~n{song.album}~n~n%C2%A0.png?background={background}&font=jp&center=.5%2C.324&scale=0.49&style={album_cover_url}'

        return custom_song_image_url

    def __clean_google_image_url(url: str) -> str:
        if re.search('media-amazon', url):
            re_split = re.split('(.*\.).*?\.(jpg|png|gif|jpeg|svg|webp)', url)
            return ''.join(re_split)
        else:
            return url

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
