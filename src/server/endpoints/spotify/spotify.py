from flask import request
from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_SPOTIFY, AuthenticatedResource
from endpoints.spotify.models import SPOTIFY_GET_SONGS_IN_PLAYLIST, SPOTIFY_GET_ARTISTS
from endpoints.spotify.models import SPOTIFY_SONG, SPOTIFY_ADD_SONG, SPOTIFY_SONG_QUERY, SPOTIFY_SONGS
from endpoints.spotify.models import SPOTIFY_ARTIST, SPOTIFY_ADD_ARTIST, SPOTIFY_ARTIST_QUERY, SPOTIFY_ARTISTS

spotify = Namespace("Spotify", description = "Endpoints getting spotify-related data.")

CommonErrorModel = spotify.add_model("Error", COMMON_ERROR_MODEL)

playlistSongsQueryModel = spotify.add_model("PlaylistSongsQuery", SPOTIFY_GET_SONGS_IN_PLAYLIST)
artistsQueryModel = spotify.add_model("ArtistsQuery", SPOTIFY_GET_ARTISTS)

spotify.add_model("SpotifySong", SPOTIFY_SONG)
spotifyAddSongModel = spotify.add_model("SpotifyAddSong", SPOTIFY_ADD_SONG) 
spotifySongQueryModel = spotify.add_model("SpotifySongQuery", SPOTIFY_SONG_QUERY) 
spotifySongsModel = spotify.add_model("SpotifySongs", SPOTIFY_SONGS)

spotify.add_model("SpotifyArtist", SPOTIFY_ARTIST)
spotifyAddArtistModel = spotify.add_model("SpotifyAddArtist", SPOTIFY_ADD_ARTIST) 
spotifyArtistQueryModel = spotify.add_model("SpotifyArtistQuery", SPOTIFY_ARTIST_QUERY) 
spotifyArtistsModel = spotify.add_model("SpotifyArtists", SPOTIFY_ARTISTS)

@spotify.route("/query/playlistsongs")
@spotify.response(500, "InternalError", CommonErrorModel)
class PlaylistSongsQuery(AuthenticatedResource):
    @spotify.expect(playlistSongsQueryModel)
    @spotify.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return GLOBAL_SPOTIFY.getPlaylistTracks(requestData["playlistId"])
    
@spotify.route("/query/artists")
@spotify.response(500, "InternalError", CommonErrorModel)
class ArtistsQuery(AuthenticatedResource):
    @spotify.expect(artistsQueryModel)
    @spotify.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return GLOBAL_SPOTIFY.multipleArtistQuery(requestData["ids"])

@spotify.route("/songs")
@spotify.response(500, "InternalError", CommonErrorModel)
class Songs(AuthenticatedResource):
    @spotify.expect(spotifyAddSongModel)
    @spotify.response(200, "SpotifySongs", spotifySongsModel)
    @spotify.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        GLOBAL_SPOTIFY.addSong(requestData["songs"])
    
@spotify.route("/songs/list")
@spotify.response(500, "InternalError", CommonErrorModel)
class GetSongs(AuthenticatedResource):
    @spotify.expect(spotifySongQueryModel)
    @spotify.response(200, "SpotifySongs", spotifySongsModel)
    @spotify.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return GLOBAL_SPOTIFY.getSongs(requestData["ids"])

@spotify.route("/artists")
@spotify.response(500, "InternalError", CommonErrorModel)
class Artists(AuthenticatedResource):
    @spotify.expect(spotifyAddArtistModel)
    @spotify.response(200, "SpotifyArtists", spotifyArtistsModel)
    @spotify.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        GLOBAL_SPOTIFY.addArtists(requestData["artists"])
    
@spotify.route("/artists/list")
@spotify.response(500, "InternalError", CommonErrorModel)
class GetArtists(AuthenticatedResource):
    @spotify.expect(spotifyArtistQueryModel)
    @spotify.response(200, "SpotifyArtists", spotifyArtistsModel)
    @spotify.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return GLOBAL_SPOTIFY.getArtists(requestData["ids"])
