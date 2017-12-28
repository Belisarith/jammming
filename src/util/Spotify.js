import { redirectUri } from "./Constants.js";
let accessToken = "";
let expiresIn = "";
let userId = "";
let clientId = "3736c7f452654b798ce2275f6df30cfa";

const Spotify = {
  init() {
    Spotify.getAccessToken();
  },

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
    }
  },

  search(term) {
    let url = "https://api.spotify.com/v1/search?type=track&q=" + term;

    return fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Connection failed!");
      })
      .then(respJson => {
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

  savePlaylist(playlistName, trackUri) {
    if (!(playlistName && trackUri.length > 0)) return;
    let playlistID = "";

    return Spotify.getUserId().then(() => {
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: playlistName,
          public: "true"
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving Spotify-playlistId");
        })
        .then(respJson => {
          playlistID = respJson.id;
          fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                uris: trackUri
              })
            }
          );
        });
    });
  },

  getUserId() {
    if (!userId) {
      return fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving Spotify-userId"); //TODO: What good are uncaught exceptions???
        })
        .then(respJson => (userId = respJson.id));
    } else {
      return Promise.resolve("Success");
    }
  },

  getPlaylists() {
    return Spotify.getUserId().then(() => {
      let url = `https://api.spotify.com/v1/users/${userId}/playlists`;
      return fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving Spotify playlists"); //TODO: What good are uncaught exceptions???
        })
        .then(respJson => {
          return respJson.items.map(playList => {
            return {
              identifier: playList.id,
              name: playList.name
            };
          });
        });
    });
  },

  getPlaylistTracks(playlistId) {
    return Spotify.getUserId().then(() => {
      let url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
      return fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving songs from Spotify playlist"); //TODO: What good are uncaught exceptions???
        })
        .then(respJson => {
          return respJson.items.map(element => {
            return {
              id: element.track.id,
              name: element.track.name,
              artist: element.track.artists[0].name,
              album: element.track.album.name,
              uri: element.track.uri
            };
          });
        });
    });
  }
};

export default Spotify;
