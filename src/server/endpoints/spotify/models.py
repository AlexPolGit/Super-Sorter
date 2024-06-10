from flask_restx import Model, fields

SPOTIFY_GET_SONGS_IN_PLAYLIST = Model("PlaylistSongsQuery", {
    "playlistId": fields.String(example="37i9dQZF1DXafb0IuPwJyF"),
    "query": fields.String(example="tracks.items(track(id,name,artists(id),uri,is_local,preview_url,album(id,images)))")
})

SPOTIFY_GET_ARTISTS = Model("ArtistsQuery", {
    "ids": fields.String(example="0pWR7TsFhvSCnbmHDjWgrE,6n4SsAp5VjvIBg3s9QCcPX")
})

SPOTIFY_SONG = Model("SpotifySong", {
    "id": fields.String(example="3nWcF4pDBjNdtbKgehwfz8"),
    "name": fields.String(example="サントラ"),
    "image": fields.String(example="https://i.scdn.co/image/ab67616d00004851beb8a0b2e635a159e6b1a475"),
    "uri": fields.String(example="spotify:track:3nWcF4pDBjNdtbKgehwfz8"),
    "artists": fields.String(example="0pWR7TsFhvSCnbmHDjWgrE,6n4SsAp5VjvIBg3s9QCcPX"),
    "previewUrl": fields.String(example="https://p.scdn.co/mp3-preview/72f8c373b840af9d36c993a0c4b35ae6fb63dffb?cid=2b5e055894f549da9b5ddc096b657868")
})

SPOTIFY_SONGS = Model("SpotifySongs", {
    "songs": fields.List(fields.Nested(SPOTIFY_SONG))
})

SPOTIFY_ADD_SONG = Model("SpotifyAddSong", {
    "songs": fields.List(fields.Nested(SPOTIFY_SONG))
})

SPOTIFY_SONG_QUERY = Model("SpotifySongQuery", {
    "ids": fields.List(fields.String(example="3nWcF4pDBjNdtbKgehwfz8"))
})

SPOTIFY_ARTIST = Model("SpotifyArtist", {
    "id": fields.String(example="2SIBY7Jwq1kYng12Zguo3C"),
    "name": fields.String(example="ReoNa"),
    "image": fields.String(example="https://i.scdn.co/image/ab6761610000e5eb37e9918520ec71230ecbe441"),
    "uri": fields.String(example="spotify:artist:2SIBY7Jwq1kYng12Zguo3C")
})

SPOTIFY_ARTISTS = Model("SpotifyArtists", {
    "artists": fields.List(fields.Nested(SPOTIFY_ARTIST))
})

SPOTIFY_ADD_ARTIST = Model("SpotifyAddArtist", {
    "artists": fields.List(fields.Nested(SPOTIFY_ARTIST))
})

SPOTIFY_ARTIST_QUERY = Model("SpotifyArtistQuery", {
    "ids": fields.List(fields.String(example="3nWcF4pDBjNdtbKgehwfz8"))
})