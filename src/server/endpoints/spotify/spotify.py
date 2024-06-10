from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_SPOTIFY, AuthenticatedResource
from endpoints.spotify.models import ACCESS_TOKEN

spotify = Namespace("Spotify", description = "Endpoints getting spotify-related data.")

CommonErrorModel = spotify.add_model("Error", COMMON_ERROR_MODEL)

AccessTokenModel = spotify.add_model("AccessToken", ACCESS_TOKEN)

@spotify.route("/token")
@spotify.response(500, "InternalError", CommonErrorModel)
class Items(AuthenticatedResource):
    @spotify.response(200, "Spotify token and expiry time.", AccessTokenModel)
    @spotify.doc(security='basicAuth')
    def get(self):
        token, expiry = GLOBAL_SPOTIFY.getAccessToken()
        return {
            "token": token,
            "expiry": expiry
        }
