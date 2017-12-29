import { redirectUri } from "./Constants.js";
let accessToken = "";
let expiresIn = "";
let userId = "";
let clientId = "3736c7f452654b798ce2275f6df30cfa";

const Spotify = {
***REMOVED***
    return Spotify.getAccessToken();
***REMOVED***,

  getAccessToken() {
    if (sessionStorage.getItem("SpotifyToken")) {
      accessToken = sessionStorage.getItem("SpotifyToken");
      return Promise.resolve("Successful");
  ***REMOVED***

    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-private playlist-read-private`;

    let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let regExExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    accessToken = regExAccessToken ? regExAccessToken[1] : "";
    expiresIn = regExExpiresIn ? regExExpiresIn[1] : 0;

    if (accessToken) {
      sessionStorage.setItem("SpotifyToken", accessToken);
      window.setTimeout(() => {
        sessionStorage.setItem("SpotifyToken", "");
        accessToken = "";
***REMOVED***, expiresIn * 1000);
      window.location.replace(redirectUri);
  ***REMOVED*** else {
      window.location.replace(url);
  ***REMOVED***
***REMOVED***,

  refinedSearch(track, artist) {
    let url = `https://api.spotify.com/v1/search?q=track:${track}+artist:${artist}&type=track`;

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
        if (!respJson || !respJson.tracks) return undefined;
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

  search(term) {
    let url =
      "https://api.spotify.com/v1/search?type=track&q=" +
      term +
      "&offset=0&limit=25";

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
        if (!respJson || !respJson.tracks) return undefined;
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
          let limit = 100;
          playlistID = respJson.id;

          for (
            let offset = 0;
            offset <= trackUri.length - 1;
            offset = offset + limit
          ) {
            fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + accessToken,
                  "Content-Type": "application/json"
          ***REMOVED***,
                body: JSON.stringify({
                  uris: trackUri.slice(offset, offset + limit)
          ***REMOVED***)
        ***REMOVED***
            );
    ***REMOVED***
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
***REMOVED***,

  getPlaylists() {
    return Spotify.getUserId().then(() => {
      let url = `https://api.spotify.com/v1/users/${userId}/playlists`;
      return fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
***REMOVED***)
        .then(response => {
          if (response.ok) {
            return response.json();
    ***REMOVED***
          throw new Error("Failure retrieving Spotify playlists"); //TODO: What good are uncaught exceptions???
  ***REMOVED***)
        .then(respJson => {
          return respJson.items.map(playList => {
            return {
              identifier: playList.id,
              name: playList.name
      ***REMOVED***;
    ***REMOVED***);
  ***REMOVED***);
  ***REMOVED***);
***REMOVED***,

  getNumberOfTracksInPlaylist(playlistId) {
    return Spotify.getUserId().then(() => {
      let url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;

      return fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
***REMOVED***)
        .then(response => {
          if (response.ok) {
            return response.json();
    ***REMOVED***
          throw new Error("Failure retrieving songs from Spotify playlist"); //TODO: What good are uncaught exceptions???
  ***REMOVED***)
        .then(respJson => {
          return respJson.total;
  ***REMOVED***);
  ***REMOVED***);
***REMOVED***,

  getPlaylistTracks(playlistId) {
    return Spotify.getUserId().then(() => {
      let limit = 100;
      let offset = 0;
      return Spotify.getNumberOfTracksInPlaylist(playlistId)
        .then(total => {
          let playListPages = [];
          for (offset = 0; offset <= total; offset = offset + limit) {
            let url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`;
            playListPages = playListPages.concat(
              fetch(url, {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken }
        ***REMOVED***)
                .then(response => {
                  if (response.ok) {
                    return response.json();
            ***REMOVED***
                  throw new Error(
                    "Failure retrieving songs from Spotify playlist"
                  ); //TODO: What good are uncaught exceptions???
          ***REMOVED***)
                .then(respJson => {
                  return respJson.items.map(element => {
                    return {
                      id: element.track.id,
                      name: element.track.name,
                      artist: element.track.artists[0].name,
                      album: element.track.album.name,
                      uri: element.track.uri
              ***REMOVED***;
            ***REMOVED***);
          ***REMOVED***)
            );
    ***REMOVED***
          return Promise.all(playListPages);
  ***REMOVED***)
        .then(playListPages => {
          return [].concat.apply([], playListPages);
  ***REMOVED***);
  ***REMOVED***);
***REMOVED***
***REMOVED***

export default Spotify;
