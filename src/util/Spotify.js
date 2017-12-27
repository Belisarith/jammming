import { redirectUri } from "./Constants.js";
let accessToken = "";
let expiresIn = "";
let userId = "";
let clientId = "3736c7f452654b798ce2275f6df30cfa";

const Spotify = {
***REMOVED***
    Spotify.getAccessToken();
***REMOVED***,

  getAccessToken() {
    if (accessToken) return;

    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-public`;

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
    let playlistID = "";

    return Spotify.getUserId().then(() => {
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
***REMOVED***,

  getUserId() {
    if (!userId) {
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
        .then(respJson => (userId = respJson.id));
  ***REMOVED*** else {
      return Promise.resolve("Success");
  ***REMOVED***
***REMOVED***
***REMOVED***

export default Spotify;
