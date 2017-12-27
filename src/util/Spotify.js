import { redirectUri } from "./Constants.js";

let accessToken = "";
let expiresIn;

const Spotify = {
***REMOVED***
    this.getAccessToken();
***REMOVED***,

  getAccessToken() {
    let clientId = "3736c7f452654b798ce2275f6df30cfa";
    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-public`;

    if (accessToken) return true;

    let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let regExExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    accessToken = regExAccessToken ? regExAccessToken[1] : "";
    expiresIn = regExExpiresIn ? regExExpiresIn[1] : 0;

    if (!accessToken) {
      window.location.replace(url);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
  ***REMOVED***
***REMOVED***,

  search(term) {
    let url = "https://api.spotify.com/v1/search?type=track&q=" + term;
    return fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
  ***REMOVED***)
      .then(response => {
        if (response.ok) {
          return response.json();
  ***REMOVED***
        throw new Error("Connection failed!");
***REMOVED***)
      .then(respJson => {
        return respJson.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
    ***REMOVED***;
  ***REMOVED***);
***REMOVED***);
***REMOVED***,

  savePlaylist(playlistName, trackUri) {
    if (!(playlistName && trackUri.length > 0)) return;
    let userId = "";
    let playlistID = "";

    //Not the best way. UserId is retrieved every time a playlist is saved.
    //Necessary to resolve promise first before continuation. Therefore fetch-POST nested in fetch-GET
    //Looks quite ugly: Should be refractored, at least.

    return fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
  ***REMOVED***)
      .then(response => {
        if (response.ok) {
          return response.json();
  ***REMOVED***
        throw new Error("Failure retrieving Spotify-userId"); //TODO: What good are uncaught exceptions???
***REMOVED***)
      .then(respJson => {
        userId = respJson.id;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
    ***REMOVED***,
          body: JSON.stringify({
            name: playlistName,
            public: "true"
    ***REMOVED***)
  ***REMOVED***)
          .then(response => {
            if (response.ok) {
              return response.json();
      ***REMOVED***
            throw new Error("Failure retrieving Spotify-playlistId");
    ***REMOVED***)
          .then(respJson => {
            playlistID = respJson.id;
            fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + accessToken,
                  "Content-Type": "application/json"
          ***REMOVED***,
                body: JSON.stringify({
                  uris: trackUri
          ***REMOVED***)
        ***REMOVED***
            );
    ***REMOVED***);
***REMOVED***);
***REMOVED***
***REMOVED***

export default Spotify;
