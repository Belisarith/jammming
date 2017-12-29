import Spotify from "./Spotify.js";
import Deezer from "./Deezer.js";

class MusicService {
  constructor(serviceName) {
    this.serviceName = serviceName;
    switch (serviceName) {
      case "Deezer":
        this.search = Deezer.search;
        this.getPlaylists = Deezer.getPlaylists;
        this.getPlaylistTracks = Deezer.getPlaylistTracks;
        this.init = Deezer.init;
        this.refinedSearch = Deezer.refinedSearch;
        break;
      default:
        this.search = Spotify.search;
        this.getPlaylists = Spotify.getPlaylists;
        this.getPlaylistTracks = Spotify.getPlaylistTracks;
        this.init = Spotify.init;
        this.refinedSearch = Spotify.refinedSearch;
    }
  }

  savePlaylist(playlistName, tracks) {
    switch (this.serviceName) {
      case "Deezer":
        return Deezer.savePlaylist(playlistName, tracks.map(track => track.id));
      default:
        return Spotify.savePlaylist(
          playlistName,
          tracks.map(track => track.uri)
        );
    }
  }
}

export default MusicService;
