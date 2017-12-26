import Spotify from './Spotify.js'
import Deezer from './Deezer.js'

class MusicService{
    constructor(serviceName){
        this.serviceName = serviceName;
        switch(serviceName){
            case 'Deezer':
                this.search = Deezer.search;
                Deezer.init();
                break;
            default:
                this.search = Spotify.search;
                Spotify.init();
        }
    }

    savePlaylist(playlistName,tracks){
        switch(this.serviceName){
            case 'Deezer':
                return Deezer.savePlaylist(playlistName,tracks.map(track=>track.id));
            default:
                return Spotify.savePlaylist(playlistName,tracks.map(track=>track.uri));

        }
    }
}

export default MusicService;