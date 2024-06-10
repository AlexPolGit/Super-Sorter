import time
from util.logging import GLOBAL_LOGGER as logger
from util.env_vars import getEnvironmentVariable
from util.requests import postRequest

class Spotify:
    SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
    __clientId: str = None
    __clientSecret: str = None
    __accessToken: str = None
    __tokenExpiry: float = None
    
    def __init__(self) -> None:
        self.__clientId = getEnvironmentVariable("SPOTIFY_CLIENT_ID")
        self.__clientSecret = getEnvironmentVariable("SPOTIFY_CLIENT_SECRET")
        self.generateAccessToken()

    def getAccessToken(self) -> tuple[str, float]:
        if self.accessTokenHasExpired():
            self.generateAccessToken()
        return (self.__accessToken, self.__tokenExpiry)

    def generateAccessToken(self) -> None:
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

    def accessTokenHasExpired(self) -> bool:
        if (self.__tokenExpiry == None):
            return True

        now = time.time()
        isExpired = now > self.__tokenExpiry
        if (isExpired):
            logger.info(f"Spotify access token is expired. Now: {now}, Expiry: {self.__tokenExpiry} ({self.__tokenExpiry - now} seconds)")
        return isExpired
