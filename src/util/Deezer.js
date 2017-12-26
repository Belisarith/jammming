import {redirectUri} from './Constants.js'
import fetchJsonp from 'fetch-jsonp';

let accessToken = '';
let expiresIn;

const Deezer = {
    init(){
        this.getAccessToken();
  ***REMOVED***,

    getAccessToken(){
        let appId = '265642'
        let url = `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectUri}&perms=manage_library&response_type=token`


        if(accessToken) return true;    
        
        let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
        let regExExpiresIn = window.location.href.match(/expires=([^&]*)/)
        accessToken = regExAccessToken  ? regExAccessToken[1] : "" ;          
        expiresIn = regExExpiresIn  ? regExExpiresIn[1] : 0; 
 

        if(!accessToken){
            window.location.replace(url);    
            
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
  ***REMOVED***
  ***REMOVED***,

    search(term){
        let url = `https://api.deezer.com/search?q=track:"${term}"&output=jsonp`
        console.log(url);
        return fetchJsonp(url).then(response => {
            if(response.ok){
                return response.json();
      ***REMOVED***
            throw new Error('Failure searching deezer');   
  ***REMOVED***).then(respJson=>{
            return respJson.data.map(track => {
                return {
                    id: track.id,
                    name: track.title,
                    artist: track.artist.name,
                    album: track.album.title,
                    uri: track.link
          ***REMOVED***;
      ***REMOVED***);
  ***REMOVED***);        
  ***REMOVED***,

    savePlaylist(playlistName,trackId){

        console.log(accessToken);
        let userId = '';
        let playlistId = '';
        let url = "https://api.deezer.com/user/me&output=jsonp&access_token="+accessToken;
        console.log(url);
        return fetchJsonp(url).then(response=>{
            if(response.ok){
                return response.json();
      ***REMOVED***
            throw new Error('Failure accessing userid deezer');   
  ***REMOVED***).then(respJson => {
            userId = respJson.id;
            url = `https://api.deezer.com/user/${userId}/playlists/&output=jsonp&request_method=post&access_token=${accessToken}&title=${playlistName}`
            fetchJsonp(url).then(response=>{
                if(response.ok){
                    return response.json();
          ***REMOVED***
                throw new Error('Failure creating playlist deezer');  
      ***REMOVED***).then(respJson =>{
                playlistId = respJson.id;
                url = `http://api.deezer.com/playlist/${playlistId}/tracks/&output=jsonp&access_token=${accessToken}&songs=${trackId.join()}&request_method=post`
                fetchJsonp(url).then(response=>{
                    if(response.ok){
                        return response.json();
              ***REMOVED***
                    throw new Error('Failure adding songs deezer');  
          ***REMOVED***);
      ***REMOVED***);
            
  ***REMOVED***);
  ***REMOVED***
}

export default Deezer;