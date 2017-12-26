import {redirectUri} from './Constants.js'


let accessToken = '';
let expiresIn;

const Spotify = {
        init(){
        this.getAccessToken();
    },
    
    getAccessToken(){
        let clientId = "3736c7f452654b798ce2275f6df30cfa"        
        let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-public`;   

        if(accessToken) return true;    
        
        let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
        let regExExpiresIn = window.location.href.match(/expires_in=([^&]*)/)
        accessToken = regExAccessToken  ? regExAccessToken[1] : "" ;          
        expiresIn = regExExpiresIn  ? regExExpiresIn[1] : 0; 


        if(!accessToken){
            window.location.replace(url);             
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        }

    },
    
    search(term){
        let url = "https://api.spotify.com/v1/search?type=track&q="+term;
        return fetch(url,{
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => {
            if(response.ok){
               return response.json();
            }
            throw new Error('Connection failed!');            
        }).then(respJson=>{
            
            return respJson.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            });
        });        
    },



    savePlaylist(playlistName,trackUri){
        if(!(playlistName && trackUri.length>0)) return;
        let userId = '';
        let playlistID = '';

        //Not the best way. UserId is retrieved every time a playlist is saved.
        //Necessary to resolve promise first before continuation. Therefore fetch-POST nested in fetch-GET
        //Looks quite ugly: Should be refractored, at least.

        return fetch('https://api.spotify.com/v1/me',{
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response =>{
            if(response.ok){
                return response.json();
             }
             throw new Error('Failure retrieving Spotify-userId');         //TODO: What good are uncaught exceptions??? 
        }).then(respJson=>{
            userId = respJson.id;
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'name': playlistName,
                    'public': 'true'
            })
        }).then(response=> {
                if(response.ok){
                    return response.json();
                }
                throw new Error('Failure retrieving Spotify-playlistId');   
            }).then(respJson=>{
                playlistID = respJson.id;
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,{
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: trackUri
                    })
                });
            })
            
            ;
        });

        
        


      
    }
}

export default Spotify;