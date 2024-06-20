from database.sorter_database import SorterDataBase
from domain.objects.models.spotify import SpotifySong, SpotifyArtist

class SpotifyDataBase(SorterDataBase):

    def getSpotifySongs(self, ids: list[str]) -> list[SpotifySong]:
        return self._selectMultiple(SpotifySong, SpotifySong.id.in_(ids))

    def addSpotifySongs(self, songs: list[dict]) -> list[SpotifySong]:
        songsToAdd = []
        for song in songs:
            spotifySong = SpotifySong()
            spotifySong.id = song["id"]
            spotifySong.name = song["name"]
            if ("image" in song):
                spotifySong.image = song["image"]
            if ("uri" in song):
                spotifySong.uri = song["uri"]
            if ("artists" in song):
                spotifySong.artists = song["artists"]
            if ("preview_url" in song):
                spotifySong.preview_url = song["preview_url"]
            songsToAdd.append(spotifySong)
        
        self._insertMultiple(songsToAdd)
        newSongIds: list[str] = map(lambda song: song["id"], songs)
        return self.getSpotifySongs(newSongIds)

    def getSpotifyArtists(self, ids: list[str]) -> list[SpotifyArtist]:
        return self._selectMultiple(SpotifyArtist, SpotifyArtist.id.in_(ids))

    def addSpotifyArtists(self, artists: list[dict]) -> list[SpotifyArtist]:
        artistsToAdd = []
        for artist in artists:
            spotifyArtist = SpotifyArtist()
            spotifyArtist.id = artist["id"]
            spotifyArtist.name = artist["name"]
            if ("image" in artist):
                spotifyArtist.image = artist["image"]
            if ("uri" in artist):
                spotifyArtist.uri = artist["uri"]
            artistsToAdd.append(spotifyArtist)
        
        self._insertMultiple(artistsToAdd)
        newArtistIds: list[str] = map(lambda artist: artist["id"], artists)
        return self.getSpotifyArtists(newArtistIds)
